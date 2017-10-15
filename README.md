# Lazy Script Loader
**Lazy Script Loader** is a very simple component to make lazy loadings for JS scripts on browsers. It's based in [dynamic script loading](http://unixpapa.com/js/dyna.html) and lazy loading.

## Info Object
__Lazy Script Loader__ works using a `info` object, as described below:
```js
var infoEx = {
    // Function name
    name: `Cat`,
    // URL
    url: `scripts/animals/Cat.js`
}
```

## Methods
### `importScript(info)` -> `Promise`
* `info`: an [info object](#info-object) describing a function to be loaded. A Promise resolved with the function is returned.
First, `info.name` is checked and the request to the `info.url` is made if the function is not loaded yet.