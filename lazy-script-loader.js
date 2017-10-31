;(function (environment) {
	Object.assign(environment, init());

	function init() {
		const lazyLoader = {
			// Used as a default prefix for URLs when calling `importScript` using string as param
			defaultURLPrefix: '',
			/**
			 * (Object|string) -> Promise
			 * @param {Object|string} info
			 * @param {String} info.name
			 * @param {String} info.url
			 * @return {PromiseLike<object>}
			 */
			importScript: lazyLoad_,
			/**
			 * Array<object|string> -> Array<PromiseLike<object>>
			 * @param {Array<{ name: string, url: string }|string>}
			 * @return {Array<PromiseLike<object>>}
			 */
			importScripts: function (infos) {
				return infos.map(lazyLoad_);
			}
		};

		return lazyLoader;

		/**
		 * Object -> Function
		 * @param {Object} info
		 * @param {String} info.name
		 * @param {String} info.url
		 * @return {Function}
		 */
		function promiseLoad_(info) {
			return (resolve, reject) => {
				let head = document.getElementsByTagName('head')[0],
					script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = info.url;

				script.onload = function () {
					head.removeChild(script);
					resolve(environment[info.name]);
				};

				script.onerror = function () {
					reject(...arguments);
				}

				head.appendChild(script);
			}
		}

		/**
		 * (Object|string) -> Promise
		 * @param {Object|string} info
		 * @param {String} info.name
		 * @param {String} info.url
		 * @return {PromiseLike<object>}
		 */
		function lazyLoad_(info) {
			if (typeof info == 'string') {
				info = {
					name: info,
					url: lazyLoader.defaultURLPrefix + info + '.js'
				}
			}

			if (environment[info.name]) {
				return Promise.resolve(environment[info.name]);
			}

			return new Promise(promiseLoad_(info));
		}
	}
})(window);