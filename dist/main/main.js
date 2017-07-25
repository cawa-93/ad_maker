module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if(err) {
/******/ 				if(__webpack_require__.onError)
/******/ 					return __webpack_require__.oe(err);
/******/ 				else
/******/ 					throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext("(function(exports) {" + content + "\n})", filename)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if(err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch(e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "775fea31ca2d98fabe3e"; // eslint-disable-line no-unused-vars
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
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
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
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
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
/******/ 								orginalError: err
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
/******/ 	return hotCreateRequire(1)(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/debug/src/browser.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This is the web browser implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(\"./node_modules/debug/src/debug.js\");\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\nexports.storage = 'undefined' != typeof chrome\n               && 'undefined' != typeof chrome.storage\n                  ? chrome.storage.local\n                  : localstorage();\n\n/**\n * Colors.\n */\n\nexports.colors = [\n  'lightseagreen',\n  'forestgreen',\n  'goldenrod',\n  'dodgerblue',\n  'darkorchid',\n  'crimson'\n];\n\n/**\n * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n * and the Firebug extension (any Firefox version) are known\n * to support \"%c\" CSS customizations.\n *\n * TODO: add a `localStorage` variable to explicitly enable/disable colors\n */\n\nfunction useColors() {\n  // NB: In an Electron preload script, document will be defined but not fully\n  // initialized. Since we know we're in Chrome, we'll just detect this case\n  // explicitly\n  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {\n    return true;\n  }\n\n  // is webkit? http://stackoverflow.com/a/16459606/376773\n  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632\n  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||\n    // is firebug? http://stackoverflow.com/a/398120/376773\n    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||\n    // is firefox >= v31?\n    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||\n    // double check webkit in userAgent just in case we are in a worker\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\\/(\\d+)/));\n}\n\n/**\n * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n */\n\nexports.formatters.j = function(v) {\n  try {\n    return JSON.stringify(v);\n  } catch (err) {\n    return '[UnexpectedJSONParseError]: ' + err.message;\n  }\n};\n\n\n/**\n * Colorize log arguments if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var useColors = this.useColors;\n\n  args[0] = (useColors ? '%c' : '')\n    + this.namespace\n    + (useColors ? ' %c' : ' ')\n    + args[0]\n    + (useColors ? '%c ' : ' ')\n    + '+' + exports.humanize(this.diff);\n\n  if (!useColors) return;\n\n  var c = 'color: ' + this.color;\n  args.splice(1, 0, c, 'color: inherit')\n\n  // the final \"%c\" is somewhat tricky, because there could be other\n  // arguments passed either before or after the %c, so we need to\n  // figure out the correct index to insert the CSS into\n  var index = 0;\n  var lastC = 0;\n  args[0].replace(/%[a-zA-Z%]/g, function(match) {\n    if ('%%' === match) return;\n    index++;\n    if ('%c' === match) {\n      // we only are interested in the *last* %c\n      // (the user may have provided their own)\n      lastC = index;\n    }\n  });\n\n  args.splice(lastC, 0, c);\n}\n\n/**\n * Invokes `console.log()` when available.\n * No-op when `console.log` is not a \"function\".\n *\n * @api public\n */\n\nfunction log() {\n  // this hackery is required for IE8/9, where\n  // the `console.log` function doesn't have 'apply'\n  return 'object' === typeof console\n    && console.log\n    && Function.prototype.apply.call(console.log, console, arguments);\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  try {\n    if (null == namespaces) {\n      exports.storage.removeItem('debug');\n    } else {\n      exports.storage.debug = namespaces;\n    }\n  } catch(e) {}\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  var r;\n  try {\n    r = exports.storage.debug;\n  } catch(e) {}\n\n  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG\n  if (!r && typeof process !== 'undefined' && 'env' in process) {\n    r = process.env.DEBUG;\n  }\n\n  return r;\n}\n\n/**\n * Enable namespaces listed in `localStorage.debug` initially.\n */\n\nexports.enable(load());\n\n/**\n * Localstorage attempts to return the localstorage.\n *\n * This is necessary because safari throws\n * when a user disables cookies/localstorage\n * and you attempt to access it.\n *\n * @return {LocalStorage}\n * @api private\n */\n\nfunction localstorage() {\n  try {\n    return window.localStorage;\n  } catch (e) {}\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanM/MTcyZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0giLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9ICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWVcbiAgICAgICAgICAgICAgICYmICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWUuc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgPyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAgICAgICAgICAgICAgICAgOiBsb2NhbHN0b3JhZ2UoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG4gICdsaWdodHNlYWdyZWVuJyxcbiAgJ2ZvcmVzdGdyZWVuJyxcbiAgJ2dvbGRlbnJvZCcsXG4gICdkb2RnZXJibHVlJyxcbiAgJ2RhcmtvcmNoaWQnLFxuICAnY3JpbXNvbidcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICAvLyBOQjogSW4gYW4gRWxlY3Ryb24gcHJlbG9hZCBzY3JpcHQsIGRvY3VtZW50IHdpbGwgYmUgZGVmaW5lZCBidXQgbm90IGZ1bGx5XG4gIC8vIGluaXRpYWxpemVkLiBTaW5jZSB3ZSBrbm93IHdlJ3JlIGluIENocm9tZSwgd2UnbGwganVzdCBkZXRlY3QgdGhpcyBjYXNlXG4gIC8vIGV4cGxpY2l0bHlcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wcm9jZXNzICYmIHdpbmRvdy5wcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIGlzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIC8vIGRvY3VtZW50IGlzIHVuZGVmaW5lZCBpbiByZWFjdC1uYXRpdmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC1uYXRpdmUvcHVsbC8xNjMyXG4gIHJldHVybiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5XZWJraXRBcHBlYXJhbmNlKSB8fFxuICAgIC8vIGlzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcbiAgICAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLmZpcmVidWcgfHwgKHdpbmRvdy5jb25zb2xlLmV4Y2VwdGlvbiAmJiB3aW5kb3cuY29uc29sZS50YWJsZSkpKSB8fFxuICAgIC8vIGlzIGZpcmVmb3ggPj0gdjMxP1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50ICYmIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKSB8fFxuICAgIC8vIGRvdWJsZSBjaGVjayB3ZWJraXQgaW4gdXNlckFnZW50IGp1c3QgaW4gY2FzZSB3ZSBhcmUgaW4gYSB3b3JrZXJcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2FwcGxld2Via2l0XFwvKFxcZCspLykpO1xufVxuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiAnW1VuZXhwZWN0ZWRKU09OUGFyc2VFcnJvcl06ICcgKyBlcnIubWVzc2FnZTtcbiAgfVxufTtcblxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoYXJncykge1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgYXJnc1swXSA9ICh1c2VDb2xvcnMgPyAnJWMnIDogJycpXG4gICAgKyB0aGlzLm5hbWVzcGFjZVxuICAgICsgKHVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKVxuICAgICsgYXJnc1swXVxuICAgICsgKHVzZUNvbG9ycyA/ICclYyAnIDogJyAnKVxuICAgICsgJysnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdXNlQ29sb3JzKSByZXR1cm47XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzLnNwbGljZSgxLCAwLCBjLCAnY29sb3I6IGluaGVyaXQnKVxuXG4gIC8vIHRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG4gIC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cbiAgLy8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIGlmICgnJSUnID09PSBtYXRjaCkgcmV0dXJuO1xuICAgIGluZGV4Kys7XG4gICAgaWYgKCclYycgPT09IG1hdGNoKSB7XG4gICAgICAvLyB3ZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbiAgICAgIC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG4gICAgICBsYXN0QyA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgYXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UuZGVidWcgPSBuYW1lc3BhY2VzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHZhciByO1xuICB0cnkge1xuICAgIHIgPSBleHBvcnRzLnN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cblxuICAvLyBJZiBkZWJ1ZyBpc24ndCBzZXQgaW4gTFMsIGFuZCB3ZSdyZSBpbiBFbGVjdHJvbiwgdHJ5IHRvIGxvYWQgJERFQlVHXG4gIGlmICghciAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ2VudicgaW4gcHJvY2Vzcykge1xuICAgIHIgPSBwcm9jZXNzLmVudi5ERUJVRztcbiAgfVxuXG4gIHJldHVybiByO1xufVxuXG4vKipcbiAqIEVuYWJsZSBuYW1lc3BhY2VzIGxpc3RlZCBpbiBgbG9jYWxTdG9yYWdlLmRlYnVnYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/debug/src/browser.js\n");

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/***/ (function(module, exports, __webpack_require__) {

eval("\n/**\n * This is the common logic for both the Node.js and web browser\n * implementations of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = createDebug.debug = createDebug['default'] = createDebug;\nexports.coerce = coerce;\nexports.disable = disable;\nexports.enable = enable;\nexports.enabled = enabled;\nexports.humanize = __webpack_require__(\"./node_modules/ms/index.js\");\n\n/**\n * The currently active debug mode names, and names to skip.\n */\n\nexports.names = [];\nexports.skips = [];\n\n/**\n * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n *\n * Valid key names are a single, lower or upper-case letter, i.e. \"n\" and \"N\".\n */\n\nexports.formatters = {};\n\n/**\n * Previous log timestamp.\n */\n\nvar prevTime;\n\n/**\n * Select a color.\n * @param {String} namespace\n * @return {Number}\n * @api private\n */\n\nfunction selectColor(namespace) {\n  var hash = 0, i;\n\n  for (i in namespace) {\n    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);\n    hash |= 0; // Convert to 32bit integer\n  }\n\n  return exports.colors[Math.abs(hash) % exports.colors.length];\n}\n\n/**\n * Create a debugger with the given `namespace`.\n *\n * @param {String} namespace\n * @return {Function}\n * @api public\n */\n\nfunction createDebug(namespace) {\n\n  function debug() {\n    // disabled?\n    if (!debug.enabled) return;\n\n    var self = debug;\n\n    // set `diff` timestamp\n    var curr = +new Date();\n    var ms = curr - (prevTime || curr);\n    self.diff = ms;\n    self.prev = prevTime;\n    self.curr = curr;\n    prevTime = curr;\n\n    // turn the `arguments` into a proper Array\n    var args = new Array(arguments.length);\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i];\n    }\n\n    args[0] = exports.coerce(args[0]);\n\n    if ('string' !== typeof args[0]) {\n      // anything else let's inspect with %O\n      args.unshift('%O');\n    }\n\n    // apply any `formatters` transformations\n    var index = 0;\n    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {\n      // if we encounter an escaped % then don't increase the array index\n      if (match === '%%') return match;\n      index++;\n      var formatter = exports.formatters[format];\n      if ('function' === typeof formatter) {\n        var val = args[index];\n        match = formatter.call(self, val);\n\n        // now we need to remove `args[index]` since it's inlined in the `format`\n        args.splice(index, 1);\n        index--;\n      }\n      return match;\n    });\n\n    // apply env-specific formatting (colors, etc.)\n    exports.formatArgs.call(self, args);\n\n    var logFn = debug.log || exports.log || console.log.bind(console);\n    logFn.apply(self, args);\n  }\n\n  debug.namespace = namespace;\n  debug.enabled = exports.enabled(namespace);\n  debug.useColors = exports.useColors();\n  debug.color = selectColor(namespace);\n\n  // env-specific initialization logic for debug instances\n  if ('function' === typeof exports.init) {\n    exports.init(debug);\n  }\n\n  return debug;\n}\n\n/**\n * Enables a debug mode by namespaces. This can include modes\n * separated by a colon and wildcards.\n *\n * @param {String} namespaces\n * @api public\n */\n\nfunction enable(namespaces) {\n  exports.save(namespaces);\n\n  exports.names = [];\n  exports.skips = [];\n\n  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\\s,]+/);\n  var len = split.length;\n\n  for (var i = 0; i < len; i++) {\n    if (!split[i]) continue; // ignore empty strings\n    namespaces = split[i].replace(/\\*/g, '.*?');\n    if (namespaces[0] === '-') {\n      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n    } else {\n      exports.names.push(new RegExp('^' + namespaces + '$'));\n    }\n  }\n}\n\n/**\n * Disable debug output.\n *\n * @api public\n */\n\nfunction disable() {\n  exports.enable('');\n}\n\n/**\n * Returns true if the given mode name is enabled, false otherwise.\n *\n * @param {String} name\n * @return {Boolean}\n * @api public\n */\n\nfunction enabled(name) {\n  var i, len;\n  for (i = 0, len = exports.skips.length; i < len; i++) {\n    if (exports.skips[i].test(name)) {\n      return false;\n    }\n  }\n  for (i = 0, len = exports.names.length; i < len; i++) {\n    if (exports.names[i].test(name)) {\n      return true;\n    }\n  }\n  return false;\n}\n\n/**\n * Coerce `val`.\n *\n * @param {Mixed} val\n * @return {Mixed}\n * @api private\n */\n\nfunction coerce(val) {\n  if (val instanceof Error) return val.stack || val.message;\n  return val;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2RlYnVnLmpzP2JlNmMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQixTQUFTO0FBQzFCLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUMsU0FBUztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxTQUFTO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2RlYnVnLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWdbJ2RlZmF1bHQnXSA9IGNyZWF0ZURlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlciBvciB1cHBlci1jYXNlIGxldHRlciwgaS5lLiBcIm5cIiBhbmQgXCJOXCIuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzID0ge307XG5cbi8qKlxuICogUHJldmlvdXMgbG9nIHRpbWVzdGFtcC5cbiAqL1xuXG52YXIgcHJldlRpbWU7XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZWxlY3RDb2xvcihuYW1lc3BhY2UpIHtcbiAgdmFyIGhhc2ggPSAwLCBpO1xuXG4gIGZvciAoaSBpbiBuYW1lc3BhY2UpIHtcbiAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgbmFtZXNwYWNlLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1tNYXRoLmFicyhoYXNoKSAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZURlYnVnKG5hbWVzcGFjZSkge1xuXG4gIGZ1bmN0aW9uIGRlYnVnKCkge1xuICAgIC8vIGRpc2FibGVkP1xuICAgIGlmICghZGVidWcuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgdmFyIHNlbGYgPSBkZWJ1ZztcblxuICAgIC8vIHNldCBgZGlmZmAgdGltZXN0YW1wXG4gICAgdmFyIGN1cnIgPSArbmV3IERhdGUoKTtcbiAgICB2YXIgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuICAgIHNlbGYuZGlmZiA9IG1zO1xuICAgIHNlbGYucHJldiA9IHByZXZUaW1lO1xuICAgIHNlbGYuY3VyciA9IGN1cnI7XG4gICAgcHJldlRpbWUgPSBjdXJyO1xuXG4gICAgLy8gdHVybiB0aGUgYGFyZ3VtZW50c2AgaW50byBhIHByb3BlciBBcnJheVxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBhcmdzWzBdID0gZXhwb3J0cy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlT1xuICAgICAgYXJncy51bnNoaWZ0KCclTycpO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IGFueSBgZm9ybWF0dGVyc2AgdHJhbnNmb3JtYXRpb25zXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXpBLVolXSkvZywgZnVuY3Rpb24obWF0Y2gsIGZvcm1hdCkge1xuICAgICAgLy8gaWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuICAgICAgaWYgKG1hdGNoID09PSAnJSUnKSByZXR1cm4gbWF0Y2g7XG4gICAgICBpbmRleCsrO1xuICAgICAgdmFyIGZvcm1hdHRlciA9IGV4cG9ydHMuZm9ybWF0dGVyc1tmb3JtYXRdO1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmb3JtYXR0ZXIpIHtcbiAgICAgICAgdmFyIHZhbCA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICBtYXRjaCA9IGZvcm1hdHRlci5jYWxsKHNlbGYsIHZhbCk7XG5cbiAgICAgICAgLy8gbm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuICAgICAgICBhcmdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGluZGV4LS07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG5cbiAgICAvLyBhcHBseSBlbnYtc3BlY2lmaWMgZm9ybWF0dGluZyAoY29sb3JzLCBldGMuKVxuICAgIGV4cG9ydHMuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuXG4gICAgdmFyIGxvZ0ZuID0gZGVidWcubG9nIHx8IGV4cG9ydHMubG9nIHx8IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4gICAgbG9nRm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cblxuICBkZWJ1Zy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG4gIGRlYnVnLmVuYWJsZWQgPSBleHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKTtcbiAgZGVidWcudXNlQ29sb3JzID0gZXhwb3J0cy51c2VDb2xvcnMoKTtcbiAgZGVidWcuY29sb3IgPSBzZWxlY3RDb2xvcihuYW1lc3BhY2UpO1xuXG4gIC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5pbml0KSB7XG4gICAgZXhwb3J0cy5pbml0KGRlYnVnKTtcbiAgfVxuXG4gIHJldHVybiBkZWJ1Zztcbn1cblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gIGV4cG9ydHMuc2F2ZShuYW1lc3BhY2VzKTtcblxuICBleHBvcnRzLm5hbWVzID0gW107XG4gIGV4cG9ydHMuc2tpcHMgPSBbXTtcblxuICB2YXIgc3BsaXQgPSAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcyA6ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuICB2YXIgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoIXNwbGl0W2ldKSBjb250aW51ZTsgLy8gaWdub3JlIGVtcHR5IHN0cmluZ3NcbiAgICBuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcbiAgICBpZiAobmFtZXNwYWNlc1swXSA9PT0gJy0nKSB7XG4gICAgICBleHBvcnRzLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzLnN1YnN0cigxKSArICckJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkaXNhYmxlKCkge1xuICBleHBvcnRzLmVuYWJsZSgnJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcbiAgdmFyIGksIGxlbjtcbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ29lcmNlIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb2VyY2UodmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHZhbC5zdGFjayB8fCB2YWwubWVzc2FnZTtcbiAgcmV0dXJuIHZhbDtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9kZWJ1Zy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2RlYnVnLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/debug/src/debug.js\n");

/***/ }),

/***/ "./node_modules/debug/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Detect Electron renderer process, which is node, but we should\n * treat as a browser.\n */\n\nif (typeof process !== 'undefined' && process.type === 'renderer') {\n  module.exports = __webpack_require__(\"./node_modules/debug/src/browser.js\");\n} else {\n  module.exports = __webpack_require__(\"./node_modules/debug/src/node.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzPzQ2OWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGV0ZWN0IEVsZWN0cm9uIHJlbmRlcmVyIHByb2Nlc3MsIHdoaWNoIGlzIG5vZGUsIGJ1dCB3ZSBzaG91bGRcbiAqIHRyZWF0IGFzIGEgYnJvd3Nlci5cbiAqL1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL25vZGUuanMnKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/debug/src/index.js\n");

/***/ }),

/***/ "./node_modules/debug/src/node.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Module dependencies.\n */\n\nvar tty = __webpack_require__(4);\nvar util = __webpack_require__(5);\n\n/**\n * This is the Node.js implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(\"./node_modules/debug/src/debug.js\");\nexports.init = init;\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\n\n/**\n * Colors.\n */\n\nexports.colors = [6, 2, 3, 4, 5, 1];\n\n/**\n * Build up the default `inspectOpts` object from the environment variables.\n *\n *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js\n */\n\nexports.inspectOpts = Object.keys(process.env).filter(function (key) {\n  return /^debug_/i.test(key);\n}).reduce(function (obj, key) {\n  // camel-case\n  var prop = key\n    .substring(6)\n    .toLowerCase()\n    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });\n\n  // coerce string value into JS value\n  var val = process.env[key];\n  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;\n  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;\n  else if (val === 'null') val = null;\n  else val = Number(val);\n\n  obj[prop] = val;\n  return obj;\n}, {});\n\n/**\n * The file descriptor to write the `debug()` calls to.\n * Set the `DEBUG_FD` env variable to override with another value. i.e.:\n *\n *   $ DEBUG_FD=3 node script.js 3>debug.log\n */\n\nvar fd = parseInt(process.env.DEBUG_FD, 10) || 2;\n\nif (1 !== fd && 2 !== fd) {\n  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()\n}\n\nvar stream = 1 === fd ? process.stdout :\n             2 === fd ? process.stderr :\n             createWritableStdioStream(fd);\n\n/**\n * Is stdout a TTY? Colored output is enabled when `true`.\n */\n\nfunction useColors() {\n  return 'colors' in exports.inspectOpts\n    ? Boolean(exports.inspectOpts.colors)\n    : tty.isatty(fd);\n}\n\n/**\n * Map %o to `util.inspect()`, all on a single line.\n */\n\nexports.formatters.o = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts)\n    .replace(/\\s*\\n\\s*/g, ' ');\n};\n\n/**\n * Map %o to `util.inspect()`, allowing multiple lines if needed.\n */\n\nexports.formatters.O = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts);\n};\n\n/**\n * Adds ANSI color escape codes if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var name = this.namespace;\n  var useColors = this.useColors;\n\n  if (useColors) {\n    var c = this.color;\n    var prefix = '  \\u001b[3' + c + ';1m' + name + ' ' + '\\u001b[0m';\n\n    args[0] = prefix + args[0].split('\\n').join('\\n' + prefix);\n    args.push('\\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\\u001b[0m');\n  } else {\n    args[0] = new Date().toUTCString()\n      + ' ' + name + ' ' + args[0];\n  }\n}\n\n/**\n * Invokes `util.format()` with the specified arguments and writes to `stream`.\n */\n\nfunction log() {\n  return stream.write(util.format.apply(util, arguments) + '\\n');\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  if (null == namespaces) {\n    // If you set a process.env field to null or undefined, it gets cast to the\n    // string 'null' or 'undefined'. Just delete instead.\n    delete process.env.DEBUG;\n  } else {\n    process.env.DEBUG = namespaces;\n  }\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  return process.env.DEBUG;\n}\n\n/**\n * Copied from `node/src/node.js`.\n *\n * XXX: It's lame that node doesn't expose this API out-of-the-box. It also\n * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.\n */\n\nfunction createWritableStdioStream (fd) {\n  var stream;\n  var tty_wrap = process.binding('tty_wrap');\n\n  // Note stream._type is used for test-module-load-list.js\n\n  switch (tty_wrap.guessHandleType(fd)) {\n    case 'TTY':\n      stream = new tty.WriteStream(fd);\n      stream._type = 'tty';\n\n      // Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    case 'FILE':\n      var fs = __webpack_require__(6);\n      stream = new fs.SyncWriteStream(fd, { autoClose: false });\n      stream._type = 'fs';\n      break;\n\n    case 'PIPE':\n    case 'TCP':\n      var net = __webpack_require__(7);\n      stream = new net.Socket({\n        fd: fd,\n        readable: false,\n        writable: true\n      });\n\n      // FIXME Should probably have an option in net.Socket to create a\n      // stream from an existing fd which is writable only. But for now\n      // we'll just add this hack and set the `readable` member to false.\n      // Test: ./node test/fixtures/echo.js < /etc/passwd\n      stream.readable = false;\n      stream.read = null;\n      stream._type = 'pipe';\n\n      // FIXME Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    default:\n      // Probably an error on in uv_guess_handle()\n      throw new Error('Implement me. Unknown stream file type!');\n  }\n\n  // For supporting legacy API we put the FD here.\n  stream.fd = fd;\n\n  stream._isStdio = true;\n\n  return stream;\n}\n\n/**\n * Init logic for `debug` instances.\n *\n * Create a new `inspectOpts` object in case `useColors` is set\n * differently for a particular `debug` instance.\n */\n\nfunction init (debug) {\n  debug.inspectOpts = {};\n\n  var keys = Object.keys(exports.inspectOpts);\n  for (var i = 0; i < keys.length; i++) {\n    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];\n  }\n}\n\n/**\n * Enable namespaces listed in `process.env.DEBUG` initially.\n */\n\nexports.enable(load());\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanM/MjUwNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMseUJBQXlCOztBQUVwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMsSUFBSTs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkMsbUJBQW1CO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL25vZGUuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHR0eSA9IHJlcXVpcmUoJ3R0eScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgTm9kZS5qcyBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFs2LCAyLCAzLCA0LCA1LCAxXTtcblxuLyoqXG4gKiBCdWlsZCB1cCB0aGUgZGVmYXVsdCBgaW5zcGVjdE9wdHNgIG9iamVjdCBmcm9tIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gKlxuICogICAkIERFQlVHX0NPTE9SUz1ubyBERUJVR19ERVBUSD0xMCBERUJVR19TSE9XX0hJRERFTj1lbmFibGVkIG5vZGUgc2NyaXB0LmpzXG4gKi9cblxuZXhwb3J0cy5pbnNwZWN0T3B0cyA9IE9iamVjdC5rZXlzKHByb2Nlc3MuZW52KS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gL15kZWJ1Z18vaS50ZXN0KGtleSk7XG59KS5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gIC8vIGNhbWVsLWNhc2VcbiAgdmFyIHByb3AgPSBrZXlcbiAgICAuc3Vic3RyaW5nKDYpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXyhbYS16XSkvZywgZnVuY3Rpb24gKF8sIGspIHsgcmV0dXJuIGsudG9VcHBlckNhc2UoKSB9KTtcblxuICAvLyBjb2VyY2Ugc3RyaW5nIHZhbHVlIGludG8gSlMgdmFsdWVcbiAgdmFyIHZhbCA9IHByb2Nlc3MuZW52W2tleV07XG4gIGlmICgvXih5ZXN8b258dHJ1ZXxlbmFibGVkKSQvaS50ZXN0KHZhbCkpIHZhbCA9IHRydWU7XG4gIGVsc2UgaWYgKC9eKG5vfG9mZnxmYWxzZXxkaXNhYmxlZCkkL2kudGVzdCh2YWwpKSB2YWwgPSBmYWxzZTtcbiAgZWxzZSBpZiAodmFsID09PSAnbnVsbCcpIHZhbCA9IG51bGw7XG4gIGVsc2UgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgb2JqW3Byb3BdID0gdmFsO1xuICByZXR1cm4gb2JqO1xufSwge30pO1xuXG4vKipcbiAqIFRoZSBmaWxlIGRlc2NyaXB0b3IgdG8gd3JpdGUgdGhlIGBkZWJ1ZygpYCBjYWxscyB0by5cbiAqIFNldCB0aGUgYERFQlVHX0ZEYCBlbnYgdmFyaWFibGUgdG8gb3ZlcnJpZGUgd2l0aCBhbm90aGVyIHZhbHVlLiBpLmUuOlxuICpcbiAqICAgJCBERUJVR19GRD0zIG5vZGUgc2NyaXB0LmpzIDM+ZGVidWcubG9nXG4gKi9cblxudmFyIGZkID0gcGFyc2VJbnQocHJvY2Vzcy5lbnYuREVCVUdfRkQsIDEwKSB8fCAyO1xuXG5pZiAoMSAhPT0gZmQgJiYgMiAhPT0gZmQpIHtcbiAgdXRpbC5kZXByZWNhdGUoZnVuY3Rpb24oKXt9LCAnZXhjZXB0IGZvciBzdGRlcnIoMikgYW5kIHN0ZG91dCgxKSwgYW55IG90aGVyIHVzYWdlIG9mIERFQlVHX0ZEIGlzIGRlcHJlY2F0ZWQuIE92ZXJyaWRlIGRlYnVnLmxvZyBpZiB5b3Ugd2FudCB0byB1c2UgYSBkaWZmZXJlbnQgbG9nIGZ1bmN0aW9uIChodHRwczovL2dpdC5pby9kZWJ1Z19mZCknKSgpXG59XG5cbnZhciBzdHJlYW0gPSAxID09PSBmZCA/IHByb2Nlc3Muc3Rkb3V0IDpcbiAgICAgICAgICAgICAyID09PSBmZCA/IHByb2Nlc3Muc3RkZXJyIDpcbiAgICAgICAgICAgICBjcmVhdGVXcml0YWJsZVN0ZGlvU3RyZWFtKGZkKTtcblxuLyoqXG4gKiBJcyBzdGRvdXQgYSBUVFk/IENvbG9yZWQgb3V0cHV0IGlzIGVuYWJsZWQgd2hlbiBgdHJ1ZWAuXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICByZXR1cm4gJ2NvbG9ycycgaW4gZXhwb3J0cy5pbnNwZWN0T3B0c1xuICAgID8gQm9vbGVhbihleHBvcnRzLmluc3BlY3RPcHRzLmNvbG9ycylcbiAgICA6IHR0eS5pc2F0dHkoZmQpO1xufVxuXG4vKipcbiAqIE1hcCAlbyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGwgb24gYSBzaW5nbGUgbGluZS5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMubyA9IGZ1bmN0aW9uKHYpIHtcbiAgdGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcbiAgcmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKVxuICAgIC5yZXBsYWNlKC9cXHMqXFxuXFxzKi9nLCAnICcpO1xufTtcblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsb3dpbmcgbXVsdGlwbGUgbGluZXMgaWYgbmVlZGVkLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycy5PID0gZnVuY3Rpb24odikge1xuICB0aGlzLmluc3BlY3RPcHRzLmNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuICByZXR1cm4gdXRpbC5pbnNwZWN0KHYsIHRoaXMuaW5zcGVjdE9wdHMpO1xufTtcblxuLyoqXG4gKiBBZGRzIEFOU0kgY29sb3IgZXNjYXBlIGNvZGVzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIG5hbWUgPSB0aGlzLm5hbWVzcGFjZTtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGlmICh1c2VDb2xvcnMpIHtcbiAgICB2YXIgYyA9IHRoaXMuY29sb3I7XG4gICAgdmFyIHByZWZpeCA9ICcgIFxcdTAwMWJbMycgKyBjICsgJzsxbScgKyBuYW1lICsgJyAnICsgJ1xcdTAwMWJbMG0nO1xuXG4gICAgYXJnc1swXSA9IHByZWZpeCArIGFyZ3NbMF0uc3BsaXQoJ1xcbicpLmpvaW4oJ1xcbicgKyBwcmVmaXgpO1xuICAgIGFyZ3MucHVzaCgnXFx1MDAxYlszJyArIGMgKyAnbSsnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpICsgJ1xcdTAwMWJbMG0nKTtcbiAgfSBlbHNlIHtcbiAgICBhcmdzWzBdID0gbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXG4gICAgICArICcgJyArIG5hbWUgKyAnICcgKyBhcmdzWzBdO1xuICB9XG59XG5cbi8qKlxuICogSW52b2tlcyBgdXRpbC5mb3JtYXQoKWAgd2l0aCB0aGUgc3BlY2lmaWVkIGFyZ3VtZW50cyBhbmQgd3JpdGVzIHRvIGBzdHJlYW1gLlxuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgcmV0dXJuIHN0cmVhbS53cml0ZSh1dGlsLmZvcm1hdC5hcHBseSh1dGlsLCBhcmd1bWVudHMpICsgJ1xcbicpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgaWYgKG51bGwgPT0gbmFtZXNwYWNlcykge1xuICAgIC8vIElmIHlvdSBzZXQgYSBwcm9jZXNzLmVudiBmaWVsZCB0byBudWxsIG9yIHVuZGVmaW5lZCwgaXQgZ2V0cyBjYXN0IHRvIHRoZVxuICAgIC8vIHN0cmluZyAnbnVsbCcgb3IgJ3VuZGVmaW5lZCcuIEp1c3QgZGVsZXRlIGluc3RlYWQuXG4gICAgZGVsZXRlIHByb2Nlc3MuZW52LkRFQlVHO1xuICB9IGVsc2Uge1xuICAgIHByb2Nlc3MuZW52LkRFQlVHID0gbmFtZXNwYWNlcztcbiAgfVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHJldHVybiBwcm9jZXNzLmVudi5ERUJVRztcbn1cblxuLyoqXG4gKiBDb3BpZWQgZnJvbSBgbm9kZS9zcmMvbm9kZS5qc2AuXG4gKlxuICogWFhYOiBJdCdzIGxhbWUgdGhhdCBub2RlIGRvZXNuJ3QgZXhwb3NlIHRoaXMgQVBJIG91dC1vZi10aGUtYm94LiBJdCBhbHNvXG4gKiByZWxpZXMgb24gdGhlIHVuZG9jdW1lbnRlZCBgdHR5X3dyYXAuZ3Vlc3NIYW5kbGVUeXBlKClgIHdoaWNoIGlzIGFsc28gbGFtZS5cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVXcml0YWJsZVN0ZGlvU3RyZWFtIChmZCkge1xuICB2YXIgc3RyZWFtO1xuICB2YXIgdHR5X3dyYXAgPSBwcm9jZXNzLmJpbmRpbmcoJ3R0eV93cmFwJyk7XG5cbiAgLy8gTm90ZSBzdHJlYW0uX3R5cGUgaXMgdXNlZCBmb3IgdGVzdC1tb2R1bGUtbG9hZC1saXN0LmpzXG5cbiAgc3dpdGNoICh0dHlfd3JhcC5ndWVzc0hhbmRsZVR5cGUoZmQpKSB7XG4gICAgY2FzZSAnVFRZJzpcbiAgICAgIHN0cmVhbSA9IG5ldyB0dHkuV3JpdGVTdHJlYW0oZmQpO1xuICAgICAgc3RyZWFtLl90eXBlID0gJ3R0eSc7XG5cbiAgICAgIC8vIEhhY2sgdG8gaGF2ZSBzdHJlYW0gbm90IGtlZXAgdGhlIGV2ZW50IGxvb3AgYWxpdmUuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzI2XG4gICAgICBpZiAoc3RyZWFtLl9oYW5kbGUgJiYgc3RyZWFtLl9oYW5kbGUudW5yZWYpIHtcbiAgICAgICAgc3RyZWFtLl9oYW5kbGUudW5yZWYoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnRklMRSc6XG4gICAgICB2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgc3RyZWFtID0gbmV3IGZzLlN5bmNXcml0ZVN0cmVhbShmZCwgeyBhdXRvQ2xvc2U6IGZhbHNlIH0pO1xuICAgICAgc3RyZWFtLl90eXBlID0gJ2ZzJztcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUElQRSc6XG4gICAgY2FzZSAnVENQJzpcbiAgICAgIHZhciBuZXQgPSByZXF1aXJlKCduZXQnKTtcbiAgICAgIHN0cmVhbSA9IG5ldyBuZXQuU29ja2V0KHtcbiAgICAgICAgZmQ6IGZkLFxuICAgICAgICByZWFkYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgLy8gRklYTUUgU2hvdWxkIHByb2JhYmx5IGhhdmUgYW4gb3B0aW9uIGluIG5ldC5Tb2NrZXQgdG8gY3JlYXRlIGFcbiAgICAgIC8vIHN0cmVhbSBmcm9tIGFuIGV4aXN0aW5nIGZkIHdoaWNoIGlzIHdyaXRhYmxlIG9ubHkuIEJ1dCBmb3Igbm93XG4gICAgICAvLyB3ZSdsbCBqdXN0IGFkZCB0aGlzIGhhY2sgYW5kIHNldCB0aGUgYHJlYWRhYmxlYCBtZW1iZXIgdG8gZmFsc2UuXG4gICAgICAvLyBUZXN0OiAuL25vZGUgdGVzdC9maXh0dXJlcy9lY2hvLmpzIDwgL2V0Yy9wYXNzd2RcbiAgICAgIHN0cmVhbS5yZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RyZWFtLnJlYWQgPSBudWxsO1xuICAgICAgc3RyZWFtLl90eXBlID0gJ3BpcGUnO1xuXG4gICAgICAvLyBGSVhNRSBIYWNrIHRvIGhhdmUgc3RyZWFtIG5vdCBrZWVwIHRoZSBldmVudCBsb29wIGFsaXZlLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcyNlxuICAgICAgaWYgKHN0cmVhbS5faGFuZGxlICYmIHN0cmVhbS5faGFuZGxlLnVucmVmKSB7XG4gICAgICAgIHN0cmVhbS5faGFuZGxlLnVucmVmKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBQcm9iYWJseSBhbiBlcnJvciBvbiBpbiB1dl9ndWVzc19oYW5kbGUoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbXBsZW1lbnQgbWUuIFVua25vd24gc3RyZWFtIGZpbGUgdHlwZSEnKTtcbiAgfVxuXG4gIC8vIEZvciBzdXBwb3J0aW5nIGxlZ2FjeSBBUEkgd2UgcHV0IHRoZSBGRCBoZXJlLlxuICBzdHJlYW0uZmQgPSBmZDtcblxuICBzdHJlYW0uX2lzU3RkaW8gPSB0cnVlO1xuXG4gIHJldHVybiBzdHJlYW07XG59XG5cbi8qKlxuICogSW5pdCBsb2dpYyBmb3IgYGRlYnVnYCBpbnN0YW5jZXMuXG4gKlxuICogQ3JlYXRlIGEgbmV3IGBpbnNwZWN0T3B0c2Agb2JqZWN0IGluIGNhc2UgYHVzZUNvbG9yc2AgaXMgc2V0XG4gKiBkaWZmZXJlbnRseSBmb3IgYSBwYXJ0aWN1bGFyIGBkZWJ1Z2AgaW5zdGFuY2UuXG4gKi9cblxuZnVuY3Rpb24gaW5pdCAoZGVidWcpIHtcbiAgZGVidWcuaW5zcGVjdE9wdHMgPSB7fTtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV4cG9ydHMuaW5zcGVjdE9wdHMpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBkZWJ1Zy5pbnNwZWN0T3B0c1trZXlzW2ldXSA9IGV4cG9ydHMuaW5zcGVjdE9wdHNba2V5c1tpXV07XG4gIH1cbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYHByb2Nlc3MuZW52LkRFQlVHYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9ub2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvbm9kZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/debug/src/node.js\n");

/***/ }),

/***/ "./node_modules/devtron/api.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {const electron = __webpack_require__(0)\n\nexports.install = () => {\n  if (process.type === 'renderer') {\n    console.log(`Installing Devtron from ${__dirname}`)\n    if (electron.remote.BrowserWindow.getDevToolsExtensions &&\n        electron.remote.BrowserWindow.getDevToolsExtensions().devtron) return true\n    return electron.remote.BrowserWindow.addDevToolsExtension(__dirname)\n  } else if (process.type === 'browser') {\n    console.log(`Installing Devtron from ${__dirname}`)\n    if (electron.BrowserWindow.getDevToolsExtensions &&\n        electron.BrowserWindow.getDevToolsExtensions().devtron) return true\n    return electron.BrowserWindow.addDevToolsExtension(__dirname)\n  } else {\n    throw new Error('Devtron can only be installed from an Electron process.')\n  }\n}\n\nexports.uninstall = () => {\n  if (process.type === 'renderer') {\n    console.log(`Uninstalling Devtron from ${__dirname}`)\n    return electron.remote.BrowserWindow.removeDevToolsExtension('devtron')\n  } else if (process.type === 'browser') {\n    console.log(`Uninstalling Devtron from ${__dirname}`)\n    return electron.BrowserWindow.removeDevToolsExtension('devtron')\n  } else {\n    throw new Error('Devtron can only be uninstalled from an Electron process.')\n  }\n}\n\nexports.path = __dirname\n\n/* WEBPACK VAR INJECTION */}.call(exports, \"node_modules/devtron\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGV2dHJvbi9hcGkuanM/NWUzYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDLFVBQVU7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILDJDQUEyQyxVQUFVO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0EsR0FBRztBQUNILDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9kZXZ0cm9uL2FwaS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuXG5leHBvcnRzLmluc3RhbGwgPSAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICBjb25zb2xlLmxvZyhgSW5zdGFsbGluZyBEZXZ0cm9uIGZyb20gJHtfX2Rpcm5hbWV9YClcbiAgICBpZiAoZWxlY3Ryb24ucmVtb3RlLkJyb3dzZXJXaW5kb3cuZ2V0RGV2VG9vbHNFeHRlbnNpb25zICYmXG4gICAgICAgIGVsZWN0cm9uLnJlbW90ZS5Ccm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucygpLmRldnRyb24pIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGVsZWN0cm9uLnJlbW90ZS5Ccm93c2VyV2luZG93LmFkZERldlRvb2xzRXh0ZW5zaW9uKF9fZGlybmFtZSlcbiAgfSBlbHNlIGlmIChwcm9jZXNzLnR5cGUgPT09ICdicm93c2VyJykge1xuICAgIGNvbnNvbGUubG9nKGBJbnN0YWxsaW5nIERldnRyb24gZnJvbSAke19fZGlybmFtZX1gKVxuICAgIGlmIChlbGVjdHJvbi5Ccm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucyAmJlxuICAgICAgICBlbGVjdHJvbi5Ccm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucygpLmRldnRyb24pIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGVsZWN0cm9uLkJyb3dzZXJXaW5kb3cuYWRkRGV2VG9vbHNFeHRlbnNpb24oX19kaXJuYW1lKVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignRGV2dHJvbiBjYW4gb25seSBiZSBpbnN0YWxsZWQgZnJvbSBhbiBFbGVjdHJvbiBwcm9jZXNzLicpXG4gIH1cbn1cblxuZXhwb3J0cy51bmluc3RhbGwgPSAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICBjb25zb2xlLmxvZyhgVW5pbnN0YWxsaW5nIERldnRyb24gZnJvbSAke19fZGlybmFtZX1gKVxuICAgIHJldHVybiBlbGVjdHJvbi5yZW1vdGUuQnJvd3NlcldpbmRvdy5yZW1vdmVEZXZUb29sc0V4dGVuc2lvbignZGV2dHJvbicpXG4gIH0gZWxzZSBpZiAocHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicpIHtcbiAgICBjb25zb2xlLmxvZyhgVW5pbnN0YWxsaW5nIERldnRyb24gZnJvbSAke19fZGlybmFtZX1gKVxuICAgIHJldHVybiBlbGVjdHJvbi5Ccm93c2VyV2luZG93LnJlbW92ZURldlRvb2xzRXh0ZW5zaW9uKCdkZXZ0cm9uJylcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0RldnRyb24gY2FuIG9ubHkgYmUgdW5pbnN0YWxsZWQgZnJvbSBhbiBFbGVjdHJvbiBwcm9jZXNzLicpXG4gIH1cbn1cblxuZXhwb3J0cy5wYXRoID0gX19kaXJuYW1lXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9kZXZ0cm9uL2FwaS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZGV2dHJvbi9hcGkuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/devtron/api.js\n");

/***/ }),

/***/ "./node_modules/electron-debug/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst electron = __webpack_require__(0);\nconst localShortcut = __webpack_require__(\"./node_modules/electron-localshortcut/index.js\");\nconst isDev = __webpack_require__(\"./node_modules/electron-is-dev/index.js\");\n\nconst app = electron.app;\nconst BrowserWindow = electron.BrowserWindow;\nconst isMacOS = process.platform === 'darwin';\n\nfunction devTools(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.toggleDevTools();\n\t}\n}\n\nfunction openDevTools(win, showDevTools) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\tconst mode = showDevTools === true ? undefined : showDevTools;\n\t\twin.webContents.openDevTools({mode});\n\t}\n}\n\nfunction refresh(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.webContents.reloadIgnoringCache();\n\t}\n}\n\nfunction inspectElements() {\n\tconst win = BrowserWindow.getFocusedWindow();\n\tconst inspect = () => {\n\t\twin.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');\n\t};\n\n\tif (win) {\n\t\tif (win.webContents.isDevToolsOpened()) {\n\t\t\tinspect();\n\t\t} else {\n\t\t\twin.webContents.on('devtools-opened', inspect);\n\t\t\twin.openDevTools();\n\t\t}\n\t}\n}\n\nmodule.exports = opts => {\n\topts = Object.assign({\n\t\tenabled: null,\n\t\tshowDevTools: false\n\t}, opts);\n\n\tif (opts.enabled === false || (opts.enabled === null && !isDev)) {\n\t\treturn;\n\t}\n\n\tapp.on('browser-window-created', (e, win) => {\n\t\tif (opts.showDevTools) {\n\t\t\topenDevTools(win, opts.showDevTools);\n\t\t}\n\t});\n\n\tapp.on('ready', () => {\n\t\t// Activate devtron for the user if they have it installed and it's not already added\n\t\ttry {\n\t\t\tconst devtronAlreadyAdded = BrowserWindow.getDevToolsExtensions &&\n\t\t\t\t{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), 'devtron');\n\n\t\t\tif (!devtronAlreadyAdded) {\n\t\t\t\tBrowserWindow.addDevToolsExtension(__webpack_require__(\"./node_modules/devtron/api.js\").path);\n\t\t\t}\n\t\t} catch (err) {}\n\n\t\tlocalShortcut.register('CmdOrCtrl+Shift+C', inspectElements);\n\t\tlocalShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);\n\t\tlocalShortcut.register('F12', devTools);\n\n\t\tlocalShortcut.register('CmdOrCtrl+R', refresh);\n\t\tlocalShortcut.register('F5', refresh);\n\t});\n};\n\nmodule.exports.refresh = refresh;\nmodule.exports.devTools = devTools;\nmodule.exports.openDevTools = openDevTools;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcvaW5kZXguanM/MTgzMyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQ0FBZ0MsS0FBSztBQUNyQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJyk7XG5jb25zdCBsb2NhbFNob3J0Y3V0ID0gcmVxdWlyZSgnZWxlY3Ryb24tbG9jYWxzaG9ydGN1dCcpO1xuY29uc3QgaXNEZXYgPSByZXF1aXJlKCdlbGVjdHJvbi1pcy1kZXYnKTtcblxuY29uc3QgYXBwID0gZWxlY3Ryb24uYXBwO1xuY29uc3QgQnJvd3NlcldpbmRvdyA9IGVsZWN0cm9uLkJyb3dzZXJXaW5kb3c7XG5jb25zdCBpc01hY09TID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2Rhcndpbic7XG5cbmZ1bmN0aW9uIGRldlRvb2xzKHdpbikge1xuXHR3aW4gPSB3aW4gfHwgQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cblx0aWYgKHdpbikge1xuXHRcdHdpbi50b2dnbGVEZXZUb29scygpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG9wZW5EZXZUb29scyh3aW4sIHNob3dEZXZUb29scykge1xuXHR3aW4gPSB3aW4gfHwgQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cblx0aWYgKHdpbikge1xuXHRcdGNvbnN0IG1vZGUgPSBzaG93RGV2VG9vbHMgPT09IHRydWUgPyB1bmRlZmluZWQgOiBzaG93RGV2VG9vbHM7XG5cdFx0d2luLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scyh7bW9kZX0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlZnJlc2god2luKSB7XG5cdHdpbiA9IHdpbiB8fCBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKTtcblxuXHRpZiAod2luKSB7XG5cdFx0d2luLndlYkNvbnRlbnRzLnJlbG9hZElnbm9yaW5nQ2FjaGUoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBpbnNwZWN0RWxlbWVudHMoKSB7XG5cdGNvbnN0IHdpbiA9IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpO1xuXHRjb25zdCBpbnNwZWN0ID0gKCkgPT4ge1xuXHRcdHdpbi5kZXZUb29sc1dlYkNvbnRlbnRzLmV4ZWN1dGVKYXZhU2NyaXB0KCdEZXZUb29sc0FQSS5lbnRlckluc3BlY3RFbGVtZW50TW9kZSgpJyk7XG5cdH07XG5cblx0aWYgKHdpbikge1xuXHRcdGlmICh3aW4ud2ViQ29udGVudHMuaXNEZXZUb29sc09wZW5lZCgpKSB7XG5cdFx0XHRpbnNwZWN0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbi53ZWJDb250ZW50cy5vbignZGV2dG9vbHMtb3BlbmVkJywgaW5zcGVjdCk7XG5cdFx0XHR3aW4ub3BlbkRldlRvb2xzKCk7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3B0cyA9PiB7XG5cdG9wdHMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRlbmFibGVkOiBudWxsLFxuXHRcdHNob3dEZXZUb29sczogZmFsc2Vcblx0fSwgb3B0cyk7XG5cblx0aWYgKG9wdHMuZW5hYmxlZCA9PT0gZmFsc2UgfHwgKG9wdHMuZW5hYmxlZCA9PT0gbnVsbCAmJiAhaXNEZXYpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YXBwLm9uKCdicm93c2VyLXdpbmRvdy1jcmVhdGVkJywgKGUsIHdpbikgPT4ge1xuXHRcdGlmIChvcHRzLnNob3dEZXZUb29scykge1xuXHRcdFx0b3BlbkRldlRvb2xzKHdpbiwgb3B0cy5zaG93RGV2VG9vbHMpO1xuXHRcdH1cblx0fSk7XG5cblx0YXBwLm9uKCdyZWFkeScsICgpID0+IHtcblx0XHQvLyBBY3RpdmF0ZSBkZXZ0cm9uIGZvciB0aGUgdXNlciBpZiB0aGV5IGhhdmUgaXQgaW5zdGFsbGVkIGFuZCBpdCdzIG5vdCBhbHJlYWR5IGFkZGVkXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGRldnRyb25BbHJlYWR5QWRkZWQgPSBCcm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucyAmJlxuXHRcdFx0XHR7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKEJyb3dzZXJXaW5kb3cuZ2V0RGV2VG9vbHNFeHRlbnNpb25zKCksICdkZXZ0cm9uJyk7XG5cblx0XHRcdGlmICghZGV2dHJvbkFscmVhZHlBZGRlZCkge1xuXHRcdFx0XHRCcm93c2VyV2luZG93LmFkZERldlRvb2xzRXh0ZW5zaW9uKHJlcXVpcmUoJ2RldnRyb24nKS5wYXRoKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnIpIHt9XG5cblx0XHRsb2NhbFNob3J0Y3V0LnJlZ2lzdGVyKCdDbWRPckN0cmwrU2hpZnQrQycsIGluc3BlY3RFbGVtZW50cyk7XG5cdFx0bG9jYWxTaG9ydGN1dC5yZWdpc3Rlcihpc01hY09TID8gJ0NtZCtBbHQrSScgOiAnQ3RybCtTaGlmdCtJJywgZGV2VG9vbHMpO1xuXHRcdGxvY2FsU2hvcnRjdXQucmVnaXN0ZXIoJ0YxMicsIGRldlRvb2xzKTtcblxuXHRcdGxvY2FsU2hvcnRjdXQucmVnaXN0ZXIoJ0NtZE9yQ3RybCtSJywgcmVmcmVzaCk7XG5cdFx0bG9jYWxTaG9ydGN1dC5yZWdpc3RlcignRjUnLCByZWZyZXNoKTtcblx0fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5yZWZyZXNoID0gcmVmcmVzaDtcbm1vZHVsZS5leHBvcnRzLmRldlRvb2xzID0gZGV2VG9vbHM7XG5tb2R1bGUuZXhwb3J0cy5vcGVuRGV2VG9vbHMgPSBvcGVuRGV2VG9vbHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1kZWJ1Zy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tZGVidWcvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-debug/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-accelerator/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)$/;\nconst keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/;\n\nmodule.exports = function (str) {\n\tlet parts = str.split(\"+\");\n\tlet keyFound = false;\n    return parts.every((val, index) => {\n\t\tconst isKey = keyCodes.test(val);\n\t\tconst isModifier = modifiers.test(val);\n\t\tif (isKey) {\n\t\t\t// Key must be unique\n\t\t\tif (keyFound) return false;\n\t\t\tkeyFound = true;\n\t\t}\n\t\t// Key is required\n\t\tif (index === parts.length - 1 && !keyFound) return false;\n        return isKey || isModifier;\n    });\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtYWNjZWxlcmF0b3IvaW5kZXguanM/ODA1MyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBLDZDQUE2QyxFQUFFLEVBQUU7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtYWNjZWxlcmF0b3IvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgbW9kaWZpZXJzID0gL14oQ29tbWFuZHxDbWR8Q29udHJvbHxDdHJsfENvbW1hbmRPckNvbnRyb2x8Q21kT3JDdHJsfEFsdHxPcHRpb258QWx0R3J8U2hpZnR8U3VwZXIpJC87XG5jb25zdCBrZXlDb2RlcyA9IC9eKFswLTlBLVopIUAjJCVeJiooOis8Xz4/fnt8fVwiOz0sXFwtLi9gW1xcXFxcXF0nXXxGMSpbMS05XXxGMTB8RjJbMC00XXxQbHVzfFNwYWNlfFRhYnxCYWNrc3BhY2V8RGVsZXRlfEluc2VydHxSZXR1cm58RW50ZXJ8VXB8RG93bnxMZWZ0fFJpZ2h0fEhvbWV8RW5kfFBhZ2VVcHxQYWdlRG93bnxFc2NhcGV8RXNjfFZvbHVtZVVwfFZvbHVtZURvd258Vm9sdW1lTXV0ZXxNZWRpYU5leHRUcmFja3xNZWRpYVByZXZpb3VzVHJhY2t8TWVkaWFTdG9wfE1lZGlhUGxheVBhdXNlfFByaW50U2NyZWVuKSQvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIpIHtcblx0bGV0IHBhcnRzID0gc3RyLnNwbGl0KFwiK1wiKTtcblx0bGV0IGtleUZvdW5kID0gZmFsc2U7XG4gICAgcmV0dXJuIHBhcnRzLmV2ZXJ5KCh2YWwsIGluZGV4KSA9PiB7XG5cdFx0Y29uc3QgaXNLZXkgPSBrZXlDb2Rlcy50ZXN0KHZhbCk7XG5cdFx0Y29uc3QgaXNNb2RpZmllciA9IG1vZGlmaWVycy50ZXN0KHZhbCk7XG5cdFx0aWYgKGlzS2V5KSB7XG5cdFx0XHQvLyBLZXkgbXVzdCBiZSB1bmlxdWVcblx0XHRcdGlmIChrZXlGb3VuZCkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0a2V5Rm91bmQgPSB0cnVlO1xuXHRcdH1cblx0XHQvLyBLZXkgaXMgcmVxdWlyZWRcblx0XHRpZiAoaW5kZXggPT09IHBhcnRzLmxlbmd0aCAtIDEgJiYgIWtleUZvdW5kKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBpc0tleSB8fCBpc01vZGlmaWVyO1xuICAgIH0pO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWFjY2VsZXJhdG9yL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1pcy1hY2NlbGVyYXRvci9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-is-accelerator/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-dev/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;\nconst isEnvSet = 'ELECTRON_IS_DEV' in process.env;\n\nmodule.exports = isEnvSet ? getFromEnv : (process.defaultApp || /node_modules[\\\\/]electron[\\\\/]/.test(process.execPath));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtZGV2L2luZGV4LmpzPzBlOTciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWRldi9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmNvbnN0IGdldEZyb21FbnYgPSBwYXJzZUludChwcm9jZXNzLmVudi5FTEVDVFJPTl9JU19ERVYsIDEwKSA9PT0gMTtcbmNvbnN0IGlzRW52U2V0ID0gJ0VMRUNUUk9OX0lTX0RFVicgaW4gcHJvY2Vzcy5lbnY7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbnZTZXQgPyBnZXRGcm9tRW52IDogKHByb2Nlc3MuZGVmYXVsdEFwcCB8fCAvbm9kZV9tb2R1bGVzW1xcXFwvXWVsZWN0cm9uW1xcXFwvXS8udGVzdChwcm9jZXNzLmV4ZWNQYXRoKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1pcy1kZXYvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWRldi9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-is-dev/index.js\n");

/***/ }),

/***/ "./node_modules/electron-localshortcut/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst {globalShortcut, BrowserWindow, app} = __webpack_require__(0);\nconst isAccelerator = __webpack_require__(\"./node_modules/electron-is-accelerator/index.js\");\nconst _debug = __webpack_require__(\"./node_modules/debug/src/index.js\");\n\nconst debug = _debug('electron-localshortcut');\nconst windowsWithShortcuts = new WeakMap();\n\n// A placeholder to register shortcuts\n// on any window of the app.\nconst ANY_WINDOW = {};\n\nlet _enableShortcut = shortcut => {\n\tdebug(`Calling globalShortcut.register(${shortcut.accelerator}, ${shortcut.callback.name})`);\n\tglobalShortcut.register(shortcut.accelerator, shortcut.callback);\n\tshortcut.registered = true;\n};\n\nlet _disableShortcut = shortcut => {\n\tdebug(`Calling globalShortcut.unregister(${shortcut.accelerator})`);\n\tglobalShortcut.unregister(shortcut.accelerator);\n\tshortcut.registered = false;\n};\n\nfunction __mockup(enableShortcut, disableShortcut) {\n\t_enableShortcut = enableShortcut;\n\t_disableShortcut = disableShortcut;\n}\n\nfunction _enableWindowAndApp(win) {\n\tdebug(`_enableWindowAndApp ${win.getTitle && win.getTitle()}`);\n\tif (windowsWithShortcuts.has(ANY_WINDOW)) {\n\t\tenableAll(ANY_WINDOW);\n\t}\n\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn;\n\t}\n\n\tenableAll(win);\n}\n\nfunction _disableWindowAndApp(win) {\n\tdebug(`_disableWindowAndApp ${win.getTitle && win.getTitle()}`);\n\tif (windowsWithShortcuts.has(ANY_WINDOW)) {\n\t\tdisableAll(ANY_WINDOW);\n\t}\n\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn;\n\t}\n\n\tdisableAll(win);\n}\n\nfunction _indexOfShortcut(win, accelerator) {\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn -1;\n\t}\n\t_checkAccelerator(accelerator);\n\n\tconst shortcuts = windowsWithShortcuts.get(win);\n\tlet shortcutToUnregisterIdx = -1;\n\tshortcuts.some((s, idx) => {\n\t\tif (s.accelerator === accelerator) {\n\t\t\tshortcutToUnregisterIdx = idx;\n\t\t\treturn true;\n\t\t}\n\t\treturn false;\n\t});\n\treturn shortcutToUnregisterIdx;\n}\n\nfunction _checkAccelerator(accelerator) {\n\tif (!isAccelerator(accelerator)) {\n\t\tconst w = {};\n\t\tError.captureStackTrace(w);\n\t\tconst msg = `\nWARNING: ${accelerator} is not a valid accelerator.\n\n${w.stack.split('\\n').slice(4).join('\\n')}\n`;\n\t\tconsole.error(msg);\n\t}\n}\n\n/**\n * Disable all of the shortcuts registered on the BrowserWindow instance.\nRegistered shortcuts no more works on the `window` instance, but the module keep a reference on them. You can reactivate them later by calling `enableAll` method on the same window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction disableAll(win) {\n\tconst shortcuts = windowsWithShortcuts.get(win);\n\tif (shortcuts) {\n\t\tshortcuts.forEach(_disableShortcut);\n\t}\n}\n\n/**\n * Enable all of the shortcuts registered on the BrowserWindow instance that you had previously disabled calling `disableAll` method.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction enableAll(win) {\n\tconst shortcuts = windowsWithShortcuts.get(win);\n\tif (shortcuts) {\n\t\tshortcuts.forEach(_enableShortcut);\n\t}\n}\n\n/**\n * Unregisters all of the shortcuts registered on any focused BrowserWindow instance. This method does not unregister any shortcut you registered on a particular window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction unregisterAll(win) {\n\tif (win === undefined) {\n\t\t// Unregister shortcuts for any window in the app\n\t\tunregisterAll(ANY_WINDOW);\n\t\treturn;\n\t}\n\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn;\n\t}\n\n\tdisableAll(win);\n\twindowsWithShortcuts.delete(win);\n}\n\n/**\n* Registers the shortcut `accelerator`on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to register. This argument could be omitted, in this case the function register the shortcut on all app windows.\n * @param  {String} accelerator - the shortcut to register\n * @param  {Function} callback    This function is called when the shortcut is pressed and the window is focused and not minimized.\n * @return {Undefined}\n */\nfunction register(win, accelerator, callback) {\n\tif (arguments.length === 2 && typeof win === 'string') {\n\t\t// Register shortcut for any window in the app\n\t\t// win = accelerator, accelerator = callback\n\t\tregister(ANY_WINDOW, win, accelerator);\n\t\treturn;\n\t}\n\n\t_checkAccelerator(accelerator);\n\n\tconst newShortcut = {accelerator, callback, registered: false};\n\n\tconst _unregister = because => () => {\n\t\tdebug(`Disabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t\t_disableWindowAndApp(win);\n\t};\n\n\tconst _register = because => () => {\n\t\tdebug(`Enabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t\t_enableWindowAndApp(win);\n\t};\n\n\tif (windowsWithShortcuts.has(win)) {\n\t\tconst shortcuts = windowsWithShortcuts.get(win);\n\t\tshortcuts.push(newShortcut);\n\t} else {\n\t\twindowsWithShortcuts.set(win, [newShortcut]);\n\n\t\tif (win !== ANY_WINDOW) {\n\t\t\twin.on('close', _unregister('the window was closed.'));\n\n\t\t\twin.on('hide', _unregister('the window was hidden.'));\n\n\t\t\twin.on('minimize', _unregister('the window was minimized.'));\n\n\t\t\twin.on('restore', _register('the window was restored from minimized state.'));\n\n\t\t\twin.on('show', _register('the window was showed.'));\n\t\t}\n\t}\n\n\tconst focusedWin = BrowserWindow.getFocusedWindow();\n\tconst registeringAppShortcut = win === ANY_WINDOW;\n\tconst appHasFocus = focusedWin !== null && focusedWin.isVisible();\n\tconst registeringWindowHasFocus = focusedWin === win;\n\tconst registeringWindowIsMinimized = () => focusedWin.isMinimized();\n\n\tif ((registeringAppShortcut && appHasFocus) ||\n\t\t(registeringWindowHasFocus && !registeringWindowIsMinimized())) {\n\t\t_register('the window was focused at shortcut registration.');\n\t}\n}\n\n/**\n * Unregisters the shortcut of `accelerator` registered on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to unregister. This argument could be omitted, in this case the function unregister the shortcut on all app windows. If you registered the shortcut on a particular window instance, it will do nothing.\n * @param  {String} accelerator - the shortcut to unregister\n * @return {Undefined}\n */\nfunction unregister(win, accelerator) {\n\tif (arguments.length === 1 && typeof win === 'string') {\n\t\t// Unregister shortcut for any window in the app\n\t\t// win === accelerator\n\t\tunregister(ANY_WINDOW, win);\n\t\treturn;\n\t}\n\n\t_checkAccelerator(accelerator);\n\n\tconst shortcutToUnregisterIdx = _indexOfShortcut(win, accelerator);\n\n\tif (shortcutToUnregisterIdx !== -1) {\n\t\t_disableShortcut(accelerator);\n\t\tconst shortcuts = windowsWithShortcuts.get(win);\n\t\tshortcuts.splice(shortcutToUnregisterIdx, 1);\n\t}\n}\n\n/**\n * Returns `true` or `false` depending on whether the shortcut `accelerator` is\nregistered on `window`.\n * @param  {BrowserWindow} win - BrowserWindow instance to check. This argument could be omitted, in this case the function returns whether the shortcut `accelerator` is registered on all app windows. If you registered the shortcut on a particular window instance, it return false.\n * @param  {String} accelerator - the shortcut to check\n * @return {Boolean} - if the shortcut `accelerator` is registered on `window`.\n */\nfunction isRegistered(win, accelerator) {\n\tif (arguments.length === 1 && typeof win === 'string') {\n\t\t// Check shortcut for any window in the app\n\t\t// win = accelerator\n\t\treturn isRegistered(ANY_WINDOW, win);\n\t}\n\n\t_checkAccelerator(accelerator);\n\n\treturn _indexOfShortcut(win, accelerator) !== -1;\n}\n\nconst windowBlur = because => (_, win) => {\n\tdebug(`Disabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t_disableWindowAndApp(win);\n};\n\nconst windowFocus = because => (_, win) => {\n\tdebug(`Enabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t_enableWindowAndApp(win);\n};\n\napp.on('browser-window-focus', windowFocus('the window gained focus'));\napp.on('browser-window-blur', windowBlur('the window loose focus'));\n\n// All shortcuts should be unregistered by closing the window.\n// just for double check\napp.on('window-all-closed', unregisterAll);\n\nmodule.exports = {\n\tregister,\n\tunregister,\n\tisRegistered,\n\tunregisterAll,\n\tenableAll,\n\tdisableAll,\n\t__mockup\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9jYWxzaG9ydGN1dC9pbmRleC5qcz9lMTcwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsT0FBTyxtQ0FBbUM7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQyxxQkFBcUIsSUFBSSx1QkFBdUI7QUFDMUY7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDLHFCQUFxQjtBQUNqRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsK0JBQStCO0FBQzdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLCtCQUErQiwrQkFBK0I7QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFlBQVk7O0FBRXZCLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksY0FBYztBQUMxQixZQUFZLE9BQU87QUFDbkIsWUFBWSxTQUFTO0FBQ3JCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNCQUFzQjs7QUFFdEI7QUFDQSx1REFBdUQsOENBQThDLFlBQVksUUFBUTtBQUN6SDtBQUNBOztBQUVBO0FBQ0Esc0RBQXNELDhDQUE4QyxZQUFZLFFBQVE7QUFDeEg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWSxPQUFPO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0RBQXNELDhDQUE4QyxZQUFZLFFBQVE7QUFDeEg7QUFDQTs7QUFFQTtBQUNBLHFEQUFxRCw4Q0FBOEMsWUFBWSxRQUFRO0FBQ3ZIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5jb25zdCB7Z2xvYmFsU2hvcnRjdXQsIEJyb3dzZXJXaW5kb3csIGFwcH0gPSByZXF1aXJlKCdlbGVjdHJvbicpO1xuY29uc3QgaXNBY2NlbGVyYXRvciA9IHJlcXVpcmUoJ2VsZWN0cm9uLWlzLWFjY2VsZXJhdG9yJyk7XG5jb25zdCBfZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpO1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1ZygnZWxlY3Ryb24tbG9jYWxzaG9ydGN1dCcpO1xuY29uc3Qgd2luZG93c1dpdGhTaG9ydGN1dHMgPSBuZXcgV2Vha01hcCgpO1xuXG4vLyBBIHBsYWNlaG9sZGVyIHRvIHJlZ2lzdGVyIHNob3J0Y3V0c1xuLy8gb24gYW55IHdpbmRvdyBvZiB0aGUgYXBwLlxuY29uc3QgQU5ZX1dJTkRPVyA9IHt9O1xuXG5sZXQgX2VuYWJsZVNob3J0Y3V0ID0gc2hvcnRjdXQgPT4ge1xuXHRkZWJ1ZyhgQ2FsbGluZyBnbG9iYWxTaG9ydGN1dC5yZWdpc3Rlcigke3Nob3J0Y3V0LmFjY2VsZXJhdG9yfSwgJHtzaG9ydGN1dC5jYWxsYmFjay5uYW1lfSlgKTtcblx0Z2xvYmFsU2hvcnRjdXQucmVnaXN0ZXIoc2hvcnRjdXQuYWNjZWxlcmF0b3IsIHNob3J0Y3V0LmNhbGxiYWNrKTtcblx0c2hvcnRjdXQucmVnaXN0ZXJlZCA9IHRydWU7XG59O1xuXG5sZXQgX2Rpc2FibGVTaG9ydGN1dCA9IHNob3J0Y3V0ID0+IHtcblx0ZGVidWcoYENhbGxpbmcgZ2xvYmFsU2hvcnRjdXQudW5yZWdpc3Rlcigke3Nob3J0Y3V0LmFjY2VsZXJhdG9yfSlgKTtcblx0Z2xvYmFsU2hvcnRjdXQudW5yZWdpc3RlcihzaG9ydGN1dC5hY2NlbGVyYXRvcik7XG5cdHNob3J0Y3V0LnJlZ2lzdGVyZWQgPSBmYWxzZTtcbn07XG5cbmZ1bmN0aW9uIF9fbW9ja3VwKGVuYWJsZVNob3J0Y3V0LCBkaXNhYmxlU2hvcnRjdXQpIHtcblx0X2VuYWJsZVNob3J0Y3V0ID0gZW5hYmxlU2hvcnRjdXQ7XG5cdF9kaXNhYmxlU2hvcnRjdXQgPSBkaXNhYmxlU2hvcnRjdXQ7XG59XG5cbmZ1bmN0aW9uIF9lbmFibGVXaW5kb3dBbmRBcHAod2luKSB7XG5cdGRlYnVnKGBfZW5hYmxlV2luZG93QW5kQXBwICR7d2luLmdldFRpdGxlICYmIHdpbi5nZXRUaXRsZSgpfWApO1xuXHRpZiAod2luZG93c1dpdGhTaG9ydGN1dHMuaGFzKEFOWV9XSU5ET1cpKSB7XG5cdFx0ZW5hYmxlQWxsKEFOWV9XSU5ET1cpO1xuXHR9XG5cblx0aWYgKCF3aW5kb3dzV2l0aFNob3J0Y3V0cy5oYXMod2luKSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGVuYWJsZUFsbCh3aW4pO1xufVxuXG5mdW5jdGlvbiBfZGlzYWJsZVdpbmRvd0FuZEFwcCh3aW4pIHtcblx0ZGVidWcoYF9kaXNhYmxlV2luZG93QW5kQXBwICR7d2luLmdldFRpdGxlICYmIHdpbi5nZXRUaXRsZSgpfWApO1xuXHRpZiAod2luZG93c1dpdGhTaG9ydGN1dHMuaGFzKEFOWV9XSU5ET1cpKSB7XG5cdFx0ZGlzYWJsZUFsbChBTllfV0lORE9XKTtcblx0fVxuXG5cdGlmICghd2luZG93c1dpdGhTaG9ydGN1dHMuaGFzKHdpbikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRkaXNhYmxlQWxsKHdpbik7XG59XG5cbmZ1bmN0aW9uIF9pbmRleE9mU2hvcnRjdXQod2luLCBhY2NlbGVyYXRvcikge1xuXHRpZiAoIXdpbmRvd3NXaXRoU2hvcnRjdXRzLmhhcyh3aW4pKSB7XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdF9jaGVja0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKTtcblxuXHRjb25zdCBzaG9ydGN1dHMgPSB3aW5kb3dzV2l0aFNob3J0Y3V0cy5nZXQod2luKTtcblx0bGV0IHNob3J0Y3V0VG9VbnJlZ2lzdGVySWR4ID0gLTE7XG5cdHNob3J0Y3V0cy5zb21lKChzLCBpZHgpID0+IHtcblx0XHRpZiAocy5hY2NlbGVyYXRvciA9PT0gYWNjZWxlcmF0b3IpIHtcblx0XHRcdHNob3J0Y3V0VG9VbnJlZ2lzdGVySWR4ID0gaWR4O1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSk7XG5cdHJldHVybiBzaG9ydGN1dFRvVW5yZWdpc3RlcklkeDtcbn1cblxuZnVuY3Rpb24gX2NoZWNrQWNjZWxlcmF0b3IoYWNjZWxlcmF0b3IpIHtcblx0aWYgKCFpc0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKSkge1xuXHRcdGNvbnN0IHcgPSB7fTtcblx0XHRFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh3KTtcblx0XHRjb25zdCBtc2cgPSBgXG5XQVJOSU5HOiAke2FjY2VsZXJhdG9yfSBpcyBub3QgYSB2YWxpZCBhY2NlbGVyYXRvci5cblxuJHt3LnN0YWNrLnNwbGl0KCdcXG4nKS5zbGljZSg0KS5qb2luKCdcXG4nKX1cbmA7XG5cdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHR9XG59XG5cbi8qKlxuICogRGlzYWJsZSBhbGwgb2YgdGhlIHNob3J0Y3V0cyByZWdpc3RlcmVkIG9uIHRoZSBCcm93c2VyV2luZG93IGluc3RhbmNlLlxuUmVnaXN0ZXJlZCBzaG9ydGN1dHMgbm8gbW9yZSB3b3JrcyBvbiB0aGUgYHdpbmRvd2AgaW5zdGFuY2UsIGJ1dCB0aGUgbW9kdWxlIGtlZXAgYSByZWZlcmVuY2Ugb24gdGhlbS4gWW91IGNhbiByZWFjdGl2YXRlIHRoZW0gbGF0ZXIgYnkgY2FsbGluZyBgZW5hYmxlQWxsYCBtZXRob2Qgb24gdGhlIHNhbWUgd2luZG93IGluc3RhbmNlLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2VcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gZGlzYWJsZUFsbCh3aW4pIHtcblx0Y29uc3Qgc2hvcnRjdXRzID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdpbik7XG5cdGlmIChzaG9ydGN1dHMpIHtcblx0XHRzaG9ydGN1dHMuZm9yRWFjaChfZGlzYWJsZVNob3J0Y3V0KTtcblx0fVxufVxuXG4vKipcbiAqIEVuYWJsZSBhbGwgb2YgdGhlIHNob3J0Y3V0cyByZWdpc3RlcmVkIG9uIHRoZSBCcm93c2VyV2luZG93IGluc3RhbmNlIHRoYXQgeW91IGhhZCBwcmV2aW91c2x5IGRpc2FibGVkIGNhbGxpbmcgYGRpc2FibGVBbGxgIG1ldGhvZC5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiBCcm93c2VyV2luZG93IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGVuYWJsZUFsbCh3aW4pIHtcblx0Y29uc3Qgc2hvcnRjdXRzID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdpbik7XG5cdGlmIChzaG9ydGN1dHMpIHtcblx0XHRzaG9ydGN1dHMuZm9yRWFjaChfZW5hYmxlU2hvcnRjdXQpO1xuXHR9XG59XG5cbi8qKlxuICogVW5yZWdpc3RlcnMgYWxsIG9mIHRoZSBzaG9ydGN1dHMgcmVnaXN0ZXJlZCBvbiBhbnkgZm9jdXNlZCBCcm93c2VyV2luZG93IGluc3RhbmNlLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCB1bnJlZ2lzdGVyIGFueSBzaG9ydGN1dCB5b3UgcmVnaXN0ZXJlZCBvbiBhIHBhcnRpY3VsYXIgd2luZG93IGluc3RhbmNlLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2VcbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gdW5yZWdpc3RlckFsbCh3aW4pIHtcblx0aWYgKHdpbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Ly8gVW5yZWdpc3RlciBzaG9ydGN1dHMgZm9yIGFueSB3aW5kb3cgaW4gdGhlIGFwcFxuXHRcdHVucmVnaXN0ZXJBbGwoQU5ZX1dJTkRPVyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCF3aW5kb3dzV2l0aFNob3J0Y3V0cy5oYXMod2luKSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGRpc2FibGVBbGwod2luKTtcblx0d2luZG93c1dpdGhTaG9ydGN1dHMuZGVsZXRlKHdpbik7XG59XG5cbi8qKlxuKiBSZWdpc3RlcnMgdGhlIHNob3J0Y3V0IGBhY2NlbGVyYXRvcmBvbiB0aGUgQnJvd3NlcldpbmRvdyBpbnN0YW5jZS5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiAtIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2UgdG8gcmVnaXN0ZXIuIFRoaXMgYXJndW1lbnQgY291bGQgYmUgb21pdHRlZCwgaW4gdGhpcyBjYXNlIHRoZSBmdW5jdGlvbiByZWdpc3RlciB0aGUgc2hvcnRjdXQgb24gYWxsIGFwcCB3aW5kb3dzLlxuICogQHBhcmFtICB7U3RyaW5nfSBhY2NlbGVyYXRvciAtIHRoZSBzaG9ydGN1dCB0byByZWdpc3RlclxuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrICAgIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIHNob3J0Y3V0IGlzIHByZXNzZWQgYW5kIHRoZSB3aW5kb3cgaXMgZm9jdXNlZCBhbmQgbm90IG1pbmltaXplZC5cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXIod2luLCBhY2NlbGVyYXRvciwgY2FsbGJhY2spIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdHlwZW9mIHdpbiA9PT0gJ3N0cmluZycpIHtcblx0XHQvLyBSZWdpc3RlciBzaG9ydGN1dCBmb3IgYW55IHdpbmRvdyBpbiB0aGUgYXBwXG5cdFx0Ly8gd2luID0gYWNjZWxlcmF0b3IsIGFjY2VsZXJhdG9yID0gY2FsbGJhY2tcblx0XHRyZWdpc3RlcihBTllfV0lORE9XLCB3aW4sIGFjY2VsZXJhdG9yKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRfY2hlY2tBY2NlbGVyYXRvcihhY2NlbGVyYXRvcik7XG5cblx0Y29uc3QgbmV3U2hvcnRjdXQgPSB7YWNjZWxlcmF0b3IsIGNhbGxiYWNrLCByZWdpc3RlcmVkOiBmYWxzZX07XG5cblx0Y29uc3QgX3VucmVnaXN0ZXIgPSBiZWNhdXNlID0+ICgpID0+IHtcblx0XHRkZWJ1ZyhgRGlzYWJsaW5nIHNob3J0Y3V0cyBmb3IgYXBwIGFuZCBmb3Igd2luZG93ICckeyh3aW4uZ2V0VGl0bGUgJiYgd2luLmdldFRpdGxlKCkpIHx8ICdObyBuYW1lJ30nIGJlY2F1c2UgJHtiZWNhdXNlfS5gKTtcblx0XHRfZGlzYWJsZVdpbmRvd0FuZEFwcCh3aW4pO1xuXHR9O1xuXG5cdGNvbnN0IF9yZWdpc3RlciA9IGJlY2F1c2UgPT4gKCkgPT4ge1xuXHRcdGRlYnVnKGBFbmFibGluZyBzaG9ydGN1dHMgZm9yIGFwcCBhbmQgZm9yIHdpbmRvdyAnJHsod2luLmdldFRpdGxlICYmIHdpbi5nZXRUaXRsZSgpKSB8fCAnTm8gbmFtZSd9JyBiZWNhdXNlICR7YmVjYXVzZX0uYCk7XG5cdFx0X2VuYWJsZVdpbmRvd0FuZEFwcCh3aW4pO1xuXHR9O1xuXG5cdGlmICh3aW5kb3dzV2l0aFNob3J0Y3V0cy5oYXMod2luKSkge1xuXHRcdGNvbnN0IHNob3J0Y3V0cyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3aW4pO1xuXHRcdHNob3J0Y3V0cy5wdXNoKG5ld1Nob3J0Y3V0KTtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3dzV2l0aFNob3J0Y3V0cy5zZXQod2luLCBbbmV3U2hvcnRjdXRdKTtcblxuXHRcdGlmICh3aW4gIT09IEFOWV9XSU5ET1cpIHtcblx0XHRcdHdpbi5vbignY2xvc2UnLCBfdW5yZWdpc3RlcigndGhlIHdpbmRvdyB3YXMgY2xvc2VkLicpKTtcblxuXHRcdFx0d2luLm9uKCdoaWRlJywgX3VucmVnaXN0ZXIoJ3RoZSB3aW5kb3cgd2FzIGhpZGRlbi4nKSk7XG5cblx0XHRcdHdpbi5vbignbWluaW1pemUnLCBfdW5yZWdpc3RlcigndGhlIHdpbmRvdyB3YXMgbWluaW1pemVkLicpKTtcblxuXHRcdFx0d2luLm9uKCdyZXN0b3JlJywgX3JlZ2lzdGVyKCd0aGUgd2luZG93IHdhcyByZXN0b3JlZCBmcm9tIG1pbmltaXplZCBzdGF0ZS4nKSk7XG5cblx0XHRcdHdpbi5vbignc2hvdycsIF9yZWdpc3RlcigndGhlIHdpbmRvdyB3YXMgc2hvd2VkLicpKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBmb2N1c2VkV2luID0gQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cdGNvbnN0IHJlZ2lzdGVyaW5nQXBwU2hvcnRjdXQgPSB3aW4gPT09IEFOWV9XSU5ET1c7XG5cdGNvbnN0IGFwcEhhc0ZvY3VzID0gZm9jdXNlZFdpbiAhPT0gbnVsbCAmJiBmb2N1c2VkV2luLmlzVmlzaWJsZSgpO1xuXHRjb25zdCByZWdpc3RlcmluZ1dpbmRvd0hhc0ZvY3VzID0gZm9jdXNlZFdpbiA9PT0gd2luO1xuXHRjb25zdCByZWdpc3RlcmluZ1dpbmRvd0lzTWluaW1pemVkID0gKCkgPT4gZm9jdXNlZFdpbi5pc01pbmltaXplZCgpO1xuXG5cdGlmICgocmVnaXN0ZXJpbmdBcHBTaG9ydGN1dCAmJiBhcHBIYXNGb2N1cykgfHxcblx0XHQocmVnaXN0ZXJpbmdXaW5kb3dIYXNGb2N1cyAmJiAhcmVnaXN0ZXJpbmdXaW5kb3dJc01pbmltaXplZCgpKSkge1xuXHRcdF9yZWdpc3RlcigndGhlIHdpbmRvdyB3YXMgZm9jdXNlZCBhdCBzaG9ydGN1dCByZWdpc3RyYXRpb24uJyk7XG5cdH1cbn1cblxuLyoqXG4gKiBVbnJlZ2lzdGVycyB0aGUgc2hvcnRjdXQgb2YgYGFjY2VsZXJhdG9yYCByZWdpc3RlcmVkIG9uIHRoZSBCcm93c2VyV2luZG93IGluc3RhbmNlLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIC0gQnJvd3NlcldpbmRvdyBpbnN0YW5jZSB0byB1bnJlZ2lzdGVyLiBUaGlzIGFyZ3VtZW50IGNvdWxkIGJlIG9taXR0ZWQsIGluIHRoaXMgY2FzZSB0aGUgZnVuY3Rpb24gdW5yZWdpc3RlciB0aGUgc2hvcnRjdXQgb24gYWxsIGFwcCB3aW5kb3dzLiBJZiB5b3UgcmVnaXN0ZXJlZCB0aGUgc2hvcnRjdXQgb24gYSBwYXJ0aWN1bGFyIHdpbmRvdyBpbnN0YW5jZSwgaXQgd2lsbCBkbyBub3RoaW5nLlxuICogQHBhcmFtICB7U3RyaW5nfSBhY2NlbGVyYXRvciAtIHRoZSBzaG9ydGN1dCB0byB1bnJlZ2lzdGVyXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIHVucmVnaXN0ZXIod2luLCBhY2NlbGVyYXRvcikge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2Ygd2luID09PSAnc3RyaW5nJykge1xuXHRcdC8vIFVucmVnaXN0ZXIgc2hvcnRjdXQgZm9yIGFueSB3aW5kb3cgaW4gdGhlIGFwcFxuXHRcdC8vIHdpbiA9PT0gYWNjZWxlcmF0b3Jcblx0XHR1bnJlZ2lzdGVyKEFOWV9XSU5ET1csIHdpbik7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0X2NoZWNrQWNjZWxlcmF0b3IoYWNjZWxlcmF0b3IpO1xuXG5cdGNvbnN0IHNob3J0Y3V0VG9VbnJlZ2lzdGVySWR4ID0gX2luZGV4T2ZTaG9ydGN1dCh3aW4sIGFjY2VsZXJhdG9yKTtcblxuXHRpZiAoc2hvcnRjdXRUb1VucmVnaXN0ZXJJZHggIT09IC0xKSB7XG5cdFx0X2Rpc2FibGVTaG9ydGN1dChhY2NlbGVyYXRvcik7XG5cdFx0Y29uc3Qgc2hvcnRjdXRzID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdpbik7XG5cdFx0c2hvcnRjdXRzLnNwbGljZShzaG9ydGN1dFRvVW5yZWdpc3RlcklkeCwgMSk7XG5cdH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBvciBgZmFsc2VgIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBzaG9ydGN1dCBgYWNjZWxlcmF0b3JgIGlzXG5yZWdpc3RlcmVkIG9uIGB3aW5kb3dgLlxuICogQHBhcmFtICB7QnJvd3NlcldpbmRvd30gd2luIC0gQnJvd3NlcldpbmRvdyBpbnN0YW5jZSB0byBjaGVjay4gVGhpcyBhcmd1bWVudCBjb3VsZCBiZSBvbWl0dGVkLCBpbiB0aGlzIGNhc2UgdGhlIGZ1bmN0aW9uIHJldHVybnMgd2hldGhlciB0aGUgc2hvcnRjdXQgYGFjY2VsZXJhdG9yYCBpcyByZWdpc3RlcmVkIG9uIGFsbCBhcHAgd2luZG93cy4gSWYgeW91IHJlZ2lzdGVyZWQgdGhlIHNob3J0Y3V0IG9uIGEgcGFydGljdWxhciB3aW5kb3cgaW5zdGFuY2UsIGl0IHJldHVybiBmYWxzZS5cbiAqIEBwYXJhbSAge1N0cmluZ30gYWNjZWxlcmF0b3IgLSB0aGUgc2hvcnRjdXQgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59IC0gaWYgdGhlIHNob3J0Y3V0IGBhY2NlbGVyYXRvcmAgaXMgcmVnaXN0ZXJlZCBvbiBgd2luZG93YC5cbiAqL1xuZnVuY3Rpb24gaXNSZWdpc3RlcmVkKHdpbiwgYWNjZWxlcmF0b3IpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHdpbiA9PT0gJ3N0cmluZycpIHtcblx0XHQvLyBDaGVjayBzaG9ydGN1dCBmb3IgYW55IHdpbmRvdyBpbiB0aGUgYXBwXG5cdFx0Ly8gd2luID0gYWNjZWxlcmF0b3Jcblx0XHRyZXR1cm4gaXNSZWdpc3RlcmVkKEFOWV9XSU5ET1csIHdpbik7XG5cdH1cblxuXHRfY2hlY2tBY2NlbGVyYXRvcihhY2NlbGVyYXRvcik7XG5cblx0cmV0dXJuIF9pbmRleE9mU2hvcnRjdXQod2luLCBhY2NlbGVyYXRvcikgIT09IC0xO1xufVxuXG5jb25zdCB3aW5kb3dCbHVyID0gYmVjYXVzZSA9PiAoXywgd2luKSA9PiB7XG5cdGRlYnVnKGBEaXNhYmxpbmcgc2hvcnRjdXRzIGZvciBhcHAgYW5kIGZvciB3aW5kb3cgJyR7KHdpbi5nZXRUaXRsZSAmJiB3aW4uZ2V0VGl0bGUoKSkgfHwgJ05vIG5hbWUnfScgYmVjYXVzZSAke2JlY2F1c2V9LmApO1xuXHRfZGlzYWJsZVdpbmRvd0FuZEFwcCh3aW4pO1xufTtcblxuY29uc3Qgd2luZG93Rm9jdXMgPSBiZWNhdXNlID0+IChfLCB3aW4pID0+IHtcblx0ZGVidWcoYEVuYWJsaW5nIHNob3J0Y3V0cyBmb3IgYXBwIGFuZCBmb3Igd2luZG93ICckeyh3aW4uZ2V0VGl0bGUgJiYgd2luLmdldFRpdGxlKCkpIHx8ICdObyBuYW1lJ30nIGJlY2F1c2UgJHtiZWNhdXNlfS5gKTtcblx0X2VuYWJsZVdpbmRvd0FuZEFwcCh3aW4pO1xufTtcblxuYXBwLm9uKCdicm93c2VyLXdpbmRvdy1mb2N1cycsIHdpbmRvd0ZvY3VzKCd0aGUgd2luZG93IGdhaW5lZCBmb2N1cycpKTtcbmFwcC5vbignYnJvd3Nlci13aW5kb3ctYmx1cicsIHdpbmRvd0JsdXIoJ3RoZSB3aW5kb3cgbG9vc2UgZm9jdXMnKSk7XG5cbi8vIEFsbCBzaG9ydGN1dHMgc2hvdWxkIGJlIHVucmVnaXN0ZXJlZCBieSBjbG9zaW5nIHRoZSB3aW5kb3cuXG4vLyBqdXN0IGZvciBkb3VibGUgY2hlY2tcbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCB1bnJlZ2lzdGVyQWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHJlZ2lzdGVyLFxuXHR1bnJlZ2lzdGVyLFxuXHRpc1JlZ2lzdGVyZWQsXG5cdHVucmVnaXN0ZXJBbGwsXG5cdGVuYWJsZUFsbCxcblx0ZGlzYWJsZUFsbCxcblx0X19tb2NrdXBcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2NhbHNob3J0Y3V0L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2NhbHNob3J0Y3V0L2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-localshortcut/index.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/electron-main-hmr/main-hmr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(2).install();\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\nif (socketPath == null) {\n    throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n}\n// module, but not relative path must be used (because this file is used as entry)\nconst HmrClient = __webpack_require__(3).HmrClient;\n// tslint:disable:no-unused-expression\nnew HmrClient(socketPath, module.hot, () => {\n    return __webpack_require__.h();\n});\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9lbGVjdHJvbi1tYWluLWhtci9tYWluLWhtci5qcz84YzE0Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZShcInNvdXJjZS1tYXAtc3VwcG9ydC9zb3VyY2UtbWFwLXN1cHBvcnQuanNcIikuaW5zdGFsbCgpO1xuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcbmlmIChzb2NrZXRQYXRoID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufVxuLy8gbW9kdWxlLCBidXQgbm90IHJlbGF0aXZlIHBhdGggbXVzdCBiZSB1c2VkIChiZWNhdXNlIHRoaXMgZmlsZSBpcyB1c2VkIGFzIGVudHJ5KVxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svZWxlY3Ryb24tbWFpbi1obXIvSG1yQ2xpZW50XCIpLkhtckNsaWVudDtcbi8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5uZXcgSG1yQ2xpZW50KHNvY2tldFBhdGgsIG1vZHVsZS5ob3QsICgpID0+IHtcbiAgICByZXR1cm4gX193ZWJwYWNrX2hhc2hfXztcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9lbGVjdHJvbi1tYWluLWhtci9tYWluLWhtci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9lbGVjdHJvbi1tYWluLWhtci9tYWluLWhtci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./node_modules/ms/index.js":
/***/ (function(module, exports) {

eval("/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} [options]\n * @throws {Error} throw an error if val is not a non-empty string or a number\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options) {\n  options = options || {};\n  var type = typeof val;\n  if (type === 'string' && val.length > 0) {\n    return parse(val);\n  } else if (type === 'number' && isNaN(val) === false) {\n    return options.long ? fmtLong(val) : fmtShort(val);\n  }\n  throw new Error(\n    'val is not a non-empty string or a valid number. val=' +\n      JSON.stringify(val)\n  );\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  str = String(str);\n  if (str.length > 100) {\n    return;\n  }\n  var match = /^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(\n    str\n  );\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'yrs':\n    case 'yr':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'hrs':\n    case 'hr':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'mins':\n    case 'min':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 'secs':\n    case 'sec':\n    case 's':\n      return n * s;\n    case 'milliseconds':\n    case 'millisecond':\n    case 'msecs':\n    case 'msec':\n    case 'ms':\n      return n;\n    default:\n      return undefined;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtShort(ms) {\n  if (ms >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (ms >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (ms >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (ms >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtLong(ms) {\n  return plural(ms, d, 'day') ||\n    plural(ms, h, 'hour') ||\n    plural(ms, m, 'minute') ||\n    plural(ms, s, 'second') ||\n    ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, n, name) {\n  if (ms < n) {\n    return;\n  }\n  if (ms < n * 1.5) {\n    return Math.floor(ms / n) + ' ' + name;\n  }\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanM/MTFhYSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6QixXQUFXLE9BQU87QUFDbEIsWUFBWSxNQUFNO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc05hTih2YWwpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBvcHRpb25zLmxvbmcgPyBmbXRMb25nKHZhbCkgOiBmbXRTaG9ydCh2YWwpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAndmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSB2YWxpZCBudW1iZXIuIHZhbD0nICtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHZhbClcbiAgKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhcbiAgICBzdHJcbiAgKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRTaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIH1cbiAgaWYgKG1zID49IGgpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnO1xuICB9XG4gIGlmIChtcyA+PSBtKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBtKSArICdtJztcbiAgfVxuICBpZiAobXMgPj0gcykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIH1cbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdExvbmcobXMpIHtcbiAgcmV0dXJuIHBsdXJhbChtcywgZCwgJ2RheScpIHx8XG4gICAgcGx1cmFsKG1zLCBoLCAnaG91cicpIHx8XG4gICAgcGx1cmFsKG1zLCBtLCAnbWludXRlJykgfHxcbiAgICBwbHVyYWwobXMsIHMsICdzZWNvbmQnKSB8fFxuICAgIG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKG1zIDwgbiAqIDEuNSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKG1zIC8gbikgKyAnICcgKyBuYW1lO1xuICB9XG4gIHJldHVybiBNYXRoLmNlaWwobXMgLyBuKSArICcgJyArIG5hbWUgKyAncyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/ms/index.js\n");

/***/ }),

/***/ "./src/main/index.dev.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nprocess.env.NODE_ENV = 'development';\n\n__webpack_require__(\"./node_modules/electron-debug/index.js\")({ showDevTools: true });\n\n__webpack_require__(0).app.on('ready', () => {\n  let installExtension = __webpack_require__(8);\n  installExtension.default(installExtension.VUEJS_DEVTOOLS).then(() => {}).catch(err => {\n    console.log('Unable to install `vue-devtools`: \\n', err);\n  });\n});\n\n__webpack_require__(\"./src/main/index.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5kZXYuanM/NzMzNiJdLCJuYW1lcyI6WyJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyZXF1aXJlIiwic2hvd0RldlRvb2xzIiwiYXBwIiwib24iLCJpbnN0YWxsRXh0ZW5zaW9uIiwiZGVmYXVsdCIsIlZVRUpTX0RFVlRPT0xTIiwidGhlbiIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7QUFVQUEsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEdBQXVCLGFBQXZCOztBQUdBLG1CQUFBQyxDQUFRLHdDQUFSLEVBQTBCLEVBQUVDLGNBQWMsSUFBaEIsRUFBMUI7O0FBR0EsbUJBQUFELENBQVEsQ0FBUixFQUFvQkUsR0FBcEIsQ0FBd0JDLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DLE1BQU07QUFDeEMsTUFBSUMsbUJBQW1CLG1CQUFBSixDQUFRLENBQVIsQ0FBdkI7QUFDQUksbUJBQWlCQyxPQUFqQixDQUF5QkQsaUJBQWlCRSxjQUExQyxFQUNHQyxJQURILENBQ1EsTUFBTSxDQUFFLENBRGhCLEVBRUdDLEtBRkgsQ0FFU0MsT0FBTztBQUNaQyxZQUFRQyxHQUFSLENBQVksc0NBQVosRUFBb0RGLEdBQXBEO0FBQ0QsR0FKSDtBQUtELENBUEQ7O0FBVUEsbUJBQUFULENBQVEscUJBQVIiLCJmaWxlIjoiLi9zcmMvbWFpbi9pbmRleC5kZXYuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgZmlsZSBpcyB1c2VkIHNwZWNpZmljYWxseSBhbmQgb25seSBmb3IgZGV2ZWxvcG1lbnQuIEl0IGluc3RhbGxzXG4gKiBgZWxlY3Ryb24tZGVidWdgICYgYHZ1ZS1kZXZ0b29sc2AuIFRoZXJlIHNob3VsZG4ndCBiZSBhbnkgbmVlZCB0b1xuICogIG1vZGlmeSB0aGlzIGZpbGUsIGJ1dCBpdCBjYW4gYmUgdXNlZCB0byBleHRlbmQgeW91ciBkZXZlbG9wbWVudFxuICogIGVudmlyb25tZW50LlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbi8vIFNldCBlbnZpcm9ubWVudCBmb3IgZGV2ZWxvcG1lbnRcbnByb2Nlc3MuZW52Lk5PREVfRU5WID0gJ2RldmVsb3BtZW50J1xuXG4vLyBJbnN0YWxsIGBlbGVjdHJvbi1kZWJ1Z2Agd2l0aCBgZGV2dHJvbmBcbnJlcXVpcmUoJ2VsZWN0cm9uLWRlYnVnJykoeyBzaG93RGV2VG9vbHM6IHRydWUgfSlcblxuLy8gSW5zdGFsbCBgdnVlLWRldnRvb2xzYFxucmVxdWlyZSgnZWxlY3Ryb24nKS5hcHAub24oJ3JlYWR5JywgKCkgPT4ge1xuICBsZXQgaW5zdGFsbEV4dGVuc2lvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcicpXG4gIGluc3RhbGxFeHRlbnNpb24uZGVmYXVsdChpbnN0YWxsRXh0ZW5zaW9uLlZVRUpTX0RFVlRPT0xTKVxuICAgIC50aGVuKCgpID0+IHt9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBpbnN0YWxsIGB2dWUtZGV2dG9vbHNgOiBcXG4nLCBlcnIpXG4gICAgfSlcbn0pXG5cbi8vIFJlcXVpcmUgYG1haW5gIHByb2Nlc3MgdG8gYm9vdCBhcHBcbnJlcXVpcmUoJy4vaW5kZXgnKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4vaW5kZXguZGV2LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/index.dev.js\n");

/***/ }),

/***/ "./src/main/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\n\nvar _electron = __webpack_require__(0);\n\nlet mainWindow;\nfunction sendEventToWindow(channel, ...args) {\n\tif (mainWindow && mainWindow.webContents) {\n\t\tmainWindow.webContents.send(channel, ...args);\n\t}\n}\n\nif (process.env.NODE_ENV !== 'development') {\n\tglobal.__static = __webpack_require__(9).join(__dirname, '/static').replace(/\\\\/g, '\\\\\\\\');\n}\n\nconst winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;\n\nfunction createWindow() {\n\tmainWindow = new _electron.BrowserWindow({\n\t\theight: 563,\n\t\tuseContentSize: true,\n\t\twidth: 1000\n\t});\n\n\tmainWindow.setMenu(null);\n\n\tmainWindow.loadURL(winURL);\n\n\tmainWindow.on('closed', () => {\n\t\tmainWindow = null;\n\t});\n}\n\n_electron.app.on('ready', createWindow);\n\n_electron.app.on('window-all-closed', () => {\n\tif (process.platform !== 'darwin') {\n\t\t_electron.app.quit();\n\t}\n});\n\n_electron.app.on('activate', () => {\n\tif (mainWindow === null) {\n\t\tcreateWindow();\n\t}\n});\n/* WEBPACK VAR INJECTION */}.call(exports, \"src/main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5qcz8yYmY2Il0sIm5hbWVzIjpbIm1haW5XaW5kb3ciLCJzZW5kRXZlbnRUb1dpbmRvdyIsImNoYW5uZWwiLCJhcmdzIiwid2ViQ29udGVudHMiLCJzZW5kIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiZ2xvYmFsIiwiX19zdGF0aWMiLCJyZXF1aXJlIiwiam9pbiIsIl9fZGlybmFtZSIsInJlcGxhY2UiLCJ3aW5VUkwiLCJjcmVhdGVXaW5kb3ciLCJoZWlnaHQiLCJ1c2VDb250ZW50U2l6ZSIsIndpZHRoIiwic2V0TWVudSIsImxvYWRVUkwiLCJvbiIsInBsYXRmb3JtIiwicXVpdCJdLCJtYXBwaW5ncyI6ImlEQUFBOztBQUVBOztBQUVBLElBQUlBLFVBQUo7QUFDQSxTQUFTQyxpQkFBVCxDQUE0QkMsT0FBNUIsRUFBcUMsR0FBR0MsSUFBeEMsRUFBOEM7QUFDN0MsS0FBSUgsY0FBY0EsV0FBV0ksV0FBN0IsRUFBMEM7QUFDekNKLGFBQVdJLFdBQVgsQ0FBdUJDLElBQXZCLENBQTRCSCxPQUE1QixFQUFxQyxHQUFHQyxJQUF4QztBQUNBO0FBQ0Q7O0FBTUQsSUFBSUcsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLGFBQTdCLEVBQTRDO0FBQzNDQyxRQUFPQyxRQUFQLEdBQWtCLG1CQUFBQyxDQUFRLENBQVIsRUFBZ0JDLElBQWhCLENBQXFCQyxTQUFyQixFQUFnQyxTQUFoQyxFQUEyQ0MsT0FBM0MsQ0FBbUQsS0FBbkQsRUFBMEQsTUFBMUQsQ0FBbEI7QUFDQTs7QUFFRCxNQUFNQyxTQUFTVCxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsYUFBekIsR0FDWCx1QkFEVyxHQUVYLFVBQVNLLFNBQVUsYUFGdkI7O0FBSUEsU0FBU0csWUFBVCxHQUF5QjtBQUl4QmhCLGNBQWEsNEJBQWtCO0FBQzlCaUIsVUFBUSxHQURzQjtBQUU5QkMsa0JBQWdCLElBRmM7QUFHOUJDLFNBQU87QUFIdUIsRUFBbEIsQ0FBYjs7QUFNQW5CLFlBQVdvQixPQUFYLENBQW1CLElBQW5COztBQUVBcEIsWUFBV3FCLE9BQVgsQ0FBbUJOLE1BQW5COztBQUVBZixZQUFXc0IsRUFBWCxDQUFjLFFBQWQsRUFBd0IsTUFBTTtBQUM3QnRCLGVBQWEsSUFBYjtBQUNBLEVBRkQ7QUFRQTs7QUFFRCxjQUFJc0IsRUFBSixDQUFPLE9BQVAsRUFBZ0JOLFlBQWhCOztBQUVBLGNBQUlNLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixNQUFNO0FBQ2pDLEtBQUloQixRQUFRaUIsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNsQyxnQkFBSUMsSUFBSjtBQUVBO0FBQ0QsQ0FMRDs7QUFPQSxjQUFJRixFQUFKLENBQU8sVUFBUCxFQUFtQixNQUFNO0FBQ3hCLEtBQUl0QixlQUFlLElBQW5CLEVBQXlCO0FBQ3hCZ0I7QUFDQTtBQUNELENBSkQsRSIsImZpbGUiOiIuL3NyYy9tYWluL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgZ2xvYmFsU2hvcnRjdXQsIE1lbnUgfSBmcm9tICdlbGVjdHJvbidcblxubGV0IG1haW5XaW5kb3dcbmZ1bmN0aW9uIHNlbmRFdmVudFRvV2luZG93IChjaGFubmVsLCAuLi5hcmdzKSB7XG5cdGlmIChtYWluV2luZG93ICYmIG1haW5XaW5kb3cud2ViQ29udGVudHMpIHtcblx0XHRtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoY2hhbm5lbCwgLi4uYXJncylcblx0fVxufVxuXG4vKipcbiAqIFNldCBgX19zdGF0aWNgIHBhdGggdG8gc3RhdGljIGZpbGVzIGluIHByb2R1Y3Rpb25cbiAqIGh0dHBzOi8vc2ltdWxhdGVkZ3JlZy5naXRib29rcy5pby9lbGVjdHJvbi12dWUvY29udGVudC9lbi91c2luZy1zdGF0aWMtYXNzZXRzLmh0bWxcbiAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAnZGV2ZWxvcG1lbnQnKSB7XG5cdGdsb2JhbC5fX3N0YXRpYyA9IHJlcXVpcmUoJ3BhdGgnKS5qb2luKF9fZGlybmFtZSwgJy9zdGF0aWMnKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG59XG5cbmNvbnN0IHdpblVSTCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG5cdD8gYGh0dHA6Ly9sb2NhbGhvc3Q6OTA4MGBcblx0OiBgZmlsZTovLyR7X19kaXJuYW1lfS9pbmRleC5odG1sYFxuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3cgKCkge1xuXHQvKipcblx0ICogSW5pdGlhbCB3aW5kb3cgb3B0aW9uc1xuXHQgKi9cblx0bWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcblx0XHRoZWlnaHQ6IDU2Myxcblx0XHR1c2VDb250ZW50U2l6ZTogdHJ1ZSxcblx0XHR3aWR0aDogMTAwMCxcblx0fSlcblxuXHRtYWluV2luZG93LnNldE1lbnUobnVsbCk7XG5cblx0bWFpbldpbmRvdy5sb2FkVVJMKHdpblVSTClcblxuXHRtYWluV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG5cdFx0bWFpbldpbmRvdyA9IG51bGxcblx0fSlcblxuXHQvLyBjb25zdCBzaG9ydGN1dHMgPSBbJ0NvbW1hbmRPckNvbnRyb2wrTycsICdDb21tYW5kT3JDb250cm9sK1MnLCAnRjEnXVxuXHQvLyBzaG9ydGN1dHMuZm9yRWFjaChhY2NlbGVyYXRvciA9PiB7XG5cdC8vIFx0Z2xvYmFsU2hvcnRjdXQucmVnaXN0ZXIoYWNjZWxlcmF0b3IsICgpID0+IHNlbmRFdmVudFRvV2luZG93KCdzaG9ydGN1dCcsIGFjY2VsZXJhdG9yKSlcblx0Ly8gfSlcbn1cblxuYXBwLm9uKCdyZWFkeScsIGNyZWF0ZVdpbmRvdylcblxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG5cdFx0YXBwLnF1aXQoKVxuXHRcdC8vIGdsb2JhbFNob3J0Y3V0LnVucmVnaXN0ZXJBbGwoKVxuXHR9XG59KVxuXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuXHRpZiAobWFpbldpbmRvdyA9PT0gbnVsbCkge1xuXHRcdGNyZWF0ZVdpbmRvdygpXG5cdH1cbn0pXG5cbi8qKlxuICogQXV0byBVcGRhdGVyXG4gKlxuICogVW5jb21tZW50IHRoZSBmb2xsb3dpbmcgY29kZSBiZWxvdyBhbmQgaW5zdGFsbCBgZWxlY3Ryb24tdXBkYXRlcmAgdG9cbiAqIHN1cHBvcnQgYXV0byB1cGRhdGluZy4gQ29kZSBTaWduaW5nIHdpdGggYSB2YWxpZCBjZXJ0aWZpY2F0ZSBpcyByZXF1aXJlZC5cbiAqIGh0dHBzOi8vc2ltdWxhdGVkZ3JlZy5naXRib29rcy5pby9lbGVjdHJvbi12dWUvY29udGVudC9lbi91c2luZy1lbGVjdHJvbi1idWlsZGVyLmh0bWwjYXV0by11cGRhdGluZ1xuICovXG5cbi8qXG5pbXBvcnQgeyBhdXRvVXBkYXRlciB9IGZyb20gJ2VsZWN0cm9uLXVwZGF0ZXInXG5cbmF1dG9VcGRhdGVyLm9uKCd1cGRhdGUtZG93bmxvYWRlZCcsICgpID0+IHtcblx0YXV0b1VwZGF0ZXIucXVpdEFuZEluc3RhbGwoKVxufSlcblxuYXBwLm9uKCdyZWFkeScsICgpID0+IHtcblx0aWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIGF1dG9VcGRhdGVyLmNoZWNrRm9yVXBkYXRlcygpXG59KVxuICovXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFpbi9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/index.js\n");

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzY5MjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb25cIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/electron-webpack/electron-main-hmr/main-hmr.js");
__webpack_require__("./src/main/index.dev.js");
module.exports = __webpack_require__("./src/main/index.js");


/***/ }),

/***/ 2:
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/YTMyNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInNvdXJjZS1tYXAtc3VwcG9ydC9zb3VyY2UtbWFwLXN1cHBvcnQuanNcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///2\n");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiPzRiMGYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svZWxlY3Ryb24tbWFpbi1obXIvSG1yQ2xpZW50XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb24td2VicGFjay9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIlxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///3\n");

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

eval("module.exports = require(\"tty\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0dHlcIj9iZjFjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0dHlcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ0dHlcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///4\n");

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCI/NzBjNSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI1LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInV0aWxcIlxuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///5\n");

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiPzJlMDkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZnNcIlxuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///6\n");

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

eval("module.exports = require(\"net\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXRcIj9lYjg1Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJuZXRcIlxuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///7\n");

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-devtools-installer\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIj8wMGI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjguanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIlxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///8\n");

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NWIyYSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///9\n");

/***/ })

/******/ });