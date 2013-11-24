define(['page-loader', 'jquery'], function(PageLoader, $) {
    describe('page-loader', function() {
        before(function() {
            $('<div>').attr('id', 'pages').appendTo('#test');
        });
        after(function() {
            $('#test').html('');
        });

        var loader;
        describe('init()', function() {
            it('should be ok', function() {
                loader = PageLoader.init({
                    selector: '#pages',
                    htmlPrefix: 'js/page-loader-test-data',
                    jsPrefix: '../../test/js/page-loader-test-data'
                });
                expect(loader).to.be.ok();
                expect(PageLoader.isPrototypeOf(loader)).to.be(true);
            });
        });
        describe('success()', function() {
            it('should add the callback function', function() {
                expect(typeof loader.callback).to.be('undefined');
                function callback(module) {}
                var retval = loader.success(callback);
                expect(retval).to.be(loader);
                expect(loader.callback).to.be(callback);
            });
        });
        describe('fail()', function() {
            it('should add the errback function', function() {
                expect(typeof loader.errback).to.be('undefined');
                function errback(err) {}
                var retval = loader.fail(errback);
                expect(retval).to.be(loader);
                expect(loader.errback).to.be(errback);
            });
        });
        describe('load() fail', function() {
            it('should call the errback', function(done) {
                loader.load('non-existing-page')
                    .success(function() {
                        done(new Error('should fail'));
                    })
                    .fail(function(err) {
                        expect(err).to.be.ok();
                        done();
                    });
            });
        });
        var mod;
        describe('load() success', function() {
            it('should call the success callback', function(done) {
                expect($('#test-page').length).to.be(0);

                loader.load('test-page')
                    .success(function(module, el, expired) {
                        expect(module).to.be.ok();
                        expect(module.id).to.be('test-page');
                        expect(expired).to.be(false);

                        var $testPage = $('#test-page');
                        expect($testPage.length).to.be(1);
                        expect($testPage[0]).to.be(el);

                        //save for second test
                        mod = module;
                        expect(mod.initialized).to.be(undefined);
                        mod.initialized = true;

                        done();
                    })
                    .fail(function(err) {
                        done(err || new Error());
                    });
            });
        });
        describe('load() already loaded', function() {
            it('should call the success callback', function(done) {
                var $testPage = $('#test-page');
                expect($testPage.length).to.be(1);
                var testPageElement = $testPage[0];

                loader.load('test-page')
                    .success(function(module, el, expired) {
                        expect(module).to.be.ok();
                        expect(module).to.be(mod);
                        expect(module.initialized).to.be(true);
                        expect(expired).to.be(false);

                        $testPage = $('#test-page');
                        expect($testPage.length).to.be(1);
                        expect($testPage[0]).to.be(testPageElement);
                        expect(el).to.be(testPageElement);

                        done();
                    })
                    .fail(function(err) {
                        done(err || new Error());
                    });
            });
        });
        describe('load() expired', function() {
            it('should clear the #pages div', function() {
                $('#pages').html('');
            });
            it('should call only one callback', function(done) {
                // override the _checkExpired
                loader._checkExpired = function() {
                    return true;
                };

                loader.load('test-page-two')
                    .success(function(module, el, expired) {
                        expect(module).to.be.ok();
                        expect(module.id).to.be('test-page-two');
                        expect($('#test-page-two').length).to.be(1);
                        expect(expired).to.be(true);
                        // remove the override
                        delete loader._checkExpired;
                        done();
                    })
                    .fail(function(err) {
                        done(err || new Error());
                    });
            });
        });
    });
});