/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1ef43ba41546dc3c2ee1"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(7)(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Component_1 = __webpack_require__(1);\r\nclass GameComponent extends Component_1.Component {\r\n    constructor(transform) {\r\n        super();\r\n        this.transform = transform;\r\n        this._components = []; // TODO: Tentar assim por enquanto\r\n        this.addComponent(this.transform);\r\n    }\r\n    get components() {\r\n        return this._components;\r\n    }\r\n    addComponent(component) {\r\n        component.parent = this;\r\n        this._components.push(component);\r\n    }\r\n    getComponent(type) {\r\n        return this._components.find((c) => c.constructor.name === type);\r\n    }\r\n    getComponents(type) {\r\n        return this._components.filter((c) => c.constructor.name === type);\r\n    }\r\n}\r\nexports.GameComponent = GameComponent;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9fYmFzZS9HYW1lQ29tcG9uZW50LnRzPzkwNWIiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9Db21wb25lbnRcIik7XHJcbmNsYXNzIEdhbWVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnRfMS5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IodHJhbnNmb3JtKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzID0gW107IC8vIFRPRE86IFRlbnRhciBhc3NpbSBwb3IgZW5xdWFudG9cclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudCh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICB9XHJcbiAgICBnZXQgY29tcG9uZW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50cztcclxuICAgIH1cclxuICAgIGFkZENvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBjb21wb25lbnQucGFyZW50ID0gdGhpcztcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIGdldENvbXBvbmVudCh0eXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHMuZmluZCgoYykgPT4gYy5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlKTtcclxuICAgIH1cclxuICAgIGdldENvbXBvbmVudHModHlwZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzLmZpbHRlcigoYykgPT4gYy5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkdhbWVDb21wb25lbnQgPSBHYW1lQ29tcG9uZW50O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9fYmFzZS9HYW1lQ29tcG9uZW50LnRzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass Component {\r\n    Awake() { }\r\n    OnEnable() { }\r\n    Start() { }\r\n    FixedUpdate() { }\r\n    Update() { }\r\n    OnRender() { }\r\n    OnDisable() { }\r\n    OnDestroy() { }\r\n}\r\nexports.Component = Component;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9fYmFzZS9Db21wb25lbnQudHM/MTcyMyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBDb21wb25lbnQge1xyXG4gICAgQXdha2UoKSB7IH1cclxuICAgIE9uRW5hYmxlKCkgeyB9XHJcbiAgICBTdGFydCgpIHsgfVxyXG4gICAgRml4ZWRVcGRhdGUoKSB7IH1cclxuICAgIFVwZGF0ZSgpIHsgfVxyXG4gICAgT25SZW5kZXIoKSB7IH1cclxuICAgIE9uRGlzYWJsZSgpIHsgfVxyXG4gICAgT25EZXN0cm95KCkgeyB9XHJcbn1cclxuZXhwb3J0cy5Db21wb25lbnQgPSBDb21wb25lbnQ7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL19iYXNlL0NvbXBvbmVudC50c1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst GameComponent_1 = __webpack_require__(0);\r\nclass Camera extends GameComponent_1.GameComponent {\r\n    constructor(transform) {\r\n        super(transform);\r\n        Camera.instance = this;\r\n    }\r\n}\r\nexports.Camera = Camera;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9DYW1lcmEvQ2FtZXJhLnRzP2E4NDUiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgR2FtZUNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL19iYXNlL0dhbWVDb21wb25lbnRcIik7XHJcbmNsYXNzIENhbWVyYSBleHRlbmRzIEdhbWVDb21wb25lbnRfMS5HYW1lQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHRyYW5zZm9ybSkge1xyXG4gICAgICAgIHN1cGVyKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgQ2FtZXJhLmluc3RhbmNlID0gdGhpcztcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkNhbWVyYSA9IENhbWVyYTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvQ2FtZXJhL0NhbWVyYS50c1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///2\n");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Component_1 = __webpack_require__(1);\r\n/**\r\n* TODO: super provisório, depois investir um tempo pra chegar em um lance legal aqui\r\n*/\r\nclass GameEngine extends Component_1.Component {\r\n    constructor(stageId) {\r\n        super();\r\n        this.FPS = 60;\r\n        GameEngine.instance = this;\r\n        this.Init(stageId);\r\n    }\r\n    Init(stageId) {\r\n        this.canvas = document.getElementById(stageId);\r\n        this.context2D = this.canvas.getContext(\"2d\");\r\n    }\r\n}\r\nexports.GameEngine = GameEngine;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9FbmdpbmUvR2FtZUVuZ2luZS50cz8wMmQ2Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL19iYXNlL0NvbXBvbmVudFwiKTtcclxuLyoqXHJcbiogVE9ETzogc3VwZXIgcHJvdmlzw7NyaW8sIGRlcG9pcyBpbnZlc3RpciB1bSB0ZW1wbyBwcmEgY2hlZ2FyIGVtIHVtIGxhbmNlIGxlZ2FsIGFxdWlcclxuKi9cclxuY2xhc3MgR2FtZUVuZ2luZSBleHRlbmRzIENvbXBvbmVudF8xLkNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdGFnZUlkKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLkZQUyA9IDYwO1xyXG4gICAgICAgIEdhbWVFbmdpbmUuaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuSW5pdChzdGFnZUlkKTtcclxuICAgIH1cclxuICAgIEluaXQoc3RhZ2VJZCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhZ2VJZCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0MkQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5HYW1lRW5naW5lID0gR2FtZUVuZ2luZTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvRW5naW5lL0dhbWVFbmdpbmUudHNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///3\n");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Component_1 = __webpack_require__(1);\r\nclass Transform extends Component_1.Component {\r\n    constructor(x, y, width, height) {\r\n        super();\r\n        this.x = x;\r\n        this.y = y;\r\n        this.width = width;\r\n        this.height = height;\r\n    }\r\n    //TODO: Implementar ainda\r\n    setTranslate() { }\r\n}\r\nexports.Transform = Transform;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9fYmFzZS9UcmFuc2Zvcm0udHM/MmUxNSJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL0NvbXBvbmVudFwiKTtcclxuY2xhc3MgVHJhbnNmb3JtIGV4dGVuZHMgQ29tcG9uZW50XzEuQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9XHJcbiAgICAvL1RPRE86IEltcGxlbWVudGFyIGFpbmRhXHJcbiAgICBzZXRUcmFuc2xhdGUoKSB7IH1cclxufVxyXG5leHBvcnRzLlRyYW5zZm9ybSA9IFRyYW5zZm9ybTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvX2Jhc2UvVHJhbnNmb3JtLnRzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///4\n");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Component_1 = __webpack_require__(1);\r\nclass Sprite extends Component_1.Component {\r\n    constructor(image) {\r\n        super();\r\n        this.flip = {\r\n            x: false,\r\n            y: false\r\n        };\r\n        this.init(image);\r\n    }\r\n    init(image) {\r\n        var ctx;\r\n        this.sprite = {\r\n            backgroundColor: \"#FFFFFF\",\r\n            canvas: document.createElement(\"canvas\"),\r\n            sourceRect: { x: 0, y: 0, width: image.width, height: image.height },\r\n            destRect: { x: 0, y: 0, width: image.width, height: image.height },\r\n            image\r\n        };\r\n        ctx = this.sprite.canvas.getContext(\"2d\");\r\n        ctx.drawImage(image, 0, 0);\r\n        this.sprite.canvas.width = image.width;\r\n        this.sprite.canvas.height = image.height;\r\n    }\r\n}\r\nexports.Sprite = Sprite;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9TcHJpdGUvU3ByaXRlLnRzP2Y1ZGUiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vX2Jhc2UvQ29tcG9uZW50XCIpO1xyXG5jbGFzcyBTcHJpdGUgZXh0ZW5kcyBDb21wb25lbnRfMS5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IoaW1hZ2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuZmxpcCA9IHtcclxuICAgICAgICAgICAgeDogZmFsc2UsXHJcbiAgICAgICAgICAgIHk6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluaXQoaW1hZ2UpO1xyXG4gICAgfVxyXG4gICAgaW5pdChpbWFnZSkge1xyXG4gICAgICAgIHZhciBjdHg7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCIjRkZGRkZGXCIsXHJcbiAgICAgICAgICAgIGNhbnZhczogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxcclxuICAgICAgICAgICAgc291cmNlUmVjdDogeyB4OiAwLCB5OiAwLCB3aWR0aDogaW1hZ2Uud2lkdGgsIGhlaWdodDogaW1hZ2UuaGVpZ2h0IH0sXHJcbiAgICAgICAgICAgIGRlc3RSZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoOiBpbWFnZS53aWR0aCwgaGVpZ2h0OiBpbWFnZS5oZWlnaHQgfSxcclxuICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIGN0eCA9IHRoaXMuc3ByaXRlLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuY2FudmFzLndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuY2FudmFzLmhlaWdodCA9IGltYWdlLmhlaWdodDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlNwcml0ZSA9IFNwcml0ZTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvU3ByaXRlL1Nwcml0ZS50c1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///5\n");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.Resources = {};\r\n// TODO: Depois refazer com Promise ou com rxJS\r\nfunction LoadResources(resources, callback) {\r\n    let filesLoaded = 0;\r\n    resources.forEach((resource) => {\r\n        const { url, type } = resource;\r\n        switch (type) {\r\n            case \"image\":\r\n                let image = new Image();\r\n                image.src = url;\r\n                image.addEventListener('load', () => {\r\n                    filesLoaded += 1;\r\n                    exports.Resources[resource.name] = Object.assign(resource, { file: image });\r\n                    if (filesLoaded === resources.length) {\r\n                        callback(exports.Resources);\r\n                    }\r\n                });\r\n                break;\r\n        }\r\n    });\r\n}\r\nexports.LoadResources = LoadResources;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9fYmFzZS9SZXNvdXJjZXMudHM/ZjU1NCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlJlc291cmNlcyA9IHt9O1xyXG4vLyBUT0RPOiBEZXBvaXMgcmVmYXplciBjb20gUHJvbWlzZSBvdSBjb20gcnhKU1xyXG5mdW5jdGlvbiBMb2FkUmVzb3VyY2VzKHJlc291cmNlcywgY2FsbGJhY2spIHtcclxuICAgIGxldCBmaWxlc0xvYWRlZCA9IDA7XHJcbiAgICByZXNvdXJjZXMuZm9yRWFjaCgocmVzb3VyY2UpID0+IHtcclxuICAgICAgICBjb25zdCB7IHVybCwgdHlwZSB9ID0gcmVzb3VyY2U7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOlxyXG4gICAgICAgICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVzTG9hZGVkICs9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cy5SZXNvdXJjZXNbcmVzb3VyY2UubmFtZV0gPSBPYmplY3QuYXNzaWduKHJlc291cmNlLCB7IGZpbGU6IGltYWdlIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlc0xvYWRlZCA9PT0gcmVzb3VyY2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhleHBvcnRzLlJlc291cmNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLkxvYWRSZXNvdXJjZXMgPSBMb2FkUmVzb3VyY2VzO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9fYmFzZS9SZXNvdXJjZXMudHNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///6\n");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n/**\r\n* Essa inicialização não ficara assim, depois pensar no start\r\n*\r\n* Conforme for evoluindo a estrutura com os componentes, vou alterando aqui o padrão\r\n*/\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Player_1 = __webpack_require__(8);\r\nconst position_interface_1 = __webpack_require__(9);\r\nconst Camera_1 = __webpack_require__(2);\r\nconst Transform_1 = __webpack_require__(4);\r\nconst CameraFollow_1 = __webpack_require__(10);\r\nconst GameEngine_1 = __webpack_require__(3);\r\nconst Sprite_1 = __webpack_require__(5);\r\nconst TileMap_1 = __webpack_require__(11);\r\nconst Resources_1 = __webpack_require__(6);\r\nconst Animation_1 = __webpack_require__(13);\r\nconst gameEngine = new GameEngine_1.GameEngine(\"stage\");\r\nconst Resources = [\r\n    { name: \"blankImage\", url: \"assets/blank.png\", type: 'image' },\r\n    { name: \"tileSet\", url: \"assets/tiles.png\", type: 'image' },\r\n    { name: \"megaman\", url: \"assets/megaman.png\", type: 'image' },\r\n    { name: \"link\", url: \"assets/Link/zelda-link.png\", type: 'image' },\r\n];\r\nlet tileSize = 64;\r\nlet mapLayers = [\r\n    [\r\n        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],\r\n        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 3],\r\n        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 3],\r\n        [3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],\r\n        [3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]\r\n    ],\r\n    [\r\n        [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],\r\n        [4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],\r\n        [4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]\r\n    ]\r\n];\r\nlet mapCollisions = [\r\n    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\r\n    [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]\r\n];\r\nlet GameComponentsHierarchy = [];\r\nlet components;\r\nlet camera = new Camera_1.Camera(new Transform_1.Transform(1 * tileSize, 1 * tileSize, 12 * tileSize, 12 * tileSize));\r\nlet player;\r\ngameEngine.canvas.width = camera.transform.width;\r\ngameEngine.canvas.height = camera.transform.height;\r\n//Carrega os resources do game\r\nResources_1.LoadResources(Resources, (files) => {\r\n    let image = new Image();\r\n    let imageBlank = new Image();\r\n    imageBlank.src = \"/assets/blank.png\";\r\n    let tileMap = new TileMap_1.TileMap(files.tileSet.file, 64, mapLayers, mapCollisions, files.blankImage.file);\r\n    tileMap.Awake();\r\n    player = new Player_1.Player(new Transform_1.Transform(1 * tileSize, 1 * tileSize, tileSize, tileSize), 1);\r\n    let spritePlayer = new Sprite_1.Sprite(files.blankImage.file);\r\n    spritePlayer.layer = 0;\r\n    spritePlayer.orderInLayer = 1;\r\n    player.addComponent(spritePlayer);\r\n    player.addComponent(new Animation_1.Animation());\r\n    player.Awake();\r\n    //Adicionando o target na CameraFollow\r\n    camera.addComponent(new CameraFollow_1.CameraFollow(camera.transform, player));\r\n    camera.Awake();\r\n    //Hierarchy: seguindo a linha do unity, depois posso mudar o nome\r\n    GameComponentsHierarchy.push(camera, tileMap, player);\r\n    components = GameComponentsHierarchy.reduce((before, current) => {\r\n        before.push(current);\r\n        if (current.components && current.components.length)\r\n            before = before.concat(current.components);\r\n        return before;\r\n    }, []);\r\n    console.log(components);\r\n    components.forEach((c) => { c.Awake(); }); // Testar isso também\r\n    init();\r\n});\r\nfunction init() {\r\n    setInterval(GameLoop, 1000 / gameEngine.FPS);\r\n    document.getElementById(\"limitBorder\").addEventListener(\"change\", (event) => {\r\n        var cFollow = camera.getComponent('CameraFollow');\r\n        cFollow.limitBorder = event.target.checked ? { width: mapLayers[0][0].length * 64, height: mapLayers[0].length * 64 } : null;\r\n    });\r\n}\r\nfunction GameLoop() {\r\n    components.forEach((c) => { c.FixedUpdate(); });\r\n    components.forEach((c) => { c.Update(); });\r\n    /**\r\n     * Super provisório, só pra mostrar como será depois\r\n     * O render ele será só de elementos que possuem Sprite e/ou Interface\r\n     * A renderização será nessa ordem\r\n     *\r\n     * - Layer\r\n     * \t\t-> Order\r\n     */\r\n    components\r\n        .filter((c) => {\r\n        if (!c.getComponent)\r\n            return false;\r\n        let sprite = c.getComponent(\"Sprite\");\r\n        return sprite;\r\n    })\r\n        .sort((a, b) => {\r\n        let aSprite, bSprite;\r\n        aSprite = a.getComponent(\"Sprite\");\r\n        bSprite = b.getComponent(\"Sprite\");\r\n        if (aSprite.layer > bSprite.layer)\r\n            return 1;\r\n        else if (aSprite.layer < bSprite.layer)\r\n            return -1;\r\n        else {\r\n            if (aSprite.orderInLayer > bSprite.orderInLayer)\r\n                return 1;\r\n            if (aSprite.orderInLayer < bSprite.orderInLayer)\r\n                return -1;\r\n        }\r\n    })\r\n        .forEach((c) => { c.OnRender(); });\r\n}\r\nfunction onMoveTo(pos) {\r\n    let positionRequest = {\r\n        x: Math.floor((player.transform.x + pos.x) / 64),\r\n        y: Math.floor((player.transform.y + pos.y) / 64)\r\n    };\r\n    // if (!hasCollision(positionRequest)) {\r\n    player.transform.x += pos.x;\r\n    player.transform.y += pos.y;\r\n    // }\r\n    // console.log(player.transform)\r\n}\r\nfunction hasCollision(position) {\r\n    // Vai sair do mapa\r\n    if (position.y < 0 || position.y >= mapCollisions.length || position.x < 0 || position.x >= mapCollisions[0].length) {\r\n        return true;\r\n    }\r\n    // 1 é colisão\r\n    if (mapCollisions[position.y][position.x] === 1) {\r\n        return true;\r\n    }\r\n    return false;\r\n}\r\nfunction onKeyPress(evt) {\r\n    let dir = { x: position_interface_1.Direction.Idle, y: position_interface_1.Direction.Idle };\r\n    //left\r\n    if (evt.keyCode === 37) {\r\n        dir.x = -64;\r\n    }\r\n    //right\r\n    if (evt.keyCode === 39) {\r\n        dir.x = 64;\r\n    }\r\n    //down\r\n    if (evt.keyCode === 40) {\r\n        dir.y = 64;\r\n    }\r\n    //up\r\n    if (evt.keyCode === 38) {\r\n        dir.y = -64;\r\n    }\r\n    onMoveTo(dir);\r\n}\r\nwindow.addEventListener(\"keydown\", onKeyPress);\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9pbmRleC50cz9lOWNmIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG4vKipcclxuKiBFc3NhIGluaWNpYWxpemHDp8OjbyBuw6NvIGZpY2FyYSBhc3NpbSwgZGVwb2lzIHBlbnNhciBubyBzdGFydFxyXG4qXHJcbiogQ29uZm9ybWUgZm9yIGV2b2x1aW5kbyBhIGVzdHJ1dHVyYSBjb20gb3MgY29tcG9uZW50ZXMsIHZvdSBhbHRlcmFuZG8gYXF1aSBvIHBhZHLDo29cclxuKi9cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBQbGF5ZXJfMSA9IHJlcXVpcmUoXCIuL0NoYXJhY3Rlci9QbGF5ZXJcIik7XHJcbmNvbnN0IHBvc2l0aW9uX2ludGVyZmFjZV8xID0gcmVxdWlyZShcIi4vX2Jhc2UvaW50ZXJmYWNlL3Bvc2l0aW9uLmludGVyZmFjZVwiKTtcclxuY29uc3QgQ2FtZXJhXzEgPSByZXF1aXJlKFwiLi9DYW1lcmEvQ2FtZXJhXCIpO1xyXG5jb25zdCBUcmFuc2Zvcm1fMSA9IHJlcXVpcmUoXCIuL19iYXNlL1RyYW5zZm9ybVwiKTtcclxuY29uc3QgQ2FtZXJhRm9sbG93XzEgPSByZXF1aXJlKFwiLi9DYW1lcmEvQ2FtZXJhRm9sbG93XCIpO1xyXG5jb25zdCBHYW1lRW5naW5lXzEgPSByZXF1aXJlKFwiLi9FbmdpbmUvR2FtZUVuZ2luZVwiKTtcclxuY29uc3QgU3ByaXRlXzEgPSByZXF1aXJlKFwiLi9TcHJpdGUvU3ByaXRlXCIpO1xyXG5jb25zdCBUaWxlTWFwXzEgPSByZXF1aXJlKFwiLi9UaWxlL1RpbGVNYXBcIik7XHJcbmNvbnN0IFJlc291cmNlc18xID0gcmVxdWlyZShcIi4vX2Jhc2UvUmVzb3VyY2VzXCIpO1xyXG5jb25zdCBBbmltYXRpb25fMSA9IHJlcXVpcmUoXCIuL0FuaW1hdGlvbi9BbmltYXRpb25cIik7XHJcbmNvbnN0IGdhbWVFbmdpbmUgPSBuZXcgR2FtZUVuZ2luZV8xLkdhbWVFbmdpbmUoXCJzdGFnZVwiKTtcclxuY29uc3QgUmVzb3VyY2VzID0gW1xyXG4gICAgeyBuYW1lOiBcImJsYW5rSW1hZ2VcIiwgdXJsOiBcImFzc2V0cy9ibGFuay5wbmdcIiwgdHlwZTogJ2ltYWdlJyB9LFxyXG4gICAgeyBuYW1lOiBcInRpbGVTZXRcIiwgdXJsOiBcImFzc2V0cy90aWxlcy5wbmdcIiwgdHlwZTogJ2ltYWdlJyB9LFxyXG4gICAgeyBuYW1lOiBcIm1lZ2FtYW5cIiwgdXJsOiBcImFzc2V0cy9tZWdhbWFuLnBuZ1wiLCB0eXBlOiAnaW1hZ2UnIH0sXHJcbiAgICB7IG5hbWU6IFwibGlua1wiLCB1cmw6IFwiYXNzZXRzL0xpbmsvemVsZGEtbGluay5wbmdcIiwgdHlwZTogJ2ltYWdlJyB9LFxyXG5dO1xyXG5sZXQgdGlsZVNpemUgPSA2NDtcclxubGV0IG1hcExheWVycyA9IFtcclxuICAgIFtcclxuICAgICAgICBbMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgM10sXHJcbiAgICAgICAgWzMsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDNdLFxyXG4gICAgICAgIFszLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAzXSxcclxuICAgICAgICBbMywgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgM10sXHJcbiAgICAgICAgWzMsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDNdLFxyXG4gICAgICAgIFszLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAzXSxcclxuICAgICAgICBbMywgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgM10sXHJcbiAgICAgICAgWzMsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDNdLFxyXG4gICAgICAgIFszLCAxLCAyLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAzXSxcclxuICAgICAgICBbMywgMSwgMiwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgM10sXHJcbiAgICAgICAgWzMsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDEsIDEsIDEsIDEsIDEsIDIsIDEsIDNdLFxyXG4gICAgICAgIFszLCAxLCAxLCAxLCAxLCAyLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAzXSxcclxuICAgICAgICBbMywgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMiwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgM10sXHJcbiAgICAgICAgWzMsIDMsIDMsIDEsIDEsIDIsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDMsIDNdXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIFs0LCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCAzLCA0XSxcclxuICAgICAgICBbNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNF0sXHJcbiAgICAgICAgWzQsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDRdLFxyXG4gICAgICAgIFs0LCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCA0XSxcclxuICAgICAgICBbNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNF0sXHJcbiAgICAgICAgWzQsIDAsIDAsIDUsIDAsIDAsIDAsIDAsIDAsIDUsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDRdLFxyXG4gICAgICAgIFs0LCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCA0XSxcclxuICAgICAgICBbNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNF0sXHJcbiAgICAgICAgWzQsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDRdLFxyXG4gICAgICAgIFs0LCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCA0XSxcclxuICAgICAgICBbNCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgNF0sXHJcbiAgICAgICAgWzQsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDRdLFxyXG4gICAgICAgIFs0LCA0LCA0LCAwLCA1LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0LCA0XSxcclxuICAgICAgICBbNCwgNCwgNCwgMCwgMCwgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgMywgM11cclxuICAgIF1cclxuXTtcclxubGV0IG1hcENvbGxpc2lvbnMgPSBbXHJcbiAgICBbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcbiAgICBbMSwgMSwgMSwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV1cclxuXTtcclxubGV0IEdhbWVDb21wb25lbnRzSGllcmFyY2h5ID0gW107XHJcbmxldCBjb21wb25lbnRzO1xyXG5sZXQgY2FtZXJhID0gbmV3IENhbWVyYV8xLkNhbWVyYShuZXcgVHJhbnNmb3JtXzEuVHJhbnNmb3JtKDEgKiB0aWxlU2l6ZSwgMSAqIHRpbGVTaXplLCAxMiAqIHRpbGVTaXplLCAxMiAqIHRpbGVTaXplKSk7XHJcbmxldCBwbGF5ZXI7XHJcbmdhbWVFbmdpbmUuY2FudmFzLndpZHRoID0gY2FtZXJhLnRyYW5zZm9ybS53aWR0aDtcclxuZ2FtZUVuZ2luZS5jYW52YXMuaGVpZ2h0ID0gY2FtZXJhLnRyYW5zZm9ybS5oZWlnaHQ7XHJcbi8vQ2FycmVnYSBvcyByZXNvdXJjZXMgZG8gZ2FtZVxyXG5SZXNvdXJjZXNfMS5Mb2FkUmVzb3VyY2VzKFJlc291cmNlcywgKGZpbGVzKSA9PiB7XHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGxldCBpbWFnZUJsYW5rID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZUJsYW5rLnNyYyA9IFwiL2Fzc2V0cy9ibGFuay5wbmdcIjtcclxuICAgIGxldCB0aWxlTWFwID0gbmV3IFRpbGVNYXBfMS5UaWxlTWFwKGZpbGVzLnRpbGVTZXQuZmlsZSwgNjQsIG1hcExheWVycywgbWFwQ29sbGlzaW9ucywgZmlsZXMuYmxhbmtJbWFnZS5maWxlKTtcclxuICAgIHRpbGVNYXAuQXdha2UoKTtcclxuICAgIHBsYXllciA9IG5ldyBQbGF5ZXJfMS5QbGF5ZXIobmV3IFRyYW5zZm9ybV8xLlRyYW5zZm9ybSgxICogdGlsZVNpemUsIDEgKiB0aWxlU2l6ZSwgdGlsZVNpemUsIHRpbGVTaXplKSwgMSk7XHJcbiAgICBsZXQgc3ByaXRlUGxheWVyID0gbmV3IFNwcml0ZV8xLlNwcml0ZShmaWxlcy5ibGFua0ltYWdlLmZpbGUpO1xyXG4gICAgc3ByaXRlUGxheWVyLmxheWVyID0gMDtcclxuICAgIHNwcml0ZVBsYXllci5vcmRlckluTGF5ZXIgPSAxO1xyXG4gICAgcGxheWVyLmFkZENvbXBvbmVudChzcHJpdGVQbGF5ZXIpO1xyXG4gICAgcGxheWVyLmFkZENvbXBvbmVudChuZXcgQW5pbWF0aW9uXzEuQW5pbWF0aW9uKCkpO1xyXG4gICAgcGxheWVyLkF3YWtlKCk7XHJcbiAgICAvL0FkaWNpb25hbmRvIG8gdGFyZ2V0IG5hIENhbWVyYUZvbGxvd1xyXG4gICAgY2FtZXJhLmFkZENvbXBvbmVudChuZXcgQ2FtZXJhRm9sbG93XzEuQ2FtZXJhRm9sbG93KGNhbWVyYS50cmFuc2Zvcm0sIHBsYXllcikpO1xyXG4gICAgY2FtZXJhLkF3YWtlKCk7XHJcbiAgICAvL0hpZXJhcmNoeTogc2VndWluZG8gYSBsaW5oYSBkbyB1bml0eSwgZGVwb2lzIHBvc3NvIG11ZGFyIG8gbm9tZVxyXG4gICAgR2FtZUNvbXBvbmVudHNIaWVyYXJjaHkucHVzaChjYW1lcmEsIHRpbGVNYXAsIHBsYXllcik7XHJcbiAgICBjb21wb25lbnRzID0gR2FtZUNvbXBvbmVudHNIaWVyYXJjaHkucmVkdWNlKChiZWZvcmUsIGN1cnJlbnQpID0+IHtcclxuICAgICAgICBiZWZvcmUucHVzaChjdXJyZW50KTtcclxuICAgICAgICBpZiAoY3VycmVudC5jb21wb25lbnRzICYmIGN1cnJlbnQuY29tcG9uZW50cy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGJlZm9yZSA9IGJlZm9yZS5jb25jYXQoY3VycmVudC5jb21wb25lbnRzKTtcclxuICAgICAgICByZXR1cm4gYmVmb3JlO1xyXG4gICAgfSwgW10pO1xyXG4gICAgY29uc29sZS5sb2coY29tcG9uZW50cyk7XHJcbiAgICBjb21wb25lbnRzLmZvckVhY2goKGMpID0+IHsgYy5Bd2FrZSgpOyB9KTsgLy8gVGVzdGFyIGlzc28gdGFtYsOpbVxyXG4gICAgaW5pdCgpO1xyXG59KTtcclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHNldEludGVydmFsKEdhbWVMb29wLCAxMDAwIC8gZ2FtZUVuZ2luZS5GUFMpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaW1pdEJvcmRlclwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAgIHZhciBjRm9sbG93ID0gY2FtZXJhLmdldENvbXBvbmVudCgnQ2FtZXJhRm9sbG93Jyk7XHJcbiAgICAgICAgY0ZvbGxvdy5saW1pdEJvcmRlciA9IGV2ZW50LnRhcmdldC5jaGVja2VkID8geyB3aWR0aDogbWFwTGF5ZXJzWzBdWzBdLmxlbmd0aCAqIDY0LCBoZWlnaHQ6IG1hcExheWVyc1swXS5sZW5ndGggKiA2NCB9IDogbnVsbDtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIEdhbWVMb29wKCkge1xyXG4gICAgY29tcG9uZW50cy5mb3JFYWNoKChjKSA9PiB7IGMuRml4ZWRVcGRhdGUoKTsgfSk7XHJcbiAgICBjb21wb25lbnRzLmZvckVhY2goKGMpID0+IHsgYy5VcGRhdGUoKTsgfSk7XHJcbiAgICAvKipcclxuICAgICAqIFN1cGVyIHByb3Zpc8OzcmlvLCBzw7MgcHJhIG1vc3RyYXIgY29tbyBzZXLDoSBkZXBvaXNcclxuICAgICAqIE8gcmVuZGVyIGVsZSBzZXLDoSBzw7MgZGUgZWxlbWVudG9zIHF1ZSBwb3NzdWVtIFNwcml0ZSBlL291IEludGVyZmFjZVxyXG4gICAgICogQSByZW5kZXJpemHDp8OjbyBzZXLDoSBuZXNzYSBvcmRlbVxyXG4gICAgICpcclxuICAgICAqIC0gTGF5ZXJcclxuICAgICAqIFx0XHQtPiBPcmRlclxyXG4gICAgICovXHJcbiAgICBjb21wb25lbnRzXHJcbiAgICAgICAgLmZpbHRlcigoYykgPT4ge1xyXG4gICAgICAgIGlmICghYy5nZXRDb21wb25lbnQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBsZXQgc3ByaXRlID0gYy5nZXRDb21wb25lbnQoXCJTcHJpdGVcIik7XHJcbiAgICAgICAgcmV0dXJuIHNwcml0ZTtcclxuICAgIH0pXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBsZXQgYVNwcml0ZSwgYlNwcml0ZTtcclxuICAgICAgICBhU3ByaXRlID0gYS5nZXRDb21wb25lbnQoXCJTcHJpdGVcIik7XHJcbiAgICAgICAgYlNwcml0ZSA9IGIuZ2V0Q29tcG9uZW50KFwiU3ByaXRlXCIpO1xyXG4gICAgICAgIGlmIChhU3ByaXRlLmxheWVyID4gYlNwcml0ZS5sYXllcilcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgZWxzZSBpZiAoYVNwcml0ZS5sYXllciA8IGJTcHJpdGUubGF5ZXIpXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGFTcHJpdGUub3JkZXJJbkxheWVyID4gYlNwcml0ZS5vcmRlckluTGF5ZXIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgaWYgKGFTcHJpdGUub3JkZXJJbkxheWVyIDwgYlNwcml0ZS5vcmRlckluTGF5ZXIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgICAgICAuZm9yRWFjaCgoYykgPT4geyBjLk9uUmVuZGVyKCk7IH0pO1xyXG59XHJcbmZ1bmN0aW9uIG9uTW92ZVRvKHBvcykge1xyXG4gICAgbGV0IHBvc2l0aW9uUmVxdWVzdCA9IHtcclxuICAgICAgICB4OiBNYXRoLmZsb29yKChwbGF5ZXIudHJhbnNmb3JtLnggKyBwb3MueCkgLyA2NCksXHJcbiAgICAgICAgeTogTWF0aC5mbG9vcigocGxheWVyLnRyYW5zZm9ybS55ICsgcG9zLnkpIC8gNjQpXHJcbiAgICB9O1xyXG4gICAgLy8gaWYgKCFoYXNDb2xsaXNpb24ocG9zaXRpb25SZXF1ZXN0KSkge1xyXG4gICAgcGxheWVyLnRyYW5zZm9ybS54ICs9IHBvcy54O1xyXG4gICAgcGxheWVyLnRyYW5zZm9ybS55ICs9IHBvcy55O1xyXG4gICAgLy8gfVxyXG4gICAgLy8gY29uc29sZS5sb2cocGxheWVyLnRyYW5zZm9ybSlcclxufVxyXG5mdW5jdGlvbiBoYXNDb2xsaXNpb24ocG9zaXRpb24pIHtcclxuICAgIC8vIFZhaSBzYWlyIGRvIG1hcGFcclxuICAgIGlmIChwb3NpdGlvbi55IDwgMCB8fCBwb3NpdGlvbi55ID49IG1hcENvbGxpc2lvbnMubGVuZ3RoIHx8IHBvc2l0aW9uLnggPCAwIHx8IHBvc2l0aW9uLnggPj0gbWFwQ29sbGlzaW9uc1swXS5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8vIDEgw6kgY29saXPDo29cclxuICAgIGlmIChtYXBDb2xsaXNpb25zW3Bvc2l0aW9uLnldW3Bvc2l0aW9uLnhdID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gb25LZXlQcmVzcyhldnQpIHtcclxuICAgIGxldCBkaXIgPSB7IHg6IHBvc2l0aW9uX2ludGVyZmFjZV8xLkRpcmVjdGlvbi5JZGxlLCB5OiBwb3NpdGlvbl9pbnRlcmZhY2VfMS5EaXJlY3Rpb24uSWRsZSB9O1xyXG4gICAgLy9sZWZ0XHJcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDM3KSB7XHJcbiAgICAgICAgZGlyLnggPSAtNjQ7XHJcbiAgICB9XHJcbiAgICAvL3JpZ2h0XHJcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDM5KSB7XHJcbiAgICAgICAgZGlyLnggPSA2NDtcclxuICAgIH1cclxuICAgIC8vZG93blxyXG4gICAgaWYgKGV2dC5rZXlDb2RlID09PSA0MCkge1xyXG4gICAgICAgIGRpci55ID0gNjQ7XHJcbiAgICB9XHJcbiAgICAvL3VwXHJcbiAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDM4KSB7XHJcbiAgICAgICAgZGlyLnkgPSAtNjQ7XHJcbiAgICB9XHJcbiAgICBvbk1vdmVUbyhkaXIpO1xyXG59XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleVByZXNzKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaW5kZXgudHNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///7\n");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst GameComponent_1 = __webpack_require__(0);\r\nconst Camera_1 = __webpack_require__(2);\r\nconst GameEngine_1 = __webpack_require__(3);\r\nclass Player extends GameComponent_1.GameComponent {\r\n    constructor(transform, layer) {\r\n        super(transform);\r\n        this.transform = transform;\r\n        this.layer = layer;\r\n        // tirar daqui depois\r\n        // Megaman\r\n        // states: Array<AnimationState> = [\r\n        // \t{\r\n        // \t\tdefault: true,\r\n        // \t\tname: \"idle\",\r\n        // \t\tframes: [\r\n        // \t\t\t{ rect: { y: 0, x: 0, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 0, x: 36, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 0, x: 72, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 0, x: 108, width: 36, height: 36 }, image: 'megaman', delay: 7 }\r\n        // \t\t]\r\n        // \t}, {\r\n        // \t\tdefault: false,\r\n        // \t\tname: \"run\",\r\n        // \t\tframes: [\r\n        // \t\t\t{ rect: { y: 35, x: 0, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 35, x: 36, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 35, x: 72, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 35, x: 108, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 35, x: 144, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 35, x: 180, width: 36, height: 36 }, image: 'megaman', delay: 7 },\r\n        // \t\t\t{ rect: { y: 35, x: 216, width: 36, height: 36 }, image: 'megaman', delay: 7 }\r\n        // \t\t]\r\n        // \t}\r\n        // ];\r\n        //link\r\n        this.states = [\r\n            {\r\n                default: true,\r\n                name: \"idle\",\r\n                frames: [\r\n                    { rect: { y: 0, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 100 },\r\n                    { rect: { y: 0, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 0, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 0, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 150 },\r\n                    { rect: { y: 0, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 0, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 }\r\n                ]\r\n            }, {\r\n                default: false,\r\n                name: \"run-vertical\",\r\n                frames: [\r\n                    { rect: { y: 443, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 443, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }\r\n                ]\r\n            }, {\r\n                default: false,\r\n                name: \"run-horizontal\",\r\n                frames: [\r\n                    { rect: { y: 773.5, x: 0, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 102, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 204, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 306, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 408, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 510, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 612, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 714, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 816, width: 102, height: 110.5 }, image: 'link', delay: 5 },\r\n                    { rect: { y: 773.5, x: 918, width: 102, height: 110.5 }, image: 'link', delay: 5 }\r\n                ]\r\n            }\r\n        ];\r\n    }\r\n    Awake() {\r\n        this.spriteComponent = this.getComponent(\"Sprite\");\r\n        this.cFollow = Camera_1.Camera.instance.getComponent(\"CameraFollow\");\r\n        this.animation = this.getComponent(\"Animation\");\r\n        this.animation.animationStates = this.states;\r\n    }\r\n    Update() {\r\n        this.spriteComponent.sprite.destRect = {\r\n            x: ((Camera_1.Camera.instance.transform.x * -1) + this.cFollow.target.transform.x),\r\n            y: ((Camera_1.Camera.instance.transform.y * -1) + this.cFollow.target.transform.y),\r\n            width: 64,\r\n            height: 64\r\n        };\r\n    }\r\n    /**\r\n     * TODO: Tentar transferir essa logica para outro lugar\r\n     * Sprite ou o base\r\n     */\r\n    OnRender() {\r\n        let srcRect = this.spriteComponent.sprite.sourceRect;\r\n        let destRect = this.spriteComponent.sprite.destRect;\r\n        GameEngine_1.GameEngine.instance.context2D.drawImage(this.spriteComponent.sprite.image, srcRect.x, srcRect.y, srcRect.width, srcRect.height, destRect.x, destRect.y, destRect.width, destRect.height);\r\n        // console.log(srcRect, destRect)\r\n    }\r\n}\r\nexports.Player = Player;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9DaGFyYWN0ZXIvUGxheWVyLnRzPzE4YmEiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgR2FtZUNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL19iYXNlL0dhbWVDb21wb25lbnRcIik7XHJcbmNvbnN0IENhbWVyYV8xID0gcmVxdWlyZShcIi4uL0NhbWVyYS9DYW1lcmFcIik7XHJcbmNvbnN0IEdhbWVFbmdpbmVfMSA9IHJlcXVpcmUoXCIuLi9FbmdpbmUvR2FtZUVuZ2luZVwiKTtcclxuY2xhc3MgUGxheWVyIGV4dGVuZHMgR2FtZUNvbXBvbmVudF8xLkdhbWVDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IodHJhbnNmb3JtLCBsYXllcikge1xyXG4gICAgICAgIHN1cGVyKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XHJcbiAgICAgICAgdGhpcy5sYXllciA9IGxheWVyO1xyXG4gICAgICAgIC8vIHRpcmFyIGRhcXVpIGRlcG9pc1xyXG4gICAgICAgIC8vIE1lZ2FtYW5cclxuICAgICAgICAvLyBzdGF0ZXM6IEFycmF5PEFuaW1hdGlvblN0YXRlPiA9IFtcclxuICAgICAgICAvLyBcdHtcclxuICAgICAgICAvLyBcdFx0ZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAvLyBcdFx0bmFtZTogXCJpZGxlXCIsXHJcbiAgICAgICAgLy8gXHRcdGZyYW1lczogW1xyXG4gICAgICAgIC8vIFx0XHRcdHsgcmVjdDogeyB5OiAwLCB4OiAwLCB3aWR0aDogMzYsIGhlaWdodDogMzYgfSwgaW1hZ2U6ICdtZWdhbWFuJywgZGVsYXk6IDcgfSxcclxuICAgICAgICAvLyBcdFx0XHR7IHJlY3Q6IHsgeTogMCwgeDogMzYsIHdpZHRoOiAzNiwgaGVpZ2h0OiAzNiB9LCBpbWFnZTogJ21lZ2FtYW4nLCBkZWxheTogNyB9LFxyXG4gICAgICAgIC8vIFx0XHRcdHsgcmVjdDogeyB5OiAwLCB4OiA3Miwgd2lkdGg6IDM2LCBoZWlnaHQ6IDM2IH0sIGltYWdlOiAnbWVnYW1hbicsIGRlbGF5OiA3IH0sXHJcbiAgICAgICAgLy8gXHRcdFx0eyByZWN0OiB7IHk6IDAsIHg6IDEwOCwgd2lkdGg6IDM2LCBoZWlnaHQ6IDM2IH0sIGltYWdlOiAnbWVnYW1hbicsIGRlbGF5OiA3IH1cclxuICAgICAgICAvLyBcdFx0XVxyXG4gICAgICAgIC8vIFx0fSwge1xyXG4gICAgICAgIC8vIFx0XHRkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAvLyBcdFx0bmFtZTogXCJydW5cIixcclxuICAgICAgICAvLyBcdFx0ZnJhbWVzOiBbXHJcbiAgICAgICAgLy8gXHRcdFx0eyByZWN0OiB7IHk6IDM1LCB4OiAwLCB3aWR0aDogMzYsIGhlaWdodDogMzYgfSwgaW1hZ2U6ICdtZWdhbWFuJywgZGVsYXk6IDcgfSxcclxuICAgICAgICAvLyBcdFx0XHR7IHJlY3Q6IHsgeTogMzUsIHg6IDM2LCB3aWR0aDogMzYsIGhlaWdodDogMzYgfSwgaW1hZ2U6ICdtZWdhbWFuJywgZGVsYXk6IDcgfSxcclxuICAgICAgICAvLyBcdFx0XHR7IHJlY3Q6IHsgeTogMzUsIHg6IDcyLCB3aWR0aDogMzYsIGhlaWdodDogMzYgfSwgaW1hZ2U6ICdtZWdhbWFuJywgZGVsYXk6IDcgfSxcclxuICAgICAgICAvLyBcdFx0XHR7IHJlY3Q6IHsgeTogMzUsIHg6IDEwOCwgd2lkdGg6IDM2LCBoZWlnaHQ6IDM2IH0sIGltYWdlOiAnbWVnYW1hbicsIGRlbGF5OiA3IH0sXHJcbiAgICAgICAgLy8gXHRcdFx0eyByZWN0OiB7IHk6IDM1LCB4OiAxNDQsIHdpZHRoOiAzNiwgaGVpZ2h0OiAzNiB9LCBpbWFnZTogJ21lZ2FtYW4nLCBkZWxheTogNyB9LFxyXG4gICAgICAgIC8vIFx0XHRcdHsgcmVjdDogeyB5OiAzNSwgeDogMTgwLCB3aWR0aDogMzYsIGhlaWdodDogMzYgfSwgaW1hZ2U6ICdtZWdhbWFuJywgZGVsYXk6IDcgfSxcclxuICAgICAgICAvLyBcdFx0XHR7IHJlY3Q6IHsgeTogMzUsIHg6IDIxNiwgd2lkdGg6IDM2LCBoZWlnaHQ6IDM2IH0sIGltYWdlOiAnbWVnYW1hbicsIGRlbGF5OiA3IH1cclxuICAgICAgICAvLyBcdFx0XVxyXG4gICAgICAgIC8vIFx0fVxyXG4gICAgICAgIC8vIF07XHJcbiAgICAgICAgLy9saW5rXHJcbiAgICAgICAgdGhpcy5zdGF0ZXMgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImlkbGVcIixcclxuICAgICAgICAgICAgICAgIGZyYW1lczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgcmVjdDogeyB5OiAwLCB4OiAwLCB3aWR0aDogMTAyLCBoZWlnaHQ6IDExMC41IH0sIGltYWdlOiAnbGluaycsIGRlbGF5OiAxMDAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogMCwgeDogMTAyLCB3aWR0aDogMTAyLCBoZWlnaHQ6IDExMC41IH0sIGltYWdlOiAnbGluaycsIGRlbGF5OiA1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyByZWN0OiB7IHk6IDAsIHg6IDIwNCwgd2lkdGg6IDEwMiwgaGVpZ2h0OiAxMTAuNSB9LCBpbWFnZTogJ2xpbmsnLCBkZWxheTogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgcmVjdDogeyB5OiAwLCB4OiAwLCB3aWR0aDogMTAyLCBoZWlnaHQ6IDExMC41IH0sIGltYWdlOiAnbGluaycsIGRlbGF5OiAxNTAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogMCwgeDogMTAyLCB3aWR0aDogMTAyLCBoZWlnaHQ6IDExMC41IH0sIGltYWdlOiAnbGluaycsIGRlbGF5OiA1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyByZWN0OiB7IHk6IDAsIHg6IDIwNCwgd2lkdGg6IDEwMiwgaGVpZ2h0OiAxMTAuNSB9LCBpbWFnZTogJ2xpbmsnLCBkZWxheTogNSB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJydW4tdmVydGljYWxcIixcclxuICAgICAgICAgICAgICAgIGZyYW1lczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgcmVjdDogeyB5OiA0NDMsIHg6IDAsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiAxMDIsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiAyMDQsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiAzMDYsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiA0MDgsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiA1MTAsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiA2MTIsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiA3MTQsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiA4MTYsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNDQzLCB4OiA5MTgsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicnVuLWhvcml6b250YWxcIixcclxuICAgICAgICAgICAgICAgIGZyYW1lczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgcmVjdDogeyB5OiA3NzMuNSwgeDogMCwgd2lkdGg6IDEwMiwgaGVpZ2h0OiAxMTAuNSB9LCBpbWFnZTogJ2xpbmsnLCBkZWxheTogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgcmVjdDogeyB5OiA3NzMuNSwgeDogMTAyLCB3aWR0aDogMTAyLCBoZWlnaHQ6IDExMC41IH0sIGltYWdlOiAnbGluaycsIGRlbGF5OiA1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyByZWN0OiB7IHk6IDc3My41LCB4OiAyMDQsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNzczLjUsIHg6IDMwNiwgd2lkdGg6IDEwMiwgaGVpZ2h0OiAxMTAuNSB9LCBpbWFnZTogJ2xpbmsnLCBkZWxheTogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgcmVjdDogeyB5OiA3NzMuNSwgeDogNDA4LCB3aWR0aDogMTAyLCBoZWlnaHQ6IDExMC41IH0sIGltYWdlOiAnbGluaycsIGRlbGF5OiA1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyByZWN0OiB7IHk6IDc3My41LCB4OiA1MTAsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNzczLjUsIHg6IDYxMiwgd2lkdGg6IDEwMiwgaGVpZ2h0OiAxMTAuNSB9LCBpbWFnZTogJ2xpbmsnLCBkZWxheTogNSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgcmVjdDogeyB5OiA3NzMuNSwgeDogNzE0LCB3aWR0aDogMTAyLCBoZWlnaHQ6IDExMC41IH0sIGltYWdlOiAnbGluaycsIGRlbGF5OiA1IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyByZWN0OiB7IHk6IDc3My41LCB4OiA4MTYsIHdpZHRoOiAxMDIsIGhlaWdodDogMTEwLjUgfSwgaW1hZ2U6ICdsaW5rJywgZGVsYXk6IDUgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHJlY3Q6IHsgeTogNzczLjUsIHg6IDkxOCwgd2lkdGg6IDEwMiwgaGVpZ2h0OiAxMTAuNSB9LCBpbWFnZTogJ2xpbmsnLCBkZWxheTogNSB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgQXdha2UoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVDb21wb25lbnQgPSB0aGlzLmdldENvbXBvbmVudChcIlNwcml0ZVwiKTtcclxuICAgICAgICB0aGlzLmNGb2xsb3cgPSBDYW1lcmFfMS5DYW1lcmEuaW5zdGFuY2UuZ2V0Q29tcG9uZW50KFwiQ2FtZXJhRm9sbG93XCIpO1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gdGhpcy5nZXRDb21wb25lbnQoXCJBbmltYXRpb25cIik7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb24uYW5pbWF0aW9uU3RhdGVzID0gdGhpcy5zdGF0ZXM7XHJcbiAgICB9XHJcbiAgICBVcGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVDb21wb25lbnQuc3ByaXRlLmRlc3RSZWN0ID0ge1xyXG4gICAgICAgICAgICB4OiAoKENhbWVyYV8xLkNhbWVyYS5pbnN0YW5jZS50cmFuc2Zvcm0ueCAqIC0xKSArIHRoaXMuY0ZvbGxvdy50YXJnZXQudHJhbnNmb3JtLngpLFxyXG4gICAgICAgICAgICB5OiAoKENhbWVyYV8xLkNhbWVyYS5pbnN0YW5jZS50cmFuc2Zvcm0ueSAqIC0xKSArIHRoaXMuY0ZvbGxvdy50YXJnZXQudHJhbnNmb3JtLnkpLFxyXG4gICAgICAgICAgICB3aWR0aDogNjQsXHJcbiAgICAgICAgICAgIGhlaWdodDogNjRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUT0RPOiBUZW50YXIgdHJhbnNmZXJpciBlc3NhIGxvZ2ljYSBwYXJhIG91dHJvIGx1Z2FyXHJcbiAgICAgKiBTcHJpdGUgb3UgbyBiYXNlXHJcbiAgICAgKi9cclxuICAgIE9uUmVuZGVyKCkge1xyXG4gICAgICAgIGxldCBzcmNSZWN0ID0gdGhpcy5zcHJpdGVDb21wb25lbnQuc3ByaXRlLnNvdXJjZVJlY3Q7XHJcbiAgICAgICAgbGV0IGRlc3RSZWN0ID0gdGhpcy5zcHJpdGVDb21wb25lbnQuc3ByaXRlLmRlc3RSZWN0O1xyXG4gICAgICAgIEdhbWVFbmdpbmVfMS5HYW1lRW5naW5lLmluc3RhbmNlLmNvbnRleHQyRC5kcmF3SW1hZ2UodGhpcy5zcHJpdGVDb21wb25lbnQuc3ByaXRlLmltYWdlLCBzcmNSZWN0LngsIHNyY1JlY3QueSwgc3JjUmVjdC53aWR0aCwgc3JjUmVjdC5oZWlnaHQsIGRlc3RSZWN0LngsIGRlc3RSZWN0LnksIGRlc3RSZWN0LndpZHRoLCBkZXN0UmVjdC5oZWlnaHQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNyY1JlY3QsIGRlc3RSZWN0KVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9DaGFyYWN0ZXIvUGxheWVyLnRzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///8\n");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar Direction;\r\n(function (Direction) {\r\n    Direction[Direction[\"Up\"] = -1] = \"Up\";\r\n    Direction[Direction[\"Down\"] = 1] = \"Down\";\r\n    Direction[Direction[\"Left\"] = -1] = \"Left\";\r\n    Direction[Direction[\"Right\"] = 1] = \"Right\";\r\n    Direction[Direction[\"Idle\"] = 0] = \"Idle\";\r\n})(Direction = exports.Direction || (exports.Direction = {}));\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9fYmFzZS9pbnRlcmZhY2UvcG9zaXRpb24uaW50ZXJmYWNlLnRzPzhlOTYiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIERpcmVjdGlvbjtcclxuKGZ1bmN0aW9uIChEaXJlY3Rpb24pIHtcclxuICAgIERpcmVjdGlvbltEaXJlY3Rpb25bXCJVcFwiXSA9IC0xXSA9IFwiVXBcIjtcclxuICAgIERpcmVjdGlvbltEaXJlY3Rpb25bXCJEb3duXCJdID0gMV0gPSBcIkRvd25cIjtcclxuICAgIERpcmVjdGlvbltEaXJlY3Rpb25bXCJMZWZ0XCJdID0gLTFdID0gXCJMZWZ0XCI7XHJcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiUmlnaHRcIl0gPSAxXSA9IFwiUmlnaHRcIjtcclxuICAgIERpcmVjdGlvbltEaXJlY3Rpb25bXCJJZGxlXCJdID0gMF0gPSBcIklkbGVcIjtcclxufSkoRGlyZWN0aW9uID0gZXhwb3J0cy5EaXJlY3Rpb24gfHwgKGV4cG9ydHMuRGlyZWN0aW9uID0ge30pKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvX2Jhc2UvaW50ZXJmYWNlL3Bvc2l0aW9uLmludGVyZmFjZS50c1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///9\n");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst GameComponent_1 = __webpack_require__(0);\r\nclass CameraFollow extends GameComponent_1.GameComponent {\r\n    constructor(transform, target, limitBorder) {\r\n        super(transform);\r\n        this.transform = transform;\r\n        this.target = target;\r\n        this.limitBorder = limitBorder;\r\n        this.center = true;\r\n    }\r\n    FixedUpdate() {\r\n        this.Follow();\r\n    }\r\n    Follow() {\r\n        if (!this.target)\r\n            return;\r\n        if (this.center) {\r\n            this.transform.x = this.target.transform.x - Math.floor(this.transform.width / 2);\r\n            this.transform.y = this.target.transform.y - Math.floor(this.transform.height / 2);\r\n        }\r\n        if (this.limitBorder) {\r\n            if (this.transform.x < 0)\r\n                this.transform.x = 0;\r\n            if (this.transform.y < 0)\r\n                this.transform.y = 0;\r\n            if (this.transform.x + this.transform.width > this.limitBorder.width) {\r\n                this.transform.x = this.limitBorder.width - this.transform.width;\r\n            }\r\n            if (this.transform.y + this.transform.height > this.limitBorder.height) {\r\n                this.transform.y = this.limitBorder.height - this.transform.height;\r\n            }\r\n        }\r\n    }\r\n}\r\nexports.CameraFollow = CameraFollow;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTAuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQ2FtZXJhL0NhbWVyYUZvbGxvdy50cz9kNDI4Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IEdhbWVDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9fYmFzZS9HYW1lQ29tcG9uZW50XCIpO1xyXG5jbGFzcyBDYW1lcmFGb2xsb3cgZXh0ZW5kcyBHYW1lQ29tcG9uZW50XzEuR2FtZUNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0cmFuc2Zvcm0sIHRhcmdldCwgbGltaXRCb3JkZXIpIHtcclxuICAgICAgICBzdXBlcih0cmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMubGltaXRCb3JkZXIgPSBsaW1pdEJvcmRlcjtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBGaXhlZFVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLkZvbGxvdygpO1xyXG4gICAgfVxyXG4gICAgRm9sbG93KCkge1xyXG4gICAgICAgIGlmICghdGhpcy50YXJnZXQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5jZW50ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0ueCA9IHRoaXMudGFyZ2V0LnRyYW5zZm9ybS54IC0gTWF0aC5mbG9vcih0aGlzLnRyYW5zZm9ybS53aWR0aCAvIDIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS55ID0gdGhpcy50YXJnZXQudHJhbnNmb3JtLnkgLSBNYXRoLmZsb29yKHRoaXMudHJhbnNmb3JtLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5saW1pdEJvcmRlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm0ueCA8IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS54ID0gMDtcclxuICAgICAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtLnkgPCAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm0ueSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybS54ICsgdGhpcy50cmFuc2Zvcm0ud2lkdGggPiB0aGlzLmxpbWl0Qm9yZGVyLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybS54ID0gdGhpcy5saW1pdEJvcmRlci53aWR0aCAtIHRoaXMudHJhbnNmb3JtLndpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybS55ICsgdGhpcy50cmFuc2Zvcm0uaGVpZ2h0ID4gdGhpcy5saW1pdEJvcmRlci5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtLnkgPSB0aGlzLmxpbWl0Qm9yZGVyLmhlaWdodCAtIHRoaXMudHJhbnNmb3JtLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLkNhbWVyYUZvbGxvdyA9IENhbWVyYUZvbGxvdztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvQ2FtZXJhL0NhbWVyYUZvbGxvdy50c1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///10\n");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst GameComponent_1 = __webpack_require__(0);\r\nconst Transform_1 = __webpack_require__(4);\r\nconst Sprite_1 = __webpack_require__(5);\r\nconst TileMapLayer_1 = __webpack_require__(12);\r\n/*\r\n * Isso irá ter uma coleção mapa de Tiles.\r\n * A cada layer, a ideia que seja um componente de Tile\r\n */\r\nclass TileMap extends GameComponent_1.GameComponent {\r\n    constructor(tileSet, tileSize, mapLayers, mapCollisions, blankImage // TODO: ficou ruim isso, depois rever\r\n    ) {\r\n        super(new Transform_1.Transform(0, 0, 832, 832));\r\n        this.tileSet = tileSet;\r\n        this.tileSize = tileSize;\r\n        this.mapLayers = mapLayers;\r\n        this.mapCollisions = mapCollisions;\r\n        this.blankImage = blankImage; // TODO: ficou ruim isso, depois rever\r\n    }\r\n    Awake() {\r\n        for (let layer = 0; layer < this.mapLayers.length; layer++) {\r\n            // TODO: Talvez, fazer um esquema de filho no Hierarchy aqui, e não adicionar como componente\r\n            let tileMapLayer = new TileMapLayer_1.TileMapLayer(this.tileSize, this.mapLayers[layer], this.blankImage);\r\n            let tileMapLayerSprite = new Sprite_1.Sprite(this.tileSet);\r\n            tileMapLayerSprite.layer = layer;\r\n            tileMapLayerSprite.orderInLayer = 0;\r\n            tileMapLayer.addComponent(tileMapLayerSprite);\r\n            tileMapLayer.Awake();\r\n            this.addComponent(tileMapLayer);\r\n        }\r\n    }\r\n}\r\nexports.TileMap = TileMap;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTEuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvVGlsZS9UaWxlTWFwLnRzP2EyNTQiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgR2FtZUNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL19iYXNlL0dhbWVDb21wb25lbnRcIik7XHJcbmNvbnN0IFRyYW5zZm9ybV8xID0gcmVxdWlyZShcIi4uL19iYXNlL1RyYW5zZm9ybVwiKTtcclxuY29uc3QgU3ByaXRlXzEgPSByZXF1aXJlKFwiLi4vU3ByaXRlL1Nwcml0ZVwiKTtcclxuY29uc3QgVGlsZU1hcExheWVyXzEgPSByZXF1aXJlKFwiLi9UaWxlTWFwTGF5ZXJcIik7XHJcbi8qXHJcbiAqIElzc28gaXLDoSB0ZXIgdW1hIGNvbGXDp8OjbyBtYXBhIGRlIFRpbGVzLlxyXG4gKiBBIGNhZGEgbGF5ZXIsIGEgaWRlaWEgcXVlIHNlamEgdW0gY29tcG9uZW50ZSBkZSBUaWxlXHJcbiAqL1xyXG5jbGFzcyBUaWxlTWFwIGV4dGVuZHMgR2FtZUNvbXBvbmVudF8xLkdhbWVDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IodGlsZVNldCwgdGlsZVNpemUsIG1hcExheWVycywgbWFwQ29sbGlzaW9ucywgYmxhbmtJbWFnZSAvLyBUT0RPOiBmaWNvdSBydWltIGlzc28sIGRlcG9pcyByZXZlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIobmV3IFRyYW5zZm9ybV8xLlRyYW5zZm9ybSgwLCAwLCA4MzIsIDgzMikpO1xyXG4gICAgICAgIHRoaXMudGlsZVNldCA9IHRpbGVTZXQ7XHJcbiAgICAgICAgdGhpcy50aWxlU2l6ZSA9IHRpbGVTaXplO1xyXG4gICAgICAgIHRoaXMubWFwTGF5ZXJzID0gbWFwTGF5ZXJzO1xyXG4gICAgICAgIHRoaXMubWFwQ29sbGlzaW9ucyA9IG1hcENvbGxpc2lvbnM7XHJcbiAgICAgICAgdGhpcy5ibGFua0ltYWdlID0gYmxhbmtJbWFnZTsgLy8gVE9ETzogZmljb3UgcnVpbSBpc3NvLCBkZXBvaXMgcmV2ZXJcclxuICAgIH1cclxuICAgIEF3YWtlKCkge1xyXG4gICAgICAgIGZvciAobGV0IGxheWVyID0gMDsgbGF5ZXIgPCB0aGlzLm1hcExheWVycy5sZW5ndGg7IGxheWVyKyspIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogVGFsdmV6LCBmYXplciB1bSBlc3F1ZW1hIGRlIGZpbGhvIG5vIEhpZXJhcmNoeSBhcXVpLCBlIG7Do28gYWRpY2lvbmFyIGNvbW8gY29tcG9uZW50ZVxyXG4gICAgICAgICAgICBsZXQgdGlsZU1hcExheWVyID0gbmV3IFRpbGVNYXBMYXllcl8xLlRpbGVNYXBMYXllcih0aGlzLnRpbGVTaXplLCB0aGlzLm1hcExheWVyc1tsYXllcl0sIHRoaXMuYmxhbmtJbWFnZSk7XHJcbiAgICAgICAgICAgIGxldCB0aWxlTWFwTGF5ZXJTcHJpdGUgPSBuZXcgU3ByaXRlXzEuU3ByaXRlKHRoaXMudGlsZVNldCk7XHJcbiAgICAgICAgICAgIHRpbGVNYXBMYXllclNwcml0ZS5sYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICB0aWxlTWFwTGF5ZXJTcHJpdGUub3JkZXJJbkxheWVyID0gMDtcclxuICAgICAgICAgICAgdGlsZU1hcExheWVyLmFkZENvbXBvbmVudCh0aWxlTWFwTGF5ZXJTcHJpdGUpO1xyXG4gICAgICAgICAgICB0aWxlTWFwTGF5ZXIuQXdha2UoKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQodGlsZU1hcExheWVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UaWxlTWFwID0gVGlsZU1hcDtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvVGlsZS9UaWxlTWFwLnRzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///11\n");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst GameComponent_1 = __webpack_require__(0);\r\nconst Transform_1 = __webpack_require__(4);\r\nconst Camera_1 = __webpack_require__(2);\r\nconst GameEngine_1 = __webpack_require__(3);\r\n/**\r\n* Seria um unico mapa de Tile\r\n*/\r\nclass TileMapLayer extends GameComponent_1.GameComponent {\r\n    constructor(tileSize, mapLayers, blankImage // TODO: ficou ruim isso, depois rever\r\n    ) {\r\n        super(new Transform_1.Transform(0, 0, 1, 1));\r\n        this.tileSize = tileSize;\r\n        this.mapLayers = mapLayers;\r\n        this.blankImage = blankImage; // TODO: ficou ruim isso, depois rever\r\n        this.beforeX = 0;\r\n        this.currentX = 0;\r\n    }\r\n    Awake() {\r\n        this.tileSet = this.getComponent(\"Sprite\");\r\n    }\r\n    OnRender() {\r\n        let rowLen = Math.floor(Camera_1.Camera.instance.transform.height / 64);\r\n        let colLen = Math.floor(Camera_1.Camera.instance.transform.width / 64);\r\n        let sumPosX = Camera_1.Camera.instance.transform.x - (Math.floor(Camera_1.Camera.instance.transform.x / this.tileSize) * this.tileSize);\r\n        let sumPosY = Camera_1.Camera.instance.transform.y - (Math.floor(Camera_1.Camera.instance.transform.y / this.tileSize) * this.tileSize);\r\n        for (let row = 0; row < rowLen + 1; row++) {\r\n            for (let col = 0; col < colLen + 1; col++) {\r\n                let posY = Math.floor(Camera_1.Camera.instance.transform.y / this.tileSize) + row;\r\n                let posX = Math.floor(Camera_1.Camera.instance.transform.x / this.tileSize) + col;\r\n                let imageSrc, widthSrc, heightSrc, widthDist, heightDist;\r\n                widthDist = col * this.tileSize;\r\n                heightDist = row * this.tileSize;\r\n                // TODO: Depois ver de pintar com hexa ao inves de imagem\r\n                if (posX < 0 || posY < 0 || posX >= this.mapLayers[0].length || posY >= this.mapLayers.length) {\r\n                    imageSrc = this.blankImage;\r\n                    widthSrc = 0;\r\n                    heightSrc = 0;\r\n                }\r\n                else {\r\n                    let tileNum = this.mapLayers[posY][posX];\r\n                    imageSrc = this.tileSet.sprite.image;\r\n                    widthSrc = ((tileNum - 1) % (this.tileSet.sprite.image.width / this.tileSize));\r\n                    heightSrc = Math.floor((tileNum - 1) / (this.tileSet.sprite.image.width / this.tileSize));\r\n                }\r\n                GameEngine_1.GameEngine.instance.context2D.drawImage(imageSrc, \r\n                // na imagem\r\n                widthSrc * this.tileSize, heightSrc * this.tileSize, this.tileSize, this.tileSize, \r\n                //no canvas\r\n                (col * this.tileSize) - sumPosX, (row * this.tileSize) - sumPosY, this.tileSize, this.tileSize);\r\n            }\r\n        }\r\n    }\r\n}\r\nexports.TileMapLayer = TileMapLayer;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvVGlsZS9UaWxlTWFwTGF5ZXIudHM/ZmQ3MCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBHYW1lQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vX2Jhc2UvR2FtZUNvbXBvbmVudFwiKTtcclxuY29uc3QgVHJhbnNmb3JtXzEgPSByZXF1aXJlKFwiLi4vX2Jhc2UvVHJhbnNmb3JtXCIpO1xyXG5jb25zdCBDYW1lcmFfMSA9IHJlcXVpcmUoXCIuLi9DYW1lcmEvQ2FtZXJhXCIpO1xyXG5jb25zdCBHYW1lRW5naW5lXzEgPSByZXF1aXJlKFwiLi4vRW5naW5lL0dhbWVFbmdpbmVcIik7XHJcbi8qKlxyXG4qIFNlcmlhIHVtIHVuaWNvIG1hcGEgZGUgVGlsZVxyXG4qL1xyXG5jbGFzcyBUaWxlTWFwTGF5ZXIgZXh0ZW5kcyBHYW1lQ29tcG9uZW50XzEuR2FtZUNvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0aWxlU2l6ZSwgbWFwTGF5ZXJzLCBibGFua0ltYWdlIC8vIFRPRE86IGZpY291IHJ1aW0gaXNzbywgZGVwb2lzIHJldmVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihuZXcgVHJhbnNmb3JtXzEuVHJhbnNmb3JtKDAsIDAsIDEsIDEpKTtcclxuICAgICAgICB0aGlzLnRpbGVTaXplID0gdGlsZVNpemU7XHJcbiAgICAgICAgdGhpcy5tYXBMYXllcnMgPSBtYXBMYXllcnM7XHJcbiAgICAgICAgdGhpcy5ibGFua0ltYWdlID0gYmxhbmtJbWFnZTsgLy8gVE9ETzogZmljb3UgcnVpbSBpc3NvLCBkZXBvaXMgcmV2ZXJcclxuICAgICAgICB0aGlzLmJlZm9yZVggPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFggPSAwO1xyXG4gICAgfVxyXG4gICAgQXdha2UoKSB7XHJcbiAgICAgICAgdGhpcy50aWxlU2V0ID0gdGhpcy5nZXRDb21wb25lbnQoXCJTcHJpdGVcIik7XHJcbiAgICB9XHJcbiAgICBPblJlbmRlcigpIHtcclxuICAgICAgICBsZXQgcm93TGVuID0gTWF0aC5mbG9vcihDYW1lcmFfMS5DYW1lcmEuaW5zdGFuY2UudHJhbnNmb3JtLmhlaWdodCAvIDY0KTtcclxuICAgICAgICBsZXQgY29sTGVuID0gTWF0aC5mbG9vcihDYW1lcmFfMS5DYW1lcmEuaW5zdGFuY2UudHJhbnNmb3JtLndpZHRoIC8gNjQpO1xyXG4gICAgICAgIGxldCBzdW1Qb3NYID0gQ2FtZXJhXzEuQ2FtZXJhLmluc3RhbmNlLnRyYW5zZm9ybS54IC0gKE1hdGguZmxvb3IoQ2FtZXJhXzEuQ2FtZXJhLmluc3RhbmNlLnRyYW5zZm9ybS54IC8gdGhpcy50aWxlU2l6ZSkgKiB0aGlzLnRpbGVTaXplKTtcclxuICAgICAgICBsZXQgc3VtUG9zWSA9IENhbWVyYV8xLkNhbWVyYS5pbnN0YW5jZS50cmFuc2Zvcm0ueSAtIChNYXRoLmZsb29yKENhbWVyYV8xLkNhbWVyYS5pbnN0YW5jZS50cmFuc2Zvcm0ueSAvIHRoaXMudGlsZVNpemUpICogdGhpcy50aWxlU2l6ZSk7XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93TGVuICsgMTsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sTGVuICsgMTsgY29sKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBwb3NZID0gTWF0aC5mbG9vcihDYW1lcmFfMS5DYW1lcmEuaW5zdGFuY2UudHJhbnNmb3JtLnkgLyB0aGlzLnRpbGVTaXplKSArIHJvdztcclxuICAgICAgICAgICAgICAgIGxldCBwb3NYID0gTWF0aC5mbG9vcihDYW1lcmFfMS5DYW1lcmEuaW5zdGFuY2UudHJhbnNmb3JtLnggLyB0aGlzLnRpbGVTaXplKSArIGNvbDtcclxuICAgICAgICAgICAgICAgIGxldCBpbWFnZVNyYywgd2lkdGhTcmMsIGhlaWdodFNyYywgd2lkdGhEaXN0LCBoZWlnaHREaXN0O1xyXG4gICAgICAgICAgICAgICAgd2lkdGhEaXN0ID0gY29sICogdGhpcy50aWxlU2l6ZTtcclxuICAgICAgICAgICAgICAgIGhlaWdodERpc3QgPSByb3cgKiB0aGlzLnRpbGVTaXplO1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogRGVwb2lzIHZlciBkZSBwaW50YXIgY29tIGhleGEgYW8gaW52ZXMgZGUgaW1hZ2VtXHJcbiAgICAgICAgICAgICAgICBpZiAocG9zWCA8IDAgfHwgcG9zWSA8IDAgfHwgcG9zWCA+PSB0aGlzLm1hcExheWVyc1swXS5sZW5ndGggfHwgcG9zWSA+PSB0aGlzLm1hcExheWVycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNyYyA9IHRoaXMuYmxhbmtJbWFnZTtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aFNyYyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0U3JjID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0aWxlTnVtID0gdGhpcy5tYXBMYXllcnNbcG9zWV1bcG9zWF07XHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VTcmMgPSB0aGlzLnRpbGVTZXQuc3ByaXRlLmltYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoU3JjID0gKCh0aWxlTnVtIC0gMSkgJSAodGhpcy50aWxlU2V0LnNwcml0ZS5pbWFnZS53aWR0aCAvIHRoaXMudGlsZVNpemUpKTtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHRTcmMgPSBNYXRoLmZsb29yKCh0aWxlTnVtIC0gMSkgLyAodGhpcy50aWxlU2V0LnNwcml0ZS5pbWFnZS53aWR0aCAvIHRoaXMudGlsZVNpemUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEdhbWVFbmdpbmVfMS5HYW1lRW5naW5lLmluc3RhbmNlLmNvbnRleHQyRC5kcmF3SW1hZ2UoaW1hZ2VTcmMsIFxyXG4gICAgICAgICAgICAgICAgLy8gbmEgaW1hZ2VtXHJcbiAgICAgICAgICAgICAgICB3aWR0aFNyYyAqIHRoaXMudGlsZVNpemUsIGhlaWdodFNyYyAqIHRoaXMudGlsZVNpemUsIHRoaXMudGlsZVNpemUsIHRoaXMudGlsZVNpemUsIFxyXG4gICAgICAgICAgICAgICAgLy9ubyBjYW52YXNcclxuICAgICAgICAgICAgICAgIChjb2wgKiB0aGlzLnRpbGVTaXplKSAtIHN1bVBvc1gsIChyb3cgKiB0aGlzLnRpbGVTaXplKSAtIHN1bVBvc1ksIHRoaXMudGlsZVNpemUsIHRoaXMudGlsZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVGlsZU1hcExheWVyID0gVGlsZU1hcExheWVyO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9UaWxlL1RpbGVNYXBMYXllci50c1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///12\n");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Component_1 = __webpack_require__(1);\r\nconst Resources_1 = __webpack_require__(6);\r\nclass Animation extends Component_1.Component {\r\n    constructor() {\r\n        super();\r\n        this.currentFrame = 0;\r\n        this.currentFrameDelay = 0;\r\n        this._animationStates = [];\r\n    }\r\n    set animationStates(value) {\r\n        this._animationStates = value;\r\n        this.currentState = this._animationStates.find(state => state.default);\r\n        // TODO: Aqui não será necessário mais tarde, obrigar sempre ter uma animação default\r\n        if (!this.currentState)\r\n            this.currentState = this._animationStates[0];\r\n    }\r\n    setState(stateName) {\r\n        this.currentState = this._animationStates.find((state) => state.name === stateName);\r\n    }\r\n    setAnimationFrame() {\r\n        this.spriteComponent.sprite.sourceRect = this.currentState.frames[this.currentFrame].rect;\r\n        this.spriteComponent.sprite.image = Resources_1.Resources[this.currentState.frames[this.currentFrame].image].file;\r\n    }\r\n    Awake() {\r\n        let parent = this.parent;\r\n        this.spriteComponent = parent.getComponent(\"Sprite\");\r\n        this.setAnimationFrame();\r\n    }\r\n    Update() {\r\n        if (!this._animationStates.length)\r\n            return;\r\n        if (this.currentState.frames[this.currentFrame].delay === this.currentFrameDelay) {\r\n            if (this.currentFrame + 1 > this.currentState.frames.length - 1) {\r\n                this.currentFrame = 0;\r\n            }\r\n            else {\r\n                this.currentFrame += 1;\r\n            }\r\n            this.currentFrameDelay = 0;\r\n            this.setAnimationFrame();\r\n        }\r\n        this.currentFrameDelay += 1;\r\n    }\r\n}\r\nexports.Animation = Animation;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQW5pbWF0aW9uL0FuaW1hdGlvbi50cz8zMTkyIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL19iYXNlL0NvbXBvbmVudFwiKTtcclxuY29uc3QgUmVzb3VyY2VzXzEgPSByZXF1aXJlKFwiLi4vX2Jhc2UvUmVzb3VyY2VzXCIpO1xyXG5jbGFzcyBBbmltYXRpb24gZXh0ZW5kcyBDb21wb25lbnRfMS5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50RnJhbWVEZWxheSA9IDA7XHJcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVzID0gW107XHJcbiAgICB9XHJcbiAgICBzZXQgYW5pbWF0aW9uU3RhdGVzKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uU3RhdGVzID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB0aGlzLl9hbmltYXRpb25TdGF0ZXMuZmluZChzdGF0ZSA9PiBzdGF0ZS5kZWZhdWx0KTtcclxuICAgICAgICAvLyBUT0RPOiBBcXVpIG7Do28gc2Vyw6EgbmVjZXNzw6FyaW8gbWFpcyB0YXJkZSwgb2JyaWdhciBzZW1wcmUgdGVyIHVtYSBhbmltYcOnw6NvIGRlZmF1bHRcclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHRoaXMuX2FuaW1hdGlvblN0YXRlc1swXTtcclxuICAgIH1cclxuICAgIHNldFN0YXRlKHN0YXRlTmFtZSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gdGhpcy5fYW5pbWF0aW9uU3RhdGVzLmZpbmQoKHN0YXRlKSA9PiBzdGF0ZS5uYW1lID09PSBzdGF0ZU5hbWUpO1xyXG4gICAgfVxyXG4gICAgc2V0QW5pbWF0aW9uRnJhbWUoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVDb21wb25lbnQuc3ByaXRlLnNvdXJjZVJlY3QgPSB0aGlzLmN1cnJlbnRTdGF0ZS5mcmFtZXNbdGhpcy5jdXJyZW50RnJhbWVdLnJlY3Q7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVDb21wb25lbnQuc3ByaXRlLmltYWdlID0gUmVzb3VyY2VzXzEuUmVzb3VyY2VzW3RoaXMuY3VycmVudFN0YXRlLmZyYW1lc1t0aGlzLmN1cnJlbnRGcmFtZV0uaW1hZ2VdLmZpbGU7XHJcbiAgICB9XHJcbiAgICBBd2FrZSgpIHtcclxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVDb21wb25lbnQgPSBwYXJlbnQuZ2V0Q29tcG9uZW50KFwiU3ByaXRlXCIpO1xyXG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uRnJhbWUoKTtcclxuICAgIH1cclxuICAgIFVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2FuaW1hdGlvblN0YXRlcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGUuZnJhbWVzW3RoaXMuY3VycmVudEZyYW1lXS5kZWxheSA9PT0gdGhpcy5jdXJyZW50RnJhbWVEZWxheSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50RnJhbWUgKyAxID4gdGhpcy5jdXJyZW50U3RhdGUuZnJhbWVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEZyYW1lICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50RnJhbWVEZWxheSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uRnJhbWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50RnJhbWVEZWxheSArPSAxO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQW5pbWF0aW9uID0gQW5pbWF0aW9uO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9BbmltYXRpb24vQW5pbWF0aW9uLnRzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///13\n");

/***/ })
/******/ ]);