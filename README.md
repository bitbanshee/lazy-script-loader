# Lazy Script Loader
**Lazy Script Loader** is a very simple component to make lazy loadings for JS scripts on browsers. It's based in [dynamic script loading](http://unixpapa.com/js/dyna.html) and lazy loading.

## Info Object
__Lazy Script Loader__ works using a `info` object, as described below:
```js
var infoEx = {
    // Component name
    name: `Cat`,
    // URL
    url: `scripts/animals/Cat.js`
}
```

## Initialization
You must provide an object containing at least a global environment. You can provide a local environment and a URL prefix string.
```js
// Configuration object to be passed
{
    // Global environment (mandatory)
    environment: window//,
    // Local environment (optional)
    //localEnvironment: window,
    // URL prefix (optional)
	//scriptURLPrefix: 'scripts/'
}
```

## Methods
### `importScript(info)` -> `Promise`
* `info`: an [info object](#info-object) describing a script to be loaded or a string representing an element name if a URL prefix was provided.

A Promise resolved with the element is returned. First, `info.name` is checked and the request to the `info.url` is made if the element is not loaded yet.

### `importScripts(infos)` -> `Promise`
* `infos`: an array of [info objects](#info-object) describing a script to be loaded or a string representing an element name if a URL prefix was provided.

`importScript` is called internaly for each info object in the array and a `Promise.all` of the generated promises is returned.

### `importTo(localEnvironment, info)` -> `Promise`
* `localEnvironment`: an object to which the loaded element will be assigned.
* `info`: an [info object](#info-object) describing a script to be loaded or a string representing an element name if a URL prefix was provided.