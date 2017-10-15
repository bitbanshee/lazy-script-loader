;(function (obj) {
	Object.assign(obj, buildLazyLoader());

	function buildLazyLoader() {
		/**
		 * Object -> Function
		 * @param {Object} info
		 * @param {String} info.name
		 * @param {String} info.url
		 */
		function promiseLoad_(info) {
			return (resolve, reject) => {
				let head = document.getElementsByTagName('head')[0],
					script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = info.url;

				script.onload = function () {
					head.removeChild(script);
					resolve(obj[info.name]);
				};

				script.onerror = function () {
					reject(...arguments);
				}

				// Fire the loading
				head.appendChild(script);
			}
		}

		/**
		 * Object -> Promise
		 * @param {Object} info
		 * @param {String} info.name
		 * @param {String} info.url
		 */
		function lazyLoad_(info) {
			if (obj[info.name]) {
				return Promise.resolve(obj[info.name]);
			}

			return new Promise(promiseLoad_(info));
		}

		return {
			importScript: lazyLoad_,
			importScripts: function (infos) {
				return infos.map(lazyLoad_);
			}
		};
	}
})(window);