#AMD Page Loader

A javascript AMD module for loading page html and script pairs for a single page application.

#Install

    bower install amd-page-loader
    
#Dependencies

* [jQuery](http://jquery.com/)
* [RequireJS](http://requirejs.org/)
* [extendable.js](www.github.com/jeremija/extendable.js)

RequireJS is currently listed as a dependency, but any AMD loader should do.

#Usage

You need to specify both the `htmlPrefix` and the `jsPrefix` in case the AMD module loader's url is different than the main page url.

There is a convention that must be followed: both the page template filename and the module (script) filename should have the same name, except the extension which is `.js` for the script file and `.html` for the page template. The page module should be an AMD module.

##Code example

```javascript
define(['amd-page-loader'], function(PageLoader) {

	var pageLoader = PageLoader.init({
		selector: '#pages',
		htmlPrefix: 'js/pages',
		jsPrefix: '../../js/pages'
	});

	pageLoader.load('page-name')
		.success(function(module, element, expired) {
			// `module` is a reference to the object exported by the script
			// `element` is a reference to the DOM element appended to the element defined by `selector`
			// `expired` is a boolean which defines whether or not another load request was placed after the current one
		})
		.fail(function(err) {
			// error handler
		});
});
```

##Explanation

1. Use the `PageLoader.init(p_params)` to set the configuration. It will create a new instance of PageLoader.
   * `p_params.selector` defines the element to append the html pages to,
   * `p_params.htmlPrefix` defines the url prefix for the html templates, relative to the current url,
   * `p_params.jsPrefix` defines the url prefix for the js templates, relative to the amd loader's base url.
2. `pageLoader.load(p_page)` tries to load the page by name. In this sample, the final url strings will be:
   * `js/pages/page-name.html` for the html page,
   * `../../js/pages/page-name.js` for page's javascript module.
3. `pageLoader.success(p_callback)` sets the function to be called if the page loading was successful,
4. `pageLoader.fail(p_errback)` sets the function to be called if an error ocurred while loading the page.

All public functions return the current PageLoader instance so all function calls can be chained.

#License

MIT
