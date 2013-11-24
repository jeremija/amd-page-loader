#AMD Page Loader

An AMD module for loading pages in a single page WEB application using jQuery.

#Install

    bower install amd-page-loader

Currently `requirejs` is listed as a dependency, but any AMD loader should do.

#Usage

You need to specify both the `htmlPrefix` and the `jsPrefix` in case the AMD module loader's url is different than the main page url.

There is a convention that must be followed: both the page template filename and the module (script) filename should have the same name, except the extension which is `.js` for the script file and `.html` for the page template. The page module should be an AMD module.

```javascript
// initialize the page loader
define(['amd-page-loader'], function(PageLoader) {

	var loader = PageLoader.init({
		// `selector` defines the element to which the loaded pages will be appended
		selector: '#pages',
		htmlPrefix: 'js/pages',
		jsPrefix: '../../js/pages'
	});

	// load 'js/pages/page-name.html' relative to the current location in the address bar
	// load '../../js/pages/page-name.js' relative to the AMD loader's base url
	loader.load('page-name')
		.success(function(module, element, expired) {
			// `module` is a reference to the object exported by the script

			// `element` is a reference to the DOM element imported in the element defined by `selector`

			// `expired` is a boolean which defines whether or not another load request was placed after the current one
		})
		.fail(function(err) {
			// error handler
		});
});
```

#License

MIT
