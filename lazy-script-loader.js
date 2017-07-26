;(function (obj) {
	Object.assign(obj, buildLazyLoader());
	function buildLazyLoader () {
		/**
		 * Object -> Function
		 * @param {Object} info
		 * @param {String} info.name
		 * @param {String} info.url
		 */
		function promiseLoad_ (info) {
			return (resolve, reject) => {
				let head = document.getElementsByTagName('head')[0],
					script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = info.url;

				script.onload = () => { 
					head.removeChild(script);
					resolve(window[info.name]);
				};

				script.onerror = reject;

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
		function lazyLoad_ (info) {
			if (window[info.name]) return Promise.resolve(window[info.name]);
			return new Promise(promiseLoad_);
		}

		return {
			importScript: lazyLoad_
		};
	};
})(window);