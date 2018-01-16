;(function ({ environment, localEnvironment, scriptURLPrefix }) {
	return init();

	function init() {
		const lazyLoader = {
			// Used as a default prefix for URLs when calling `importScript`
			scriptURLPrefix: scriptURLPrefix || '',
			/**
			 * (Object|string) -> Promise
			 * @param {Object|string} info
			 * @param {String} info.name
			 * @param {String} info.url
			 * @return {PromiseLike<object>}
			 */
			importScript: leftPartialApply(lazyLoad_, localEnvironment),
			/**
			 * Array<object|string> -> Array<PromiseLike<object>>
			 * @param {Array<{ name: string, url: string }|string>}
			 * @return {Array<PromiseLike<object>>}
			 */
			importScripts: function (infos) {
				return Promise.all(infos.map(leftPartialApply(lazyLoad_, localEnvironment)))
			},
			importTo: function (localEnvironment, info) {
				const loader = leftPartialApply(lazyLoad_, localEnvironment);
				if (Array.isArray(info)) {
					return Promise.all(info.map(loader));
				}
				return loader(info);
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
		function promiseLoad_(localEnvironment, info) {
			return (resolve, reject) => {
				let head = document.getElementsByTagName('head')[0],
					script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = info.url.startsWith(lazyLoader.scriptURLPrefix) ?
					info.url :
					lazyLoader.scriptURLPrefix + info.url;

				script.onload = function (e) {
					head.removeChild(script);
					const loadedEntity = decideEnvironment(localEnvironment, info.name);
					resolve(loadedEntity);
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
		function lazyLoad_(localEnvironment, info, mustAvoidCache = true) {
			if (typeof info == 'string') {
				info = {
					name: info,
					url: buildURL(info, mustAvoidCache)
				}
			} else {
				info.url = resolveURL(info.url, mustAvoidCache);
			}

			const entity = decideEnvironment(localEnvironment, info.name);
			if (entity) {
				return Promise.resolve(entity);
			}

			return new Promise(promiseLoad_(localEnvironment, info));

			function buildURL (scriptName, mustAvoidCache = true) {
				return resolveURL(lazyLoader.scriptURLPrefix + scriptName + '.js');
			}

			function resolveURL (url, mustAvoidCache = true) {
				return url + (mustAvoidCache === true ? '?avoidCache=' + ~~(Math.random() * 1000) : '');
			}
		}

		function decideEnvironment (localEnvironment, key) {
			if (localEnvironment) {
				if (!localEnvironment[key] && environment[key]) {
					/**
					 * One could argue clone deep is unnecessary, but it's
					 * a way to isolate contexts 
					 */
					localEnvironment[key] = cloneDeep(environment[key]);
				}
				
				if (localEnvironment[key]) {
					return localEnvironment[key];
				}
			}
			return environment[key];
		}

		/**
		 * @param {Function} fn 
		 * @param {Array<any>} args 
		 * @return {Function}
		 */
		function leftPartialApply (fn, ...args) {
			return fn.bind(null, ...args);
		}

		function clone (object) {
			return leftPartialApply(_clone, buildNewDescriptors)(object);
		}
	
		function cloneDeep (object) {
			return leftPartialApply(_clone, buildNewDescriptorsDeep)(object);
		}
	
		/**
		 * @param {Function} buildDescriptorsFn
		 * @param {object} object
		 * @return {object}
		 */
		function _clone (buildDescriptorsFn, object) {
			if (!(object instanceof Object)) {
				return object;
			}
		
			const
				descriptors = Object.getOwnPropertyDescriptors(object),
				descriptorsEntries = Object.entries(descriptors),
				newDescriptors = buildDescriptorsFn(descriptorsEntries);
			
			let clone = {};
			if (object instanceof Function) {
				clone = function () {
					return object.apply(this, arguments);
				};
			}
			return Object.defineProperties(clone, newDescriptors);
		}

		/**
		 * @param {Array<Array<string, object>>} descriptorsEntries
		 * @return {object}
		 */
		function buildNewDescriptors (descriptorsEntries) {
			return descriptorsEntries.reduce(entriesToCloned, {});
		}

		/**
		 * @param {Array<Array<string, object>>} descriptorsEntries
		 * @return {object}
		 */
		function buildNewDescriptorsDeep (descriptorsEntries) {
			const
				valuedDescriptorsEntries = descriptorsEntries.filter(([key, value]) => value.value != null),
				lazyValuedDescriptorsEntries = descriptorsEntries.filter(([key, value]) => !!value.get),
				newValuedDescriptors = valuedDescriptorsEntries.reduce(entriesToClonedDeep, {}),
				newLazyValuedDescriptors = lazyValuedDescriptorsEntries.reduce(entriesToCloned, {});

			return Object.assign({}, newValuedDescriptors, newLazyValuedDescriptors);
		}

		/**
		 * @param {object} descriptors 
		 * @param {Array<string, object>} param1 
		 * @return {object}
		 */
		function entriesToClonedDeep (descriptors, [key, descriptor]) {
			return Object.defineProperty(
				descriptors,
				key,
				{
					enumerable: true,
					value: Object.assign(
						{},
						descriptor,
						{ value: clone(descriptor.value) }
					)
				}
			);
		}

		/**
		 * @param {object} descriptors 
		 * @param {Array<string, object>} param1 
		 * @return {object}
		 */
		function entriesToCloned (descriptors, [key, descriptor]) {
			return Object.defineProperty(
				descriptors,
				key,
				{
					enumerable: true,
					value: Object.assign(
						{},
						descriptor
					)
				}
			);
		}
	}
})({
	environment: window,
	scriptURLPrefix: 'scripts/'
});