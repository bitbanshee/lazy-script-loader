# Lazy Script Loader
**Lazy Script Loader** is a very simple component make lazy loadings for JS scripts on browsers. It's base in [dynamic script loading](http://unixpapa.com/js/dyna.html) and lazy loading.

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
* `info`: an [info object](#info-object) describing a function to be loaded.
First, name is checked to make sure the function is already loaded. If it is, a Promise resolved for it is returned. If not, it's returned a Promise that resolves for the function object when the request made to load its script is done.