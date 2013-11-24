define(['jquery', 'extendable'], function($, Extendable) {
    /**
     * Module for dynamically loading pages (html/js pairs)
     * @exports PageLoader
     */
    var PageLoader = {
        /**
         * Initializes the module and returns a new instance of PageLoader.
         * @param {Object} p_params             Configuration object.
         * @param {String} p_params.selector    Element selector.
         * @param {String} p_params.htmlPrefix  Default url prefix for html
         * @param {String} p_params.jsPrefix    Default url prefix for js
         * scripts. Use this if the requirejs url is not the same as the
         * relative url for loading the html.
         * @return {PageLoader}                 An instance of PageLoader
         */
        init: function(p_params) {
            // element where the pages will be loaded
            var $el = $(p_params.selector);

            if ($el.length === 0) {
                throw new Error('element ' + p_params.selector + ' not found');
            }

            return this.extend({
                config: p_params,
                $element: $el
            });
        },
        /**
         * Define a callback to be executed if everything is loaded without
         * errors.
         *
         * @param  {Function}   p_callback  Success callback
         * @return {PageLoader}             this
         */
        success: function(p_callback) {
            this.callback = p_callback;
            return this;
        },
        /**
         * Define a callback to be executed if an error happens while loading.
         *
         * @param  {Function} p_errback   Error callback
         * @return {PageLoader}           this
         */
        fail: function(p_errback) {
            this.errback = p_errback;
            return this;
        },
        /**
         * Load a page from the specific path. If a new load request has been
         * placed and there is an unifinished load request, it will be
         * discarded.
         *
         * @param  {String} p_path  Relative url to load, will be prefixed with
         * p_params.path set in the init() function
         * @return {PageLoader}     this
         */
        load: function(p_path) {
            var timestamp = this.lastRequestTimestamp = new Date().getTime();

            var htmlUrl = this.config.htmlPrefix ?
                this.config.htmlPrefix + '/' + p_path: p_path;
            htmlUrl += '.html';
            var scriptUrl = this.config.jsPrefix ?
                this.config.jsPrefix + '/' + p_path : p_path;

            var pageId = p_path.replace(/[^a-zA-Z\-]/g, '_');
            var $page = this.$element.children('#' + pageId);

            if ($page.length) {
                this._showPage(timestamp, $page, scriptUrl, pageId);
            }
            else {
                this._loadNewPage(timestamp, scriptUrl, htmlUrl, pageId);
            }

            return this;
        },
        _checkExpired: function(p_timestamp) {
            // true if no other load request was placed after the current one.
            return this.lastRequestTimestamp > p_timestamp;
        },
        _showPage: function(timestamp, $page, scriptUrl, pageId) {
            var self = this;
            require([scriptUrl], function(module) {
                if (self.callback) {
                    var expired = self._checkExpired(timestamp);
                    self.callback(module, $page[0], expired);
                }
            }, function(err) {
                if (self.errback) {
                    var expired = self._checkExpired(timestamp);
                    self.errback(err, expired);
                    return;
                }
                throw err;
            });
        },
        _loadNewPage: function(timestamp, scriptUrl, htmlUrl, pageId) {
            var self = this;
            var $element = this.$element;

            var $page = $('<div>').attr('id', pageId).hide().appendTo($element);

            var module, err;
            function failHandler(p_err) {
                err = p_err;
            }

            var deferredScript = $.Deferred()
                .done(function(p_module) {
                    module = p_module;
                })
                .fail(failHandler);
            var deferredHtml = $.Deferred().fail(failHandler);

            this._loadHtml($page, htmlUrl, deferredHtml);
            this._loadScript(scriptUrl, deferredScript);

            $.when(deferredScript, deferredHtml)
                .then(function() {
                        if (self.callback) {
                            var expired = self._checkExpired(timestamp);
                            self.callback(module, $page[0], expired);
                        }
                    },
                    function() {
                        if (self.errback) {
                            var expired = self._checkExpired(timestamp);
                            self.errback(err, expired);
                            return;
                        }
                        throw err;
                    });
        },
        _loadHtml: function($page, url, deferred) {
            $page.load(url, function(response, status, xhr) {
                if (status === 'error') {
                    deferred.reject(new Error('Error loading ' + url + ': ' +
                        xhr.status));
                    return;
                }

                deferred.resolve($page);
            });
        },
        _loadScript: function(url, deferred) {
            require([url], function(module) {
                deferred.resolve(module);
            }, function(err) {
                deferred.reject(err);
            });
        }
    };

    return Extendable.extend(PageLoader).create();
});