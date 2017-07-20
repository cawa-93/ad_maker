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
/******/ 	var hotCurrentHash = "56ab7703f8db8bb02fcc"; // eslint-disable-line no-unused-vars
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
/******/ 		return hotDownloadManifest().then(function(update) {
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return hotCreateRequire(9)(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/debug/src/browser.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This is the web browser implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(\"./node_modules/debug/src/debug.js\");\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\nexports.storage = 'undefined' != typeof chrome\n               && 'undefined' != typeof chrome.storage\n                  ? chrome.storage.local\n                  : localstorage();\n\n/**\n * Colors.\n */\n\nexports.colors = [\n  'lightseagreen',\n  'forestgreen',\n  'goldenrod',\n  'dodgerblue',\n  'darkorchid',\n  'crimson'\n];\n\n/**\n * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n * and the Firebug extension (any Firefox version) are known\n * to support \"%c\" CSS customizations.\n *\n * TODO: add a `localStorage` variable to explicitly enable/disable colors\n */\n\nfunction useColors() {\n  // NB: In an Electron preload script, document will be defined but not fully\n  // initialized. Since we know we're in Chrome, we'll just detect this case\n  // explicitly\n  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {\n    return true;\n  }\n\n  // is webkit? http://stackoverflow.com/a/16459606/376773\n  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632\n  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||\n    // is firebug? http://stackoverflow.com/a/398120/376773\n    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||\n    // is firefox >= v31?\n    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||\n    // double check webkit in userAgent just in case we are in a worker\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\\/(\\d+)/));\n}\n\n/**\n * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n */\n\nexports.formatters.j = function(v) {\n  try {\n    return JSON.stringify(v);\n  } catch (err) {\n    return '[UnexpectedJSONParseError]: ' + err.message;\n  }\n};\n\n\n/**\n * Colorize log arguments if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var useColors = this.useColors;\n\n  args[0] = (useColors ? '%c' : '')\n    + this.namespace\n    + (useColors ? ' %c' : ' ')\n    + args[0]\n    + (useColors ? '%c ' : ' ')\n    + '+' + exports.humanize(this.diff);\n\n  if (!useColors) return;\n\n  var c = 'color: ' + this.color;\n  args.splice(1, 0, c, 'color: inherit')\n\n  // the final \"%c\" is somewhat tricky, because there could be other\n  // arguments passed either before or after the %c, so we need to\n  // figure out the correct index to insert the CSS into\n  var index = 0;\n  var lastC = 0;\n  args[0].replace(/%[a-zA-Z%]/g, function(match) {\n    if ('%%' === match) return;\n    index++;\n    if ('%c' === match) {\n      // we only are interested in the *last* %c\n      // (the user may have provided their own)\n      lastC = index;\n    }\n  });\n\n  args.splice(lastC, 0, c);\n}\n\n/**\n * Invokes `console.log()` when available.\n * No-op when `console.log` is not a \"function\".\n *\n * @api public\n */\n\nfunction log() {\n  // this hackery is required for IE8/9, where\n  // the `console.log` function doesn't have 'apply'\n  return 'object' === typeof console\n    && console.log\n    && Function.prototype.apply.call(console.log, console, arguments);\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  try {\n    if (null == namespaces) {\n      exports.storage.removeItem('debug');\n    } else {\n      exports.storage.debug = namespaces;\n    }\n  } catch(e) {}\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  var r;\n  try {\n    r = exports.storage.debug;\n  } catch(e) {}\n\n  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG\n  if (!r && typeof process !== 'undefined' && 'env' in process) {\n    r = process.env.DEBUG;\n  }\n\n  return r;\n}\n\n/**\n * Enable namespaces listed in `localStorage.debug` initially.\n */\n\nexports.enable(load());\n\n/**\n * Localstorage attempts to return the localstorage.\n *\n * This is necessary because safari throws\n * when a user disables cookies/localstorage\n * and you attempt to access it.\n *\n * @return {LocalStorage}\n * @api private\n */\n\nfunction localstorage() {\n  try {\n    return window.localStorage;\n  } catch (e) {}\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2RlYnVnL3NyYy9icm93c2VyLmpzPzEzZjkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lXG4gICAgICAgICAgICAgICAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lLnN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgID8gY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgICAgICAgICAgICAgICAgIDogbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuICAnbGlnaHRzZWFncmVlbicsXG4gICdmb3Jlc3RncmVlbicsXG4gICdnb2xkZW5yb2QnLFxuICAnZG9kZ2VyYmx1ZScsXG4gICdkYXJrb3JjaGlkJyxcbiAgJ2NyaW1zb24nXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICAvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuICByZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8ICh3aW5kb3cuY29uc29sZS5leGNlcHRpb24gJiYgd2luZG93LmNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSkgfHxcbiAgICAvLyBkb3VibGUgY2hlY2sgd2Via2l0IGluIHVzZXJBZ2VudCBqdXN0IGluIGNhc2Ugd2UgYXJlIGluIGEgd29ya2VyXG4gICAgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyLm1lc3NhZ2U7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuO1xuXG4gIHZhciBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcbiAgYXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0JylcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmxvZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUubG9nYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4gIC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gIHJldHVybiAnb2JqZWN0JyA9PT0gdHlwZW9mIGNvbnNvbGVcbiAgICAmJiBjb25zb2xlLmxvZ1xuICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge31cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICB2YXIgcjtcbiAgdHJ5IHtcbiAgICByID0gZXhwb3J0cy5zdG9yYWdlLmRlYnVnO1xuICB9IGNhdGNoKGUpIHt9XG5cbiAgLy8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuICBpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcbiAgICByID0gcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2RlYnVnL3NyYy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/debug/src/browser.js\n");

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/***/ (function(module, exports, __webpack_require__) {

eval("\n/**\n * This is the common logic for both the Node.js and web browser\n * implementations of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = createDebug.debug = createDebug['default'] = createDebug;\nexports.coerce = coerce;\nexports.disable = disable;\nexports.enable = enable;\nexports.enabled = enabled;\nexports.humanize = __webpack_require__(\"./node_modules/ms/index.js\");\n\n/**\n * The currently active debug mode names, and names to skip.\n */\n\nexports.names = [];\nexports.skips = [];\n\n/**\n * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n *\n * Valid key names are a single, lower or upper-case letter, i.e. \"n\" and \"N\".\n */\n\nexports.formatters = {};\n\n/**\n * Previous log timestamp.\n */\n\nvar prevTime;\n\n/**\n * Select a color.\n * @param {String} namespace\n * @return {Number}\n * @api private\n */\n\nfunction selectColor(namespace) {\n  var hash = 0, i;\n\n  for (i in namespace) {\n    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);\n    hash |= 0; // Convert to 32bit integer\n  }\n\n  return exports.colors[Math.abs(hash) % exports.colors.length];\n}\n\n/**\n * Create a debugger with the given `namespace`.\n *\n * @param {String} namespace\n * @return {Function}\n * @api public\n */\n\nfunction createDebug(namespace) {\n\n  function debug() {\n    // disabled?\n    if (!debug.enabled) return;\n\n    var self = debug;\n\n    // set `diff` timestamp\n    var curr = +new Date();\n    var ms = curr - (prevTime || curr);\n    self.diff = ms;\n    self.prev = prevTime;\n    self.curr = curr;\n    prevTime = curr;\n\n    // turn the `arguments` into a proper Array\n    var args = new Array(arguments.length);\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i];\n    }\n\n    args[0] = exports.coerce(args[0]);\n\n    if ('string' !== typeof args[0]) {\n      // anything else let's inspect with %O\n      args.unshift('%O');\n    }\n\n    // apply any `formatters` transformations\n    var index = 0;\n    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {\n      // if we encounter an escaped % then don't increase the array index\n      if (match === '%%') return match;\n      index++;\n      var formatter = exports.formatters[format];\n      if ('function' === typeof formatter) {\n        var val = args[index];\n        match = formatter.call(self, val);\n\n        // now we need to remove `args[index]` since it's inlined in the `format`\n        args.splice(index, 1);\n        index--;\n      }\n      return match;\n    });\n\n    // apply env-specific formatting (colors, etc.)\n    exports.formatArgs.call(self, args);\n\n    var logFn = debug.log || exports.log || console.log.bind(console);\n    logFn.apply(self, args);\n  }\n\n  debug.namespace = namespace;\n  debug.enabled = exports.enabled(namespace);\n  debug.useColors = exports.useColors();\n  debug.color = selectColor(namespace);\n\n  // env-specific initialization logic for debug instances\n  if ('function' === typeof exports.init) {\n    exports.init(debug);\n  }\n\n  return debug;\n}\n\n/**\n * Enables a debug mode by namespaces. This can include modes\n * separated by a colon and wildcards.\n *\n * @param {String} namespaces\n * @api public\n */\n\nfunction enable(namespaces) {\n  exports.save(namespaces);\n\n  exports.names = [];\n  exports.skips = [];\n\n  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\\s,]+/);\n  var len = split.length;\n\n  for (var i = 0; i < len; i++) {\n    if (!split[i]) continue; // ignore empty strings\n    namespaces = split[i].replace(/\\*/g, '.*?');\n    if (namespaces[0] === '-') {\n      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n    } else {\n      exports.names.push(new RegExp('^' + namespaces + '$'));\n    }\n  }\n}\n\n/**\n * Disable debug output.\n *\n * @api public\n */\n\nfunction disable() {\n  exports.enable('');\n}\n\n/**\n * Returns true if the given mode name is enabled, false otherwise.\n *\n * @param {String} name\n * @return {Boolean}\n * @api public\n */\n\nfunction enabled(name) {\n  var i, len;\n  for (i = 0, len = exports.skips.length; i < len; i++) {\n    if (exports.skips[i].test(name)) {\n      return false;\n    }\n  }\n  for (i = 0, len = exports.names.length; i < len; i++) {\n    if (exports.names[i].test(name)) {\n      return true;\n    }\n  }\n  return false;\n}\n\n/**\n * Coerce `val`.\n *\n * @param {Mixed} val\n * @return {Mixed}\n * @api private\n */\n\nfunction coerce(val) {\n  if (val instanceof Error) return val.stack || val.message;\n  return val;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2RlYnVnL3NyYy9kZWJ1Zy5qcz8yZDhlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVk7QUFDWjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsU0FBUztBQUMxQiw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsU0FBUztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9kZWJ1Zy5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVEZWJ1Zy5kZWJ1ZyA9IGNyZWF0ZURlYnVnWydkZWZhdWx0J10gPSBjcmVhdGVEZWJ1ZztcbmV4cG9ydHMuY29lcmNlID0gY29lcmNlO1xuZXhwb3J0cy5kaXNhYmxlID0gZGlzYWJsZTtcbmV4cG9ydHMuZW5hYmxlID0gZW5hYmxlO1xuZXhwb3J0cy5lbmFibGVkID0gZW5hYmxlZDtcbmV4cG9ydHMuaHVtYW5pemUgPSByZXF1aXJlKCdtcycpO1xuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuICovXG5cbmV4cG9ydHMubmFtZXMgPSBbXTtcbmV4cG9ydHMuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG4gKlxuICogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXIgb3IgdXBwZXItY2FzZSBsZXR0ZXIsIGkuZS4gXCJuXCIgYW5kIFwiTlwiLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycyA9IHt9O1xuXG4vKipcbiAqIFByZXZpb3VzIGxvZyB0aW1lc3RhbXAuXG4gKi9cblxudmFyIHByZXZUaW1lO1xuXG4vKipcbiAqIFNlbGVjdCBhIGNvbG9yLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VsZWN0Q29sb3IobmFtZXNwYWNlKSB7XG4gIHZhciBoYXNoID0gMCwgaTtcblxuICBmb3IgKGkgaW4gbmFtZXNwYWNlKSB7XG4gICAgaGFzaCAgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIG5hbWVzcGFjZS5jaGFyQ29kZUF0KGkpO1xuICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cblxuICByZXR1cm4gZXhwb3J0cy5jb2xvcnNbTWF0aC5hYnMoaGFzaCkgJSBleHBvcnRzLmNvbG9ycy5sZW5ndGhdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVEZWJ1ZyhuYW1lc3BhY2UpIHtcblxuICBmdW5jdGlvbiBkZWJ1ZygpIHtcbiAgICAvLyBkaXNhYmxlZD9cbiAgICBpZiAoIWRlYnVnLmVuYWJsZWQpIHJldHVybjtcblxuICAgIHZhciBzZWxmID0gZGVidWc7XG5cbiAgICAvLyBzZXQgYGRpZmZgIHRpbWVzdGFtcFxuICAgIHZhciBjdXJyID0gK25ldyBEYXRlKCk7XG4gICAgdmFyIG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcbiAgICBzZWxmLmRpZmYgPSBtcztcbiAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICBzZWxmLmN1cnIgPSBjdXJyO1xuICAgIHByZXZUaW1lID0gY3VycjtcblxuICAgIC8vIHR1cm4gdGhlIGBhcmd1bWVudHNgIGludG8gYSBwcm9wZXIgQXJyYXlcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgYXJnc1swXSA9IGV4cG9ydHMuY29lcmNlKGFyZ3NbMF0pO1xuXG4gICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgLy8gYW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJU9cbiAgICAgIGFyZ3MudW5zaGlmdCgnJU8nKTtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIGZ1bmN0aW9uKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgIC8vIGlmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgIGlmIChtYXRjaCA9PT0gJyUlJykgcmV0dXJuIG1hdGNoO1xuICAgICAgaW5kZXgrKztcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSBleHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgbWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG4gICAgICAgIC8vIG5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcbiAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgLy8gYXBwbHkgZW52LXNwZWNpZmljIGZvcm1hdHRpbmcgKGNvbG9ycywgZXRjLilcbiAgICBleHBvcnRzLmZvcm1hdEFyZ3MuY2FsbChzZWxmLCBhcmdzKTtcblxuICAgIHZhciBsb2dGbiA9IGRlYnVnLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG5cbiAgZGVidWcubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuICBkZWJ1Zy5lbmFibGVkID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSk7XG4gIGRlYnVnLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gIGRlYnVnLmNvbG9yID0gc2VsZWN0Q29sb3IobmFtZXNwYWNlKTtcblxuICAvLyBlbnYtc3BlY2lmaWMgaW5pdGlhbGl6YXRpb24gbG9naWMgZm9yIGRlYnVnIGluc3RhbmNlc1xuICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGV4cG9ydHMuaW5pdCkge1xuICAgIGV4cG9ydHMuaW5pdChkZWJ1Zyk7XG4gIH1cblxuICByZXR1cm4gZGVidWc7XG59XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZXNwYWNlcy4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICBleHBvcnRzLnNhdmUobmFtZXNwYWNlcyk7XG5cbiAgZXhwb3J0cy5uYW1lcyA9IFtdO1xuICBleHBvcnRzLnNraXBzID0gW107XG5cbiAgdmFyIHNwbGl0ID0gKHR5cGVvZiBuYW1lc3BhY2VzID09PSAnc3RyaW5nJyA/IG5hbWVzcGFjZXMgOiAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgdmFyIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZGVidWcvc3JjL2RlYnVnLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvZGVidWcuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/debug/src/debug.js\n");

/***/ }),

/***/ "./node_modules/debug/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Detect Electron renderer process, which is node, but we should\n * treat as a browser.\n */\n\nif (typeof process !== 'undefined' && process.type === 'renderer') {\n  module.exports = __webpack_require__(\"./node_modules/debug/src/browser.js\");\n} else {\n  module.exports = __webpack_require__(\"./node_modules/debug/src/node.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2RlYnVnL3NyYy9pbmRleC5qcz8xMGVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERldGVjdCBFbGVjdHJvbiByZW5kZXJlciBwcm9jZXNzLCB3aGljaCBpcyBub2RlLCBidXQgd2Ugc2hvdWxkXG4gKiB0cmVhdCBhcyBhIGJyb3dzZXIuXG4gKi9cblxuaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Jyb3dzZXIuanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9ub2RlLmpzJyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZGVidWcvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/debug/src/index.js\n");

/***/ }),

/***/ "./node_modules/debug/src/node.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Module dependencies.\n */\n\nvar tty = __webpack_require__(7);\nvar util = __webpack_require__(8);\n\n/**\n * This is the Node.js implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(\"./node_modules/debug/src/debug.js\");\nexports.init = init;\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\n\n/**\n * Colors.\n */\n\nexports.colors = [6, 2, 3, 4, 5, 1];\n\n/**\n * Build up the default `inspectOpts` object from the environment variables.\n *\n *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js\n */\n\nexports.inspectOpts = Object.keys(process.env).filter(function (key) {\n  return /^debug_/i.test(key);\n}).reduce(function (obj, key) {\n  // camel-case\n  var prop = key\n    .substring(6)\n    .toLowerCase()\n    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });\n\n  // coerce string value into JS value\n  var val = process.env[key];\n  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;\n  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;\n  else if (val === 'null') val = null;\n  else val = Number(val);\n\n  obj[prop] = val;\n  return obj;\n}, {});\n\n/**\n * The file descriptor to write the `debug()` calls to.\n * Set the `DEBUG_FD` env variable to override with another value. i.e.:\n *\n *   $ DEBUG_FD=3 node script.js 3>debug.log\n */\n\nvar fd = parseInt(process.env.DEBUG_FD, 10) || 2;\n\nif (1 !== fd && 2 !== fd) {\n  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()\n}\n\nvar stream = 1 === fd ? process.stdout :\n             2 === fd ? process.stderr :\n             createWritableStdioStream(fd);\n\n/**\n * Is stdout a TTY? Colored output is enabled when `true`.\n */\n\nfunction useColors() {\n  return 'colors' in exports.inspectOpts\n    ? Boolean(exports.inspectOpts.colors)\n    : tty.isatty(fd);\n}\n\n/**\n * Map %o to `util.inspect()`, all on a single line.\n */\n\nexports.formatters.o = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts)\n    .replace(/\\s*\\n\\s*/g, ' ');\n};\n\n/**\n * Map %o to `util.inspect()`, allowing multiple lines if needed.\n */\n\nexports.formatters.O = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts);\n};\n\n/**\n * Adds ANSI color escape codes if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var name = this.namespace;\n  var useColors = this.useColors;\n\n  if (useColors) {\n    var c = this.color;\n    var prefix = '  \\u001b[3' + c + ';1m' + name + ' ' + '\\u001b[0m';\n\n    args[0] = prefix + args[0].split('\\n').join('\\n' + prefix);\n    args.push('\\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\\u001b[0m');\n  } else {\n    args[0] = new Date().toUTCString()\n      + ' ' + name + ' ' + args[0];\n  }\n}\n\n/**\n * Invokes `util.format()` with the specified arguments and writes to `stream`.\n */\n\nfunction log() {\n  return stream.write(util.format.apply(util, arguments) + '\\n');\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  if (null == namespaces) {\n    // If you set a process.env field to null or undefined, it gets cast to the\n    // string 'null' or 'undefined'. Just delete instead.\n    delete process.env.DEBUG;\n  } else {\n    process.env.DEBUG = namespaces;\n  }\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  return process.env.DEBUG;\n}\n\n/**\n * Copied from `node/src/node.js`.\n *\n * XXX: It's lame that node doesn't expose this API out-of-the-box. It also\n * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.\n */\n\nfunction createWritableStdioStream (fd) {\n  var stream;\n  var tty_wrap = process.binding('tty_wrap');\n\n  // Note stream._type is used for test-module-load-list.js\n\n  switch (tty_wrap.guessHandleType(fd)) {\n    case 'TTY':\n      stream = new tty.WriteStream(fd);\n      stream._type = 'tty';\n\n      // Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    case 'FILE':\n      var fs = __webpack_require__(3);\n      stream = new fs.SyncWriteStream(fd, { autoClose: false });\n      stream._type = 'fs';\n      break;\n\n    case 'PIPE':\n    case 'TCP':\n      var net = __webpack_require__(4);\n      stream = new net.Socket({\n        fd: fd,\n        readable: false,\n        writable: true\n      });\n\n      // FIXME Should probably have an option in net.Socket to create a\n      // stream from an existing fd which is writable only. But for now\n      // we'll just add this hack and set the `readable` member to false.\n      // Test: ./node test/fixtures/echo.js < /etc/passwd\n      stream.readable = false;\n      stream.read = null;\n      stream._type = 'pipe';\n\n      // FIXME Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    default:\n      // Probably an error on in uv_guess_handle()\n      throw new Error('Implement me. Unknown stream file type!');\n  }\n\n  // For supporting legacy API we put the FD here.\n  stream.fd = fd;\n\n  stream._isStdio = true;\n\n  return stream;\n}\n\n/**\n * Init logic for `debug` instances.\n *\n * Create a new `inspectOpts` object in case `useColors` is set\n * differently for a particular `debug` instance.\n */\n\nfunction init (debug) {\n  debug.inspectOpts = {};\n\n  var keys = Object.keys(exports.inspectOpts);\n  for (var i = 0; i < keys.length; i++) {\n    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];\n  }\n}\n\n/**\n * Enable namespaces listed in `process.env.DEBUG` initially.\n */\n\nexports.enable(load());\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2RlYnVnL3NyYy9ub2RlLmpzP2QzNzkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHlCQUF5Qjs7QUFFcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLElBQUk7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDLG1CQUFtQjtBQUM5RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9ub2RlLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciB0dHkgPSByZXF1aXJlKCd0dHknKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIE5vZGUuanMgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmluaXQgPSBpbml0O1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbNiwgMiwgMywgNCwgNSwgMV07XG5cbi8qKlxuICogQnVpbGQgdXAgdGhlIGRlZmF1bHQgYGluc3BlY3RPcHRzYCBvYmplY3QgZnJvbSB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICpcbiAqICAgJCBERUJVR19DT0xPUlM9bm8gREVCVUdfREVQVEg9MTAgREVCVUdfU0hPV19ISURERU49ZW5hYmxlZCBub2RlIHNjcmlwdC5qc1xuICovXG5cbmV4cG9ydHMuaW5zcGVjdE9wdHMgPSBPYmplY3Qua2V5cyhwcm9jZXNzLmVudikuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIC9eZGVidWdfL2kudGVzdChrZXkpO1xufSkucmVkdWNlKGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAvLyBjYW1lbC1jYXNlXG4gIHZhciBwcm9wID0ga2V5XG4gICAgLnN1YnN0cmluZyg2KVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL18oW2Etel0pL2csIGZ1bmN0aW9uIChfLCBrKSB7IHJldHVybiBrLnRvVXBwZXJDYXNlKCkgfSk7XG5cbiAgLy8gY29lcmNlIHN0cmluZyB2YWx1ZSBpbnRvIEpTIHZhbHVlXG4gIHZhciB2YWwgPSBwcm9jZXNzLmVudltrZXldO1xuICBpZiAoL14oeWVzfG9ufHRydWV8ZW5hYmxlZCkkL2kudGVzdCh2YWwpKSB2YWwgPSB0cnVlO1xuICBlbHNlIGlmICgvXihub3xvZmZ8ZmFsc2V8ZGlzYWJsZWQpJC9pLnRlc3QodmFsKSkgdmFsID0gZmFsc2U7XG4gIGVsc2UgaWYgKHZhbCA9PT0gJ251bGwnKSB2YWwgPSBudWxsO1xuICBlbHNlIHZhbCA9IE51bWJlcih2YWwpO1xuXG4gIG9ialtwcm9wXSA9IHZhbDtcbiAgcmV0dXJuIG9iajtcbn0sIHt9KTtcblxuLyoqXG4gKiBUaGUgZmlsZSBkZXNjcmlwdG9yIHRvIHdyaXRlIHRoZSBgZGVidWcoKWAgY2FsbHMgdG8uXG4gKiBTZXQgdGhlIGBERUJVR19GRGAgZW52IHZhcmlhYmxlIHRvIG92ZXJyaWRlIHdpdGggYW5vdGhlciB2YWx1ZS4gaS5lLjpcbiAqXG4gKiAgICQgREVCVUdfRkQ9MyBub2RlIHNjcmlwdC5qcyAzPmRlYnVnLmxvZ1xuICovXG5cbnZhciBmZCA9IHBhcnNlSW50KHByb2Nlc3MuZW52LkRFQlVHX0ZELCAxMCkgfHwgMjtcblxuaWYgKDEgIT09IGZkICYmIDIgIT09IGZkKSB7XG4gIHV0aWwuZGVwcmVjYXRlKGZ1bmN0aW9uKCl7fSwgJ2V4Y2VwdCBmb3Igc3RkZXJyKDIpIGFuZCBzdGRvdXQoMSksIGFueSBvdGhlciB1c2FnZSBvZiBERUJVR19GRCBpcyBkZXByZWNhdGVkLiBPdmVycmlkZSBkZWJ1Zy5sb2cgaWYgeW91IHdhbnQgdG8gdXNlIGEgZGlmZmVyZW50IGxvZyBmdW5jdGlvbiAoaHR0cHM6Ly9naXQuaW8vZGVidWdfZmQpJykoKVxufVxuXG52YXIgc3RyZWFtID0gMSA9PT0gZmQgPyBwcm9jZXNzLnN0ZG91dCA6XG4gICAgICAgICAgICAgMiA9PT0gZmQgPyBwcm9jZXNzLnN0ZGVyciA6XG4gICAgICAgICAgICAgY3JlYXRlV3JpdGFibGVTdGRpb1N0cmVhbShmZCk7XG5cbi8qKlxuICogSXMgc3Rkb3V0IGEgVFRZPyBDb2xvcmVkIG91dHB1dCBpcyBlbmFibGVkIHdoZW4gYHRydWVgLlxuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgcmV0dXJuICdjb2xvcnMnIGluIGV4cG9ydHMuaW5zcGVjdE9wdHNcbiAgICA/IEJvb2xlYW4oZXhwb3J0cy5pbnNwZWN0T3B0cy5jb2xvcnMpXG4gICAgOiB0dHkuaXNhdHR5KGZkKTtcbn1cblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsIG9uIGEgc2luZ2xlIGxpbmUuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLm8gPSBmdW5jdGlvbih2KSB7XG4gIHRoaXMuaW5zcGVjdE9wdHMuY29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG4gIHJldHVybiB1dGlsLmluc3BlY3QodiwgdGhpcy5pbnNwZWN0T3B0cylcbiAgICAucmVwbGFjZSgvXFxzKlxcblxccyovZywgJyAnKTtcbn07XG5cbi8qKlxuICogTWFwICVvIHRvIGB1dGlsLmluc3BlY3QoKWAsIGFsbG93aW5nIG11bHRpcGxlIGxpbmVzIGlmIG5lZWRlZC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuTyA9IGZ1bmN0aW9uKHYpIHtcbiAgdGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcbiAgcmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKTtcbn07XG5cbi8qKlxuICogQWRkcyBBTlNJIGNvbG9yIGVzY2FwZSBjb2RlcyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QXJncyhhcmdzKSB7XG4gIHZhciBuYW1lID0gdGhpcy5uYW1lc3BhY2U7XG4gIHZhciB1c2VDb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblxuICBpZiAodXNlQ29sb3JzKSB7XG4gICAgdmFyIGMgPSB0aGlzLmNvbG9yO1xuICAgIHZhciBwcmVmaXggPSAnICBcXHUwMDFiWzMnICsgYyArICc7MW0nICsgbmFtZSArICcgJyArICdcXHUwMDFiWzBtJztcblxuICAgIGFyZ3NbMF0gPSBwcmVmaXggKyBhcmdzWzBdLnNwbGl0KCdcXG4nKS5qb2luKCdcXG4nICsgcHJlZml4KTtcbiAgICBhcmdzLnB1c2goJ1xcdTAwMWJbMycgKyBjICsgJ20rJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKSArICdcXHUwMDFiWzBtJyk7XG4gIH0gZWxzZSB7XG4gICAgYXJnc1swXSA9IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxuICAgICAgKyAnICcgKyBuYW1lICsgJyAnICsgYXJnc1swXTtcbiAgfVxufVxuXG4vKipcbiAqIEludm9rZXMgYHV0aWwuZm9ybWF0KClgIHdpdGggdGhlIHNwZWNpZmllZCBhcmd1bWVudHMgYW5kIHdyaXRlcyB0byBgc3RyZWFtYC5cbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIHJldHVybiBzdHJlYW0ud3JpdGUodXRpbC5mb3JtYXQuYXBwbHkodXRpbCwgYXJndW1lbnRzKSArICdcXG4nKTtcbn1cblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG4gIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAvLyBJZiB5b3Ugc2V0IGEgcHJvY2Vzcy5lbnYgZmllbGQgdG8gbnVsbCBvciB1bmRlZmluZWQsIGl0IGdldHMgY2FzdCB0byB0aGVcbiAgICAvLyBzdHJpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnLiBKdXN0IGRlbGV0ZSBpbnN0ZWFkLlxuICAgIGRlbGV0ZSBwcm9jZXNzLmVudi5ERUJVRztcbiAgfSBlbHNlIHtcbiAgICBwcm9jZXNzLmVudi5ERUJVRyA9IG5hbWVzcGFjZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICByZXR1cm4gcHJvY2Vzcy5lbnYuREVCVUc7XG59XG5cbi8qKlxuICogQ29waWVkIGZyb20gYG5vZGUvc3JjL25vZGUuanNgLlxuICpcbiAqIFhYWDogSXQncyBsYW1lIHRoYXQgbm9kZSBkb2Vzbid0IGV4cG9zZSB0aGlzIEFQSSBvdXQtb2YtdGhlLWJveC4gSXQgYWxzb1xuICogcmVsaWVzIG9uIHRoZSB1bmRvY3VtZW50ZWQgYHR0eV93cmFwLmd1ZXNzSGFuZGxlVHlwZSgpYCB3aGljaCBpcyBhbHNvIGxhbWUuXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlV3JpdGFibGVTdGRpb1N0cmVhbSAoZmQpIHtcbiAgdmFyIHN0cmVhbTtcbiAgdmFyIHR0eV93cmFwID0gcHJvY2Vzcy5iaW5kaW5nKCd0dHlfd3JhcCcpO1xuXG4gIC8vIE5vdGUgc3RyZWFtLl90eXBlIGlzIHVzZWQgZm9yIHRlc3QtbW9kdWxlLWxvYWQtbGlzdC5qc1xuXG4gIHN3aXRjaCAodHR5X3dyYXAuZ3Vlc3NIYW5kbGVUeXBlKGZkKSkge1xuICAgIGNhc2UgJ1RUWSc6XG4gICAgICBzdHJlYW0gPSBuZXcgdHR5LldyaXRlU3RyZWFtKGZkKTtcbiAgICAgIHN0cmVhbS5fdHlwZSA9ICd0dHknO1xuXG4gICAgICAvLyBIYWNrIHRvIGhhdmUgc3RyZWFtIG5vdCBrZWVwIHRoZSBldmVudCBsb29wIGFsaXZlLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcyNlxuICAgICAgaWYgKHN0cmVhbS5faGFuZGxlICYmIHN0cmVhbS5faGFuZGxlLnVucmVmKSB7XG4gICAgICAgIHN0cmVhbS5faGFuZGxlLnVucmVmKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0ZJTEUnOlxuICAgICAgdmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgIHN0cmVhbSA9IG5ldyBmcy5TeW5jV3JpdGVTdHJlYW0oZmQsIHsgYXV0b0Nsb3NlOiBmYWxzZSB9KTtcbiAgICAgIHN0cmVhbS5fdHlwZSA9ICdmcyc7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1BJUEUnOlxuICAgIGNhc2UgJ1RDUCc6XG4gICAgICB2YXIgbmV0ID0gcmVxdWlyZSgnbmV0Jyk7XG4gICAgICBzdHJlYW0gPSBuZXcgbmV0LlNvY2tldCh7XG4gICAgICAgIGZkOiBmZCxcbiAgICAgICAgcmVhZGFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEZJWE1FIFNob3VsZCBwcm9iYWJseSBoYXZlIGFuIG9wdGlvbiBpbiBuZXQuU29ja2V0IHRvIGNyZWF0ZSBhXG4gICAgICAvLyBzdHJlYW0gZnJvbSBhbiBleGlzdGluZyBmZCB3aGljaCBpcyB3cml0YWJsZSBvbmx5LiBCdXQgZm9yIG5vd1xuICAgICAgLy8gd2UnbGwganVzdCBhZGQgdGhpcyBoYWNrIGFuZCBzZXQgdGhlIGByZWFkYWJsZWAgbWVtYmVyIHRvIGZhbHNlLlxuICAgICAgLy8gVGVzdDogLi9ub2RlIHRlc3QvZml4dHVyZXMvZWNoby5qcyA8IC9ldGMvcGFzc3dkXG4gICAgICBzdHJlYW0ucmVhZGFibGUgPSBmYWxzZTtcbiAgICAgIHN0cmVhbS5yZWFkID0gbnVsbDtcbiAgICAgIHN0cmVhbS5fdHlwZSA9ICdwaXBlJztcblxuICAgICAgLy8gRklYTUUgSGFjayB0byBoYXZlIHN0cmVhbSBub3Qga2VlcCB0aGUgZXZlbnQgbG9vcCBhbGl2ZS5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvaXNzdWVzLzE3MjZcbiAgICAgIGlmIChzdHJlYW0uX2hhbmRsZSAmJiBzdHJlYW0uX2hhbmRsZS51bnJlZikge1xuICAgICAgICBzdHJlYW0uX2hhbmRsZS51bnJlZigpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgLy8gUHJvYmFibHkgYW4gZXJyb3Igb24gaW4gdXZfZ3Vlc3NfaGFuZGxlKClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW1wbGVtZW50IG1lLiBVbmtub3duIHN0cmVhbSBmaWxlIHR5cGUhJyk7XG4gIH1cblxuICAvLyBGb3Igc3VwcG9ydGluZyBsZWdhY3kgQVBJIHdlIHB1dCB0aGUgRkQgaGVyZS5cbiAgc3RyZWFtLmZkID0gZmQ7XG5cbiAgc3RyZWFtLl9pc1N0ZGlvID0gdHJ1ZTtcblxuICByZXR1cm4gc3RyZWFtO1xufVxuXG4vKipcbiAqIEluaXQgbG9naWMgZm9yIGBkZWJ1Z2AgaW5zdGFuY2VzLlxuICpcbiAqIENyZWF0ZSBhIG5ldyBgaW5zcGVjdE9wdHNgIG9iamVjdCBpbiBjYXNlIGB1c2VDb2xvcnNgIGlzIHNldFxuICogZGlmZmVyZW50bHkgZm9yIGEgcGFydGljdWxhciBgZGVidWdgIGluc3RhbmNlLlxuICovXG5cbmZ1bmN0aW9uIGluaXQgKGRlYnVnKSB7XG4gIGRlYnVnLmluc3BlY3RPcHRzID0ge307XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhleHBvcnRzLmluc3BlY3RPcHRzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgZGVidWcuaW5zcGVjdE9wdHNba2V5c1tpXV0gPSBleHBvcnRzLmluc3BlY3RPcHRzW2tleXNbaV1dO1xuICB9XG59XG5cbi8qKlxuICogRW5hYmxlIG5hbWVzcGFjZXMgbGlzdGVkIGluIGBwcm9jZXNzLmVudi5ERUJVR2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZGVidWcvc3JjL25vZGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9ub2RlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/debug/src/node.js\n");

/***/ }),

/***/ "./node_modules/devtron/api.js":
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {const electron = __webpack_require__(0)\n\nexports.install = () => {\n  if (process.type === 'renderer') {\n    console.log(`Installing Devtron from ${__dirname}`)\n    if (electron.remote.BrowserWindow.getDevToolsExtensions &&\n        electron.remote.BrowserWindow.getDevToolsExtensions().devtron) return true\n    return electron.remote.BrowserWindow.addDevToolsExtension(__dirname)\n  } else if (process.type === 'browser') {\n    console.log(`Installing Devtron from ${__dirname}`)\n    if (electron.BrowserWindow.getDevToolsExtensions &&\n        electron.BrowserWindow.getDevToolsExtensions().devtron) return true\n    return electron.BrowserWindow.addDevToolsExtension(__dirname)\n  } else {\n    throw new Error('Devtron can only be installed from an Electron process.')\n  }\n}\n\nexports.uninstall = () => {\n  if (process.type === 'renderer') {\n    console.log(`Uninstalling Devtron from ${__dirname}`)\n    return electron.remote.BrowserWindow.removeDevToolsExtension('devtron')\n  } else if (process.type === 'browser') {\n    console.log(`Uninstalling Devtron from ${__dirname}`)\n    return electron.BrowserWindow.removeDevToolsExtension('devtron')\n  } else {\n    throw new Error('Devtron can only be uninstalled from an Electron process.')\n  }\n}\n\nexports.path = __dirname\n\n/* WEBPACK VAR INJECTION */}.call(exports, \"node_modules/devtron\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2RldnRyb24vYXBpLmpzP2M3MWIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQyxVQUFVO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCwyQ0FBMkMsVUFBVTtBQUNyRDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkMsVUFBVTtBQUN2RDtBQUNBLEdBQUc7QUFDSCw2Q0FBNkMsVUFBVTtBQUN2RDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZGV2dHJvbi9hcGkuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcblxuZXhwb3J0cy5pbnN0YWxsID0gKCkgPT4ge1xuICBpZiAocHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgY29uc29sZS5sb2coYEluc3RhbGxpbmcgRGV2dHJvbiBmcm9tICR7X19kaXJuYW1lfWApXG4gICAgaWYgKGVsZWN0cm9uLnJlbW90ZS5Ccm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucyAmJlxuICAgICAgICBlbGVjdHJvbi5yZW1vdGUuQnJvd3NlcldpbmRvdy5nZXREZXZUb29sc0V4dGVuc2lvbnMoKS5kZXZ0cm9uKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBlbGVjdHJvbi5yZW1vdGUuQnJvd3NlcldpbmRvdy5hZGREZXZUb29sc0V4dGVuc2lvbihfX2Rpcm5hbWUpXG4gIH0gZWxzZSBpZiAocHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicpIHtcbiAgICBjb25zb2xlLmxvZyhgSW5zdGFsbGluZyBEZXZ0cm9uIGZyb20gJHtfX2Rpcm5hbWV9YClcbiAgICBpZiAoZWxlY3Ryb24uQnJvd3NlcldpbmRvdy5nZXREZXZUb29sc0V4dGVuc2lvbnMgJiZcbiAgICAgICAgZWxlY3Ryb24uQnJvd3NlcldpbmRvdy5nZXREZXZUb29sc0V4dGVuc2lvbnMoKS5kZXZ0cm9uKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBlbGVjdHJvbi5Ccm93c2VyV2luZG93LmFkZERldlRvb2xzRXh0ZW5zaW9uKF9fZGlybmFtZSlcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0RldnRyb24gY2FuIG9ubHkgYmUgaW5zdGFsbGVkIGZyb20gYW4gRWxlY3Ryb24gcHJvY2Vzcy4nKVxuICB9XG59XG5cbmV4cG9ydHMudW5pbnN0YWxsID0gKCkgPT4ge1xuICBpZiAocHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgY29uc29sZS5sb2coYFVuaW5zdGFsbGluZyBEZXZ0cm9uIGZyb20gJHtfX2Rpcm5hbWV9YClcbiAgICByZXR1cm4gZWxlY3Ryb24ucmVtb3RlLkJyb3dzZXJXaW5kb3cucmVtb3ZlRGV2VG9vbHNFeHRlbnNpb24oJ2RldnRyb24nKVxuICB9IGVsc2UgaWYgKHByb2Nlc3MudHlwZSA9PT0gJ2Jyb3dzZXInKSB7XG4gICAgY29uc29sZS5sb2coYFVuaW5zdGFsbGluZyBEZXZ0cm9uIGZyb20gJHtfX2Rpcm5hbWV9YClcbiAgICByZXR1cm4gZWxlY3Ryb24uQnJvd3NlcldpbmRvdy5yZW1vdmVEZXZUb29sc0V4dGVuc2lvbignZGV2dHJvbicpXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdEZXZ0cm9uIGNhbiBvbmx5IGJlIHVuaW5zdGFsbGVkIGZyb20gYW4gRWxlY3Ryb24gcHJvY2Vzcy4nKVxuICB9XG59XG5cbmV4cG9ydHMucGF0aCA9IF9fZGlybmFtZVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2RldnRyb24vYXBpLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9kZXZ0cm9uL2FwaS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/devtron/api.js\n");

/***/ }),

/***/ "./node_modules/electron-debug/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst electron = __webpack_require__(0);\nconst localShortcut = __webpack_require__(\"./node_modules/electron-localshortcut/index.js\");\nconst isDev = __webpack_require__(\"./node_modules/electron-is-dev/index.js\");\n\nconst app = electron.app;\nconst BrowserWindow = electron.BrowserWindow;\nconst isMacOS = process.platform === 'darwin';\n\nfunction devTools(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.toggleDevTools();\n\t}\n}\n\nfunction openDevTools(win, showDevTools) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\tconst mode = showDevTools === true ? undefined : showDevTools;\n\t\twin.webContents.openDevTools({mode});\n\t}\n}\n\nfunction refresh(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.webContents.reloadIgnoringCache();\n\t}\n}\n\nfunction inspectElements() {\n\tconst win = BrowserWindow.getFocusedWindow();\n\tconst inspect = () => {\n\t\twin.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');\n\t};\n\n\tif (win) {\n\t\tif (win.webContents.isDevToolsOpened()) {\n\t\t\tinspect();\n\t\t} else {\n\t\t\twin.webContents.on('devtools-opened', inspect);\n\t\t\twin.openDevTools();\n\t\t}\n\t}\n}\n\nmodule.exports = opts => {\n\topts = Object.assign({\n\t\tenabled: null,\n\t\tshowDevTools: false\n\t}, opts);\n\n\tif (opts.enabled === false || (opts.enabled === null && !isDev)) {\n\t\treturn;\n\t}\n\n\tapp.on('browser-window-created', (e, win) => {\n\t\tif (opts.showDevTools) {\n\t\t\topenDevTools(win, opts.showDevTools);\n\t\t}\n\t});\n\n\tapp.on('ready', () => {\n\t\t// Activate devtron for the user if they have it installed and it's not already added\n\t\ttry {\n\t\t\tconst devtronAlreadyAdded = BrowserWindow.getDevToolsExtensions &&\n\t\t\t\t{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), 'devtron');\n\n\t\t\tif (!devtronAlreadyAdded) {\n\t\t\t\tBrowserWindow.addDevToolsExtension(__webpack_require__(\"./node_modules/devtron/api.js\").path);\n\t\t\t}\n\t\t} catch (err) {}\n\n\t\tlocalShortcut.register('CmdOrCtrl+Shift+C', inspectElements);\n\t\tlocalShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);\n\t\tlocalShortcut.register('F12', devTools);\n\n\t\tlocalShortcut.register('CmdOrCtrl+R', refresh);\n\t\tlocalShortcut.register('F5', refresh);\n\t});\n};\n\nmodule.exports.refresh = refresh;\nmodule.exports.devTools = devTools;\nmodule.exports.openDevTools = openDevTools;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2VsZWN0cm9uLWRlYnVnL2luZGV4LmpzP2VhNGMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0NBQWdDLEtBQUs7QUFDckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWRlYnVnL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpO1xuY29uc3QgbG9jYWxTaG9ydGN1dCA9IHJlcXVpcmUoJ2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQnKTtcbmNvbnN0IGlzRGV2ID0gcmVxdWlyZSgnZWxlY3Ryb24taXMtZGV2Jyk7XG5cbmNvbnN0IGFwcCA9IGVsZWN0cm9uLmFwcDtcbmNvbnN0IEJyb3dzZXJXaW5kb3cgPSBlbGVjdHJvbi5Ccm93c2VyV2luZG93O1xuY29uc3QgaXNNYWNPUyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nO1xuXG5mdW5jdGlvbiBkZXZUb29scyh3aW4pIHtcblx0d2luID0gd2luIHx8IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpO1xuXG5cdGlmICh3aW4pIHtcblx0XHR3aW4udG9nZ2xlRGV2VG9vbHMoKTtcblx0fVxufVxuXG5mdW5jdGlvbiBvcGVuRGV2VG9vbHMod2luLCBzaG93RGV2VG9vbHMpIHtcblx0d2luID0gd2luIHx8IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpO1xuXG5cdGlmICh3aW4pIHtcblx0XHRjb25zdCBtb2RlID0gc2hvd0RldlRvb2xzID09PSB0cnVlID8gdW5kZWZpbmVkIDogc2hvd0RldlRvb2xzO1xuXHRcdHdpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoe21vZGV9KTtcblx0fVxufVxuXG5mdW5jdGlvbiByZWZyZXNoKHdpbikge1xuXHR3aW4gPSB3aW4gfHwgQnJvd3NlcldpbmRvdy5nZXRGb2N1c2VkV2luZG93KCk7XG5cblx0aWYgKHdpbikge1xuXHRcdHdpbi53ZWJDb250ZW50cy5yZWxvYWRJZ25vcmluZ0NhY2hlKCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gaW5zcGVjdEVsZW1lbnRzKCkge1xuXHRjb25zdCB3aW4gPSBCcm93c2VyV2luZG93LmdldEZvY3VzZWRXaW5kb3coKTtcblx0Y29uc3QgaW5zcGVjdCA9ICgpID0+IHtcblx0XHR3aW4uZGV2VG9vbHNXZWJDb250ZW50cy5leGVjdXRlSmF2YVNjcmlwdCgnRGV2VG9vbHNBUEkuZW50ZXJJbnNwZWN0RWxlbWVudE1vZGUoKScpO1xuXHR9O1xuXG5cdGlmICh3aW4pIHtcblx0XHRpZiAod2luLndlYkNvbnRlbnRzLmlzRGV2VG9vbHNPcGVuZWQoKSkge1xuXHRcdFx0aW5zcGVjdCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW4ud2ViQ29udGVudHMub24oJ2RldnRvb2xzLW9wZW5lZCcsIGluc3BlY3QpO1xuXHRcdFx0d2luLm9wZW5EZXZUb29scygpO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9wdHMgPT4ge1xuXHRvcHRzID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0ZW5hYmxlZDogbnVsbCxcblx0XHRzaG93RGV2VG9vbHM6IGZhbHNlXG5cdH0sIG9wdHMpO1xuXG5cdGlmIChvcHRzLmVuYWJsZWQgPT09IGZhbHNlIHx8IChvcHRzLmVuYWJsZWQgPT09IG51bGwgJiYgIWlzRGV2KSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGFwcC5vbignYnJvd3Nlci13aW5kb3ctY3JlYXRlZCcsIChlLCB3aW4pID0+IHtcblx0XHRpZiAob3B0cy5zaG93RGV2VG9vbHMpIHtcblx0XHRcdG9wZW5EZXZUb29scyh3aW4sIG9wdHMuc2hvd0RldlRvb2xzKTtcblx0XHR9XG5cdH0pO1xuXG5cdGFwcC5vbigncmVhZHknLCAoKSA9PiB7XG5cdFx0Ly8gQWN0aXZhdGUgZGV2dHJvbiBmb3IgdGhlIHVzZXIgaWYgdGhleSBoYXZlIGl0IGluc3RhbGxlZCBhbmQgaXQncyBub3QgYWxyZWFkeSBhZGRlZFxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkZXZ0cm9uQWxyZWFkeUFkZGVkID0gQnJvd3NlcldpbmRvdy5nZXREZXZUb29sc0V4dGVuc2lvbnMgJiZcblx0XHRcdFx0e30uaGFzT3duUHJvcGVydHkuY2FsbChCcm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucygpLCAnZGV2dHJvbicpO1xuXG5cdFx0XHRpZiAoIWRldnRyb25BbHJlYWR5QWRkZWQpIHtcblx0XHRcdFx0QnJvd3NlcldpbmRvdy5hZGREZXZUb29sc0V4dGVuc2lvbihyZXF1aXJlKCdkZXZ0cm9uJykucGF0aCk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXJyKSB7fVxuXG5cdFx0bG9jYWxTaG9ydGN1dC5yZWdpc3RlcignQ21kT3JDdHJsK1NoaWZ0K0MnLCBpbnNwZWN0RWxlbWVudHMpO1xuXHRcdGxvY2FsU2hvcnRjdXQucmVnaXN0ZXIoaXNNYWNPUyA/ICdDbWQrQWx0K0knIDogJ0N0cmwrU2hpZnQrSScsIGRldlRvb2xzKTtcblx0XHRsb2NhbFNob3J0Y3V0LnJlZ2lzdGVyKCdGMTInLCBkZXZUb29scyk7XG5cblx0XHRsb2NhbFNob3J0Y3V0LnJlZ2lzdGVyKCdDbWRPckN0cmwrUicsIHJlZnJlc2gpO1xuXHRcdGxvY2FsU2hvcnRjdXQucmVnaXN0ZXIoJ0Y1JywgcmVmcmVzaCk7XG5cdH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMucmVmcmVzaCA9IHJlZnJlc2g7XG5tb2R1bGUuZXhwb3J0cy5kZXZUb29scyA9IGRldlRvb2xzO1xubW9kdWxlLmV4cG9ydHMub3BlbkRldlRvb2xzID0gb3BlbkRldlRvb2xzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2VsZWN0cm9uLWRlYnVnL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1kZWJ1Zy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-debug/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-accelerator/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)$/;\nconst keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/;\n\nmodule.exports = function (str) {\n\tlet parts = str.split(\"+\");\n\tlet keyFound = false;\n    return parts.every((val, index) => {\n\t\tconst isKey = keyCodes.test(val);\n\t\tconst isModifier = modifiers.test(val);\n\t\tif (isKey) {\n\t\t\t// Key must be unique\n\t\t\tif (keyFound) return false;\n\t\t\tkeyFound = true;\n\t\t}\n\t\t// Key is required\n\t\tif (index === parts.length - 1 && !keyFound) return false;\n        return isKey || isModifier;\n    });\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2VsZWN0cm9uLWlzLWFjY2VsZXJhdG9yL2luZGV4LmpzP2QxOTgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7QUFDQSw2Q0FBNkMsRUFBRSxFQUFFOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWFjY2VsZXJhdG9yL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IG1vZGlmaWVycyA9IC9eKENvbW1hbmR8Q21kfENvbnRyb2x8Q3RybHxDb21tYW5kT3JDb250cm9sfENtZE9yQ3RybHxBbHR8T3B0aW9ufEFsdEdyfFNoaWZ0fFN1cGVyKSQvO1xuY29uc3Qga2V5Q29kZXMgPSAvXihbMC05QS1aKSFAIyQlXiYqKDorPF8+P357fH1cIjs9LFxcLS4vYFtcXFxcXFxdJ118RjEqWzEtOV18RjEwfEYyWzAtNF18UGx1c3xTcGFjZXxUYWJ8QmFja3NwYWNlfERlbGV0ZXxJbnNlcnR8UmV0dXJufEVudGVyfFVwfERvd258TGVmdHxSaWdodHxIb21lfEVuZHxQYWdlVXB8UGFnZURvd258RXNjYXBlfEVzY3xWb2x1bWVVcHxWb2x1bWVEb3dufFZvbHVtZU11dGV8TWVkaWFOZXh0VHJhY2t8TWVkaWFQcmV2aW91c1RyYWNrfE1lZGlhU3RvcHxNZWRpYVBsYXlQYXVzZXxQcmludFNjcmVlbikkLztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdGxldCBwYXJ0cyA9IHN0ci5zcGxpdChcIitcIik7XG5cdGxldCBrZXlGb3VuZCA9IGZhbHNlO1xuICAgIHJldHVybiBwYXJ0cy5ldmVyeSgodmFsLCBpbmRleCkgPT4ge1xuXHRcdGNvbnN0IGlzS2V5ID0ga2V5Q29kZXMudGVzdCh2YWwpO1xuXHRcdGNvbnN0IGlzTW9kaWZpZXIgPSBtb2RpZmllcnMudGVzdCh2YWwpO1xuXHRcdGlmIChpc0tleSkge1xuXHRcdFx0Ly8gS2V5IG11c3QgYmUgdW5pcXVlXG5cdFx0XHRpZiAoa2V5Rm91bmQpIHJldHVybiBmYWxzZTtcblx0XHRcdGtleUZvdW5kID0gdHJ1ZTtcblx0XHR9XG5cdFx0Ly8gS2V5IGlzIHJlcXVpcmVkXG5cdFx0aWYgKGluZGV4ID09PSBwYXJ0cy5sZW5ndGggLSAxICYmICFrZXlGb3VuZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gaXNLZXkgfHwgaXNNb2RpZmllcjtcbiAgICB9KTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZWxlY3Ryb24taXMtYWNjZWxlcmF0b3IvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWlzLWFjY2VsZXJhdG9yL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-is-accelerator/index.js\n");

/***/ }),

/***/ "./node_modules/electron-is-dev/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nmodule.exports = process.defaultApp || /[\\\\/]electron-prebuilt[\\\\/]/.test(process.execPath) || /[\\\\/]electron[\\\\/]/.test(process.execPath);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2VsZWN0cm9uLWlzLWRldi9pbmRleC5qcz9mZTYwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24taXMtZGV2L2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBwcm9jZXNzLmRlZmF1bHRBcHAgfHwgL1tcXFxcL11lbGVjdHJvbi1wcmVidWlsdFtcXFxcL10vLnRlc3QocHJvY2Vzcy5leGVjUGF0aCkgfHwgL1tcXFxcL11lbGVjdHJvbltcXFxcL10vLnRlc3QocHJvY2Vzcy5leGVjUGF0aCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vZWxlY3Ryb24taXMtZGV2L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1pcy1kZXYvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-is-dev/index.js\n");

/***/ }),

/***/ "./node_modules/electron-localshortcut/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst {globalShortcut, BrowserWindow, app} = __webpack_require__(0);\nconst isAccelerator = __webpack_require__(\"./node_modules/electron-is-accelerator/index.js\");\nconst _debug = __webpack_require__(\"./node_modules/debug/src/index.js\");\n\nconst debug = _debug('electron-localshortcut');\nconst windowsWithShortcuts = new WeakMap();\n\n// A placeholder to register shortcuts\n// on any window of the app.\nconst ANY_WINDOW = {};\n\nlet _enableShortcut = shortcut => {\n\tdebug(`Calling globalShortcut.register(${shortcut.accelerator}, ${shortcut.callback.name})`);\n\tglobalShortcut.register(shortcut.accelerator, shortcut.callback);\n\tshortcut.registered = true;\n};\n\nlet _disableShortcut = shortcut => {\n\tdebug(`Calling globalShortcut.unregister(${shortcut.accelerator})`);\n\tglobalShortcut.unregister(shortcut.accelerator);\n\tshortcut.registered = false;\n};\n\nfunction __mockup(enableShortcut, disableShortcut) {\n\t_enableShortcut = enableShortcut;\n\t_disableShortcut = disableShortcut;\n}\n\nfunction _enableWindowAndApp(win) {\n\tdebug(`_enableWindowAndApp ${win.getTitle && win.getTitle()}`);\n\tif (windowsWithShortcuts.has(ANY_WINDOW)) {\n\t\tenableAll(ANY_WINDOW);\n\t}\n\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn;\n\t}\n\n\tenableAll(win);\n}\n\nfunction _disableWindowAndApp(win) {\n\tdebug(`_disableWindowAndApp ${win.getTitle && win.getTitle()}`);\n\tif (windowsWithShortcuts.has(ANY_WINDOW)) {\n\t\tdisableAll(ANY_WINDOW);\n\t}\n\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn;\n\t}\n\n\tdisableAll(win);\n}\n\nfunction _indexOfShortcut(win, accelerator) {\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn -1;\n\t}\n\t_checkAccelerator(accelerator);\n\n\tconst shortcuts = windowsWithShortcuts.get(win);\n\tlet shortcutToUnregisterIdx = -1;\n\tshortcuts.some((s, idx) => {\n\t\tif (s.accelerator === accelerator) {\n\t\t\tshortcutToUnregisterIdx = idx;\n\t\t\treturn true;\n\t\t}\n\t\treturn false;\n\t});\n\treturn shortcutToUnregisterIdx;\n}\n\nfunction _checkAccelerator(accelerator) {\n\tif (!isAccelerator(accelerator)) {\n\t\tconst w = {};\n\t\tError.captureStackTrace(w);\n\t\tconst msg = `\nWARNING: ${accelerator} is not a valid accelerator.\n\n${w.stack.split('\\n').slice(4).join('\\n')}\n`;\n\t\tconsole.error(msg);\n\t}\n}\n\n/**\n * Disable all of the shortcuts registered on the BrowserWindow instance.\nRegistered shortcuts no more works on the `window` instance, but the module keep a reference on them. You can reactivate them later by calling `enableAll` method on the same window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction disableAll(win) {\n\tconst shortcuts = windowsWithShortcuts.get(win);\n\tif (shortcuts) {\n\t\tshortcuts.forEach(_disableShortcut);\n\t}\n}\n\n/**\n * Enable all of the shortcuts registered on the BrowserWindow instance that you had previously disabled calling `disableAll` method.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction enableAll(win) {\n\tconst shortcuts = windowsWithShortcuts.get(win);\n\tif (shortcuts) {\n\t\tshortcuts.forEach(_enableShortcut);\n\t}\n}\n\n/**\n * Unregisters all of the shortcuts registered on any focused BrowserWindow instance. This method does not unregister any shortcut you registered on a particular window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction unregisterAll(win) {\n\tif (win === undefined) {\n\t\t// Unregister shortcuts for any window in the app\n\t\tunregisterAll(ANY_WINDOW);\n\t\treturn;\n\t}\n\n\tif (!windowsWithShortcuts.has(win)) {\n\t\treturn;\n\t}\n\n\tdisableAll(win);\n\twindowsWithShortcuts.delete(win);\n}\n\n/**\n* Registers the shortcut `accelerator`on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to register. This argument could be omitted, in this case the function register the shortcut on all app windows.\n * @param  {String} accelerator - the shortcut to register\n * @param  {Function} callback    This function is called when the shortcut is pressed and the window is focused and not minimized.\n * @return {Undefined}\n */\nfunction register(win, accelerator, callback) {\n\tif (arguments.length === 2 && typeof win === 'string') {\n\t\t// Register shortcut for any window in the app\n\t\t// win = accelerator, accelerator = callback\n\t\tregister(ANY_WINDOW, win, accelerator);\n\t\treturn;\n\t}\n\n\t_checkAccelerator(accelerator);\n\n\tconst newShortcut = {accelerator, callback, registered: false};\n\n\tconst _unregister = because => () => {\n\t\tdebug(`Disabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t\t_disableWindowAndApp(win);\n\t};\n\n\tconst _register = because => () => {\n\t\tdebug(`Enabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t\t_enableWindowAndApp(win);\n\t};\n\n\tif (windowsWithShortcuts.has(win)) {\n\t\tconst shortcuts = windowsWithShortcuts.get(win);\n\t\tshortcuts.push(newShortcut);\n\t} else {\n\t\twindowsWithShortcuts.set(win, [newShortcut]);\n\n\t\tif (win !== ANY_WINDOW) {\n\t\t\twin.on('close', _unregister('the window was closed.'));\n\n\t\t\twin.on('hide', _unregister('the window was hidden.'));\n\n\t\t\twin.on('minimize', _unregister('the window was minimized.'));\n\n\t\t\twin.on('restore', _register('the window was restored from minimized state.'));\n\n\t\t\twin.on('show', _register('the window was showed.'));\n\t\t}\n\t}\n\n\tconst focusedWin = BrowserWindow.getFocusedWindow();\n\tconst registeringAppShortcut = win === ANY_WINDOW;\n\tconst appHasFocus = focusedWin !== null && focusedWin.isVisible();\n\tconst registeringWindowHasFocus = focusedWin === win;\n\tconst registeringWindowIsMinimized = () => focusedWin.isMinimized();\n\n\tif ((registeringAppShortcut && appHasFocus) ||\n\t\t(registeringWindowHasFocus && !registeringWindowIsMinimized())) {\n\t\t_register('the window was focused at shortcut registration.');\n\t}\n}\n\n/**\n * Unregisters the shortcut of `accelerator` registered on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to unregister. This argument could be omitted, in this case the function unregister the shortcut on all app windows. If you registered the shortcut on a particular window instance, it will do nothing.\n * @param  {String} accelerator - the shortcut to unregister\n * @return {Undefined}\n */\nfunction unregister(win, accelerator) {\n\tif (arguments.length === 1 && typeof win === 'string') {\n\t\t// Unregister shortcut for any window in the app\n\t\t// win === accelerator\n\t\tunregister(ANY_WINDOW, win);\n\t\treturn;\n\t}\n\n\t_checkAccelerator(accelerator);\n\n\tconst shortcutToUnregisterIdx = _indexOfShortcut(win, accelerator);\n\n\tif (shortcutToUnregisterIdx !== -1) {\n\t\t_disableShortcut(accelerator);\n\t\tconst shortcuts = windowsWithShortcuts.get(win);\n\t\tshortcuts.splice(shortcutToUnregisterIdx, 1);\n\t}\n}\n\n/**\n * Returns `true` or `false` depending on whether the shortcut `accelerator` is\nregistered on `window`.\n * @param  {BrowserWindow} win - BrowserWindow instance to check. This argument could be omitted, in this case the function returns whether the shortcut `accelerator` is registered on all app windows. If you registered the shortcut on a particular window instance, it return false.\n * @param  {String} accelerator - the shortcut to check\n * @return {Boolean} - if the shortcut `accelerator` is registered on `window`.\n */\nfunction isRegistered(win, accelerator) {\n\tif (arguments.length === 1 && typeof win === 'string') {\n\t\t// Check shortcut for any window in the app\n\t\t// win = accelerator\n\t\treturn isRegistered(ANY_WINDOW, win);\n\t}\n\n\t_checkAccelerator(accelerator);\n\n\treturn _indexOfShortcut(win, accelerator) !== -1;\n}\n\nconst windowBlur = because => (_, win) => {\n\tdebug(`Disabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t_disableWindowAndApp(win);\n};\n\nconst windowFocus = because => (_, win) => {\n\tdebug(`Enabling shortcuts for app and for window '${(win.getTitle && win.getTitle()) || 'No name'}' because ${because}.`);\n\t_enableWindowAndApp(win);\n};\n\napp.on('browser-window-focus', windowFocus('the window gained focus'));\napp.on('browser-window-blur', windowBlur('the window loose focus'));\n\n// All shortcuts should be unregistered by closing the window.\n// just for double check\napp.on('window-all-closed', unregisterAll);\n\nmodule.exports = {\n\tregister,\n\tunregister,\n\tisRegistered,\n\tunregisterAll,\n\tenableAll,\n\tdisableAll,\n\t__mockup\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQvaW5kZXguanM/NDI5ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBLE9BQU8sbUNBQW1DO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMscUJBQXFCLElBQUksdUJBQXVCO0FBQzFGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRDQUE0QyxxQkFBcUI7QUFDakU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLCtCQUErQjtBQUM3RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwrQkFBK0IsK0JBQStCO0FBQzlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxZQUFZOztBQUV2QixFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLGNBQWM7QUFDMUIsWUFBWSxPQUFPO0FBQ25CLFlBQVksU0FBUztBQUNyQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxzQkFBc0I7O0FBRXRCO0FBQ0EsdURBQXVELDhDQUE4QyxZQUFZLFFBQVE7QUFDekg7QUFDQTs7QUFFQTtBQUNBLHNEQUFzRCw4Q0FBOEMsWUFBWSxRQUFRO0FBQ3hIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVksT0FBTztBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNEQUFzRCw4Q0FBOEMsWUFBWSxRQUFRO0FBQ3hIO0FBQ0E7O0FBRUE7QUFDQSxxREFBcUQsOENBQThDLFlBQVksUUFBUTtBQUN2SDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2NhbHNob3J0Y3V0L2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuY29uc3Qge2dsb2JhbFNob3J0Y3V0LCBCcm93c2VyV2luZG93LCBhcHB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbmNvbnN0IGlzQWNjZWxlcmF0b3IgPSByZXF1aXJlKCdlbGVjdHJvbi1pcy1hY2NlbGVyYXRvcicpO1xuY29uc3QgX2RlYnVnID0gcmVxdWlyZSgnZGVidWcnKTtcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQnKTtcbmNvbnN0IHdpbmRvd3NXaXRoU2hvcnRjdXRzID0gbmV3IFdlYWtNYXAoKTtcblxuLy8gQSBwbGFjZWhvbGRlciB0byByZWdpc3RlciBzaG9ydGN1dHNcbi8vIG9uIGFueSB3aW5kb3cgb2YgdGhlIGFwcC5cbmNvbnN0IEFOWV9XSU5ET1cgPSB7fTtcblxubGV0IF9lbmFibGVTaG9ydGN1dCA9IHNob3J0Y3V0ID0+IHtcblx0ZGVidWcoYENhbGxpbmcgZ2xvYmFsU2hvcnRjdXQucmVnaXN0ZXIoJHtzaG9ydGN1dC5hY2NlbGVyYXRvcn0sICR7c2hvcnRjdXQuY2FsbGJhY2submFtZX0pYCk7XG5cdGdsb2JhbFNob3J0Y3V0LnJlZ2lzdGVyKHNob3J0Y3V0LmFjY2VsZXJhdG9yLCBzaG9ydGN1dC5jYWxsYmFjayk7XG5cdHNob3J0Y3V0LnJlZ2lzdGVyZWQgPSB0cnVlO1xufTtcblxubGV0IF9kaXNhYmxlU2hvcnRjdXQgPSBzaG9ydGN1dCA9PiB7XG5cdGRlYnVnKGBDYWxsaW5nIGdsb2JhbFNob3J0Y3V0LnVucmVnaXN0ZXIoJHtzaG9ydGN1dC5hY2NlbGVyYXRvcn0pYCk7XG5cdGdsb2JhbFNob3J0Y3V0LnVucmVnaXN0ZXIoc2hvcnRjdXQuYWNjZWxlcmF0b3IpO1xuXHRzaG9ydGN1dC5yZWdpc3RlcmVkID0gZmFsc2U7XG59O1xuXG5mdW5jdGlvbiBfX21vY2t1cChlbmFibGVTaG9ydGN1dCwgZGlzYWJsZVNob3J0Y3V0KSB7XG5cdF9lbmFibGVTaG9ydGN1dCA9IGVuYWJsZVNob3J0Y3V0O1xuXHRfZGlzYWJsZVNob3J0Y3V0ID0gZGlzYWJsZVNob3J0Y3V0O1xufVxuXG5mdW5jdGlvbiBfZW5hYmxlV2luZG93QW5kQXBwKHdpbikge1xuXHRkZWJ1ZyhgX2VuYWJsZVdpbmRvd0FuZEFwcCAke3dpbi5nZXRUaXRsZSAmJiB3aW4uZ2V0VGl0bGUoKX1gKTtcblx0aWYgKHdpbmRvd3NXaXRoU2hvcnRjdXRzLmhhcyhBTllfV0lORE9XKSkge1xuXHRcdGVuYWJsZUFsbChBTllfV0lORE9XKTtcblx0fVxuXG5cdGlmICghd2luZG93c1dpdGhTaG9ydGN1dHMuaGFzKHdpbikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRlbmFibGVBbGwod2luKTtcbn1cblxuZnVuY3Rpb24gX2Rpc2FibGVXaW5kb3dBbmRBcHAod2luKSB7XG5cdGRlYnVnKGBfZGlzYWJsZVdpbmRvd0FuZEFwcCAke3dpbi5nZXRUaXRsZSAmJiB3aW4uZ2V0VGl0bGUoKX1gKTtcblx0aWYgKHdpbmRvd3NXaXRoU2hvcnRjdXRzLmhhcyhBTllfV0lORE9XKSkge1xuXHRcdGRpc2FibGVBbGwoQU5ZX1dJTkRPVyk7XG5cdH1cblxuXHRpZiAoIXdpbmRvd3NXaXRoU2hvcnRjdXRzLmhhcyh3aW4pKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0ZGlzYWJsZUFsbCh3aW4pO1xufVxuXG5mdW5jdGlvbiBfaW5kZXhPZlNob3J0Y3V0KHdpbiwgYWNjZWxlcmF0b3IpIHtcblx0aWYgKCF3aW5kb3dzV2l0aFNob3J0Y3V0cy5oYXMod2luKSkge1xuXHRcdHJldHVybiAtMTtcblx0fVxuXHRfY2hlY2tBY2NlbGVyYXRvcihhY2NlbGVyYXRvcik7XG5cblx0Y29uc3Qgc2hvcnRjdXRzID0gd2luZG93c1dpdGhTaG9ydGN1dHMuZ2V0KHdpbik7XG5cdGxldCBzaG9ydGN1dFRvVW5yZWdpc3RlcklkeCA9IC0xO1xuXHRzaG9ydGN1dHMuc29tZSgocywgaWR4KSA9PiB7XG5cdFx0aWYgKHMuYWNjZWxlcmF0b3IgPT09IGFjY2VsZXJhdG9yKSB7XG5cdFx0XHRzaG9ydGN1dFRvVW5yZWdpc3RlcklkeCA9IGlkeDtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pO1xuXHRyZXR1cm4gc2hvcnRjdXRUb1VucmVnaXN0ZXJJZHg7XG59XG5cbmZ1bmN0aW9uIF9jaGVja0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKSB7XG5cdGlmICghaXNBY2NlbGVyYXRvcihhY2NlbGVyYXRvcikpIHtcblx0XHRjb25zdCB3ID0ge307XG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2Uodyk7XG5cdFx0Y29uc3QgbXNnID0gYFxuV0FSTklORzogJHthY2NlbGVyYXRvcn0gaXMgbm90IGEgdmFsaWQgYWNjZWxlcmF0b3IuXG5cbiR7dy5zdGFjay5zcGxpdCgnXFxuJykuc2xpY2UoNCkuam9pbignXFxuJyl9XG5gO1xuXHRcdGNvbnNvbGUuZXJyb3IobXNnKTtcblx0fVxufVxuXG4vKipcbiAqIERpc2FibGUgYWxsIG9mIHRoZSBzaG9ydGN1dHMgcmVnaXN0ZXJlZCBvbiB0aGUgQnJvd3NlcldpbmRvdyBpbnN0YW5jZS5cblJlZ2lzdGVyZWQgc2hvcnRjdXRzIG5vIG1vcmUgd29ya3Mgb24gdGhlIGB3aW5kb3dgIGluc3RhbmNlLCBidXQgdGhlIG1vZHVsZSBrZWVwIGEgcmVmZXJlbmNlIG9uIHRoZW0uIFlvdSBjYW4gcmVhY3RpdmF0ZSB0aGVtIGxhdGVyIGJ5IGNhbGxpbmcgYGVuYWJsZUFsbGAgbWV0aG9kIG9uIHRoZSBzYW1lIHdpbmRvdyBpbnN0YW5jZS5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiBCcm93c2VyV2luZG93IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGRpc2FibGVBbGwod2luKSB7XG5cdGNvbnN0IHNob3J0Y3V0cyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3aW4pO1xuXHRpZiAoc2hvcnRjdXRzKSB7XG5cdFx0c2hvcnRjdXRzLmZvckVhY2goX2Rpc2FibGVTaG9ydGN1dCk7XG5cdH1cbn1cblxuLyoqXG4gKiBFbmFibGUgYWxsIG9mIHRoZSBzaG9ydGN1dHMgcmVnaXN0ZXJlZCBvbiB0aGUgQnJvd3NlcldpbmRvdyBpbnN0YW5jZSB0aGF0IHlvdSBoYWQgcHJldmlvdXNseSBkaXNhYmxlZCBjYWxsaW5nIGBkaXNhYmxlQWxsYCBtZXRob2QuXG4gKiBAcGFyYW0gIHtCcm93c2VyV2luZG93fSB3aW4gQnJvd3NlcldpbmRvdyBpbnN0YW5jZVxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiBlbmFibGVBbGwod2luKSB7XG5cdGNvbnN0IHNob3J0Y3V0cyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3aW4pO1xuXHRpZiAoc2hvcnRjdXRzKSB7XG5cdFx0c2hvcnRjdXRzLmZvckVhY2goX2VuYWJsZVNob3J0Y3V0KTtcblx0fVxufVxuXG4vKipcbiAqIFVucmVnaXN0ZXJzIGFsbCBvZiB0aGUgc2hvcnRjdXRzIHJlZ2lzdGVyZWQgb24gYW55IGZvY3VzZWQgQnJvd3NlcldpbmRvdyBpbnN0YW5jZS4gVGhpcyBtZXRob2QgZG9lcyBub3QgdW5yZWdpc3RlciBhbnkgc2hvcnRjdXQgeW91IHJlZ2lzdGVyZWQgb24gYSBwYXJ0aWN1bGFyIHdpbmRvdyBpbnN0YW5jZS5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiBCcm93c2VyV2luZG93IGluc3RhbmNlXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIHVucmVnaXN0ZXJBbGwod2luKSB7XG5cdGlmICh3aW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdC8vIFVucmVnaXN0ZXIgc2hvcnRjdXRzIGZvciBhbnkgd2luZG93IGluIHRoZSBhcHBcblx0XHR1bnJlZ2lzdGVyQWxsKEFOWV9XSU5ET1cpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmICghd2luZG93c1dpdGhTaG9ydGN1dHMuaGFzKHdpbikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRkaXNhYmxlQWxsKHdpbik7XG5cdHdpbmRvd3NXaXRoU2hvcnRjdXRzLmRlbGV0ZSh3aW4pO1xufVxuXG4vKipcbiogUmVnaXN0ZXJzIHRoZSBzaG9ydGN1dCBgYWNjZWxlcmF0b3Jgb24gdGhlIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2UuXG4gKiBAcGFyYW0gIHtCcm93c2VyV2luZG93fSB3aW4gLSBCcm93c2VyV2luZG93IGluc3RhbmNlIHRvIHJlZ2lzdGVyLiBUaGlzIGFyZ3VtZW50IGNvdWxkIGJlIG9taXR0ZWQsIGluIHRoaXMgY2FzZSB0aGUgZnVuY3Rpb24gcmVnaXN0ZXIgdGhlIHNob3J0Y3V0IG9uIGFsbCBhcHAgd2luZG93cy5cbiAqIEBwYXJhbSAge1N0cmluZ30gYWNjZWxlcmF0b3IgLSB0aGUgc2hvcnRjdXQgdG8gcmVnaXN0ZXJcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayAgICBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHRoZSBzaG9ydGN1dCBpcyBwcmVzc2VkIGFuZCB0aGUgd2luZG93IGlzIGZvY3VzZWQgYW5kIG5vdCBtaW5pbWl6ZWQuXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIHJlZ2lzdGVyKHdpbiwgYWNjZWxlcmF0b3IsIGNhbGxiYWNrKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIHR5cGVvZiB3aW4gPT09ICdzdHJpbmcnKSB7XG5cdFx0Ly8gUmVnaXN0ZXIgc2hvcnRjdXQgZm9yIGFueSB3aW5kb3cgaW4gdGhlIGFwcFxuXHRcdC8vIHdpbiA9IGFjY2VsZXJhdG9yLCBhY2NlbGVyYXRvciA9IGNhbGxiYWNrXG5cdFx0cmVnaXN0ZXIoQU5ZX1dJTkRPVywgd2luLCBhY2NlbGVyYXRvcik7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0X2NoZWNrQWNjZWxlcmF0b3IoYWNjZWxlcmF0b3IpO1xuXG5cdGNvbnN0IG5ld1Nob3J0Y3V0ID0ge2FjY2VsZXJhdG9yLCBjYWxsYmFjaywgcmVnaXN0ZXJlZDogZmFsc2V9O1xuXG5cdGNvbnN0IF91bnJlZ2lzdGVyID0gYmVjYXVzZSA9PiAoKSA9PiB7XG5cdFx0ZGVidWcoYERpc2FibGluZyBzaG9ydGN1dHMgZm9yIGFwcCBhbmQgZm9yIHdpbmRvdyAnJHsod2luLmdldFRpdGxlICYmIHdpbi5nZXRUaXRsZSgpKSB8fCAnTm8gbmFtZSd9JyBiZWNhdXNlICR7YmVjYXVzZX0uYCk7XG5cdFx0X2Rpc2FibGVXaW5kb3dBbmRBcHAod2luKTtcblx0fTtcblxuXHRjb25zdCBfcmVnaXN0ZXIgPSBiZWNhdXNlID0+ICgpID0+IHtcblx0XHRkZWJ1ZyhgRW5hYmxpbmcgc2hvcnRjdXRzIGZvciBhcHAgYW5kIGZvciB3aW5kb3cgJyR7KHdpbi5nZXRUaXRsZSAmJiB3aW4uZ2V0VGl0bGUoKSkgfHwgJ05vIG5hbWUnfScgYmVjYXVzZSAke2JlY2F1c2V9LmApO1xuXHRcdF9lbmFibGVXaW5kb3dBbmRBcHAod2luKTtcblx0fTtcblxuXHRpZiAod2luZG93c1dpdGhTaG9ydGN1dHMuaGFzKHdpbikpIHtcblx0XHRjb25zdCBzaG9ydGN1dHMgPSB3aW5kb3dzV2l0aFNob3J0Y3V0cy5nZXQod2luKTtcblx0XHRzaG9ydGN1dHMucHVzaChuZXdTaG9ydGN1dCk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93c1dpdGhTaG9ydGN1dHMuc2V0KHdpbiwgW25ld1Nob3J0Y3V0XSk7XG5cblx0XHRpZiAod2luICE9PSBBTllfV0lORE9XKSB7XG5cdFx0XHR3aW4ub24oJ2Nsb3NlJywgX3VucmVnaXN0ZXIoJ3RoZSB3aW5kb3cgd2FzIGNsb3NlZC4nKSk7XG5cblx0XHRcdHdpbi5vbignaGlkZScsIF91bnJlZ2lzdGVyKCd0aGUgd2luZG93IHdhcyBoaWRkZW4uJykpO1xuXG5cdFx0XHR3aW4ub24oJ21pbmltaXplJywgX3VucmVnaXN0ZXIoJ3RoZSB3aW5kb3cgd2FzIG1pbmltaXplZC4nKSk7XG5cblx0XHRcdHdpbi5vbigncmVzdG9yZScsIF9yZWdpc3RlcigndGhlIHdpbmRvdyB3YXMgcmVzdG9yZWQgZnJvbSBtaW5pbWl6ZWQgc3RhdGUuJykpO1xuXG5cdFx0XHR3aW4ub24oJ3Nob3cnLCBfcmVnaXN0ZXIoJ3RoZSB3aW5kb3cgd2FzIHNob3dlZC4nKSk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgZm9jdXNlZFdpbiA9IEJyb3dzZXJXaW5kb3cuZ2V0Rm9jdXNlZFdpbmRvdygpO1xuXHRjb25zdCByZWdpc3RlcmluZ0FwcFNob3J0Y3V0ID0gd2luID09PSBBTllfV0lORE9XO1xuXHRjb25zdCBhcHBIYXNGb2N1cyA9IGZvY3VzZWRXaW4gIT09IG51bGwgJiYgZm9jdXNlZFdpbi5pc1Zpc2libGUoKTtcblx0Y29uc3QgcmVnaXN0ZXJpbmdXaW5kb3dIYXNGb2N1cyA9IGZvY3VzZWRXaW4gPT09IHdpbjtcblx0Y29uc3QgcmVnaXN0ZXJpbmdXaW5kb3dJc01pbmltaXplZCA9ICgpID0+IGZvY3VzZWRXaW4uaXNNaW5pbWl6ZWQoKTtcblxuXHRpZiAoKHJlZ2lzdGVyaW5nQXBwU2hvcnRjdXQgJiYgYXBwSGFzRm9jdXMpIHx8XG5cdFx0KHJlZ2lzdGVyaW5nV2luZG93SGFzRm9jdXMgJiYgIXJlZ2lzdGVyaW5nV2luZG93SXNNaW5pbWl6ZWQoKSkpIHtcblx0XHRfcmVnaXN0ZXIoJ3RoZSB3aW5kb3cgd2FzIGZvY3VzZWQgYXQgc2hvcnRjdXQgcmVnaXN0cmF0aW9uLicpO1xuXHR9XG59XG5cbi8qKlxuICogVW5yZWdpc3RlcnMgdGhlIHNob3J0Y3V0IG9mIGBhY2NlbGVyYXRvcmAgcmVnaXN0ZXJlZCBvbiB0aGUgQnJvd3NlcldpbmRvdyBpbnN0YW5jZS5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiAtIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2UgdG8gdW5yZWdpc3Rlci4gVGhpcyBhcmd1bWVudCBjb3VsZCBiZSBvbWl0dGVkLCBpbiB0aGlzIGNhc2UgdGhlIGZ1bmN0aW9uIHVucmVnaXN0ZXIgdGhlIHNob3J0Y3V0IG9uIGFsbCBhcHAgd2luZG93cy4gSWYgeW91IHJlZ2lzdGVyZWQgdGhlIHNob3J0Y3V0IG9uIGEgcGFydGljdWxhciB3aW5kb3cgaW5zdGFuY2UsIGl0IHdpbGwgZG8gbm90aGluZy5cbiAqIEBwYXJhbSAge1N0cmluZ30gYWNjZWxlcmF0b3IgLSB0aGUgc2hvcnRjdXQgdG8gdW5yZWdpc3RlclxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5mdW5jdGlvbiB1bnJlZ2lzdGVyKHdpbiwgYWNjZWxlcmF0b3IpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHdpbiA9PT0gJ3N0cmluZycpIHtcblx0XHQvLyBVbnJlZ2lzdGVyIHNob3J0Y3V0IGZvciBhbnkgd2luZG93IGluIHRoZSBhcHBcblx0XHQvLyB3aW4gPT09IGFjY2VsZXJhdG9yXG5cdFx0dW5yZWdpc3RlcihBTllfV0lORE9XLCB3aW4pO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdF9jaGVja0FjY2VsZXJhdG9yKGFjY2VsZXJhdG9yKTtcblxuXHRjb25zdCBzaG9ydGN1dFRvVW5yZWdpc3RlcklkeCA9IF9pbmRleE9mU2hvcnRjdXQod2luLCBhY2NlbGVyYXRvcik7XG5cblx0aWYgKHNob3J0Y3V0VG9VbnJlZ2lzdGVySWR4ICE9PSAtMSkge1xuXHRcdF9kaXNhYmxlU2hvcnRjdXQoYWNjZWxlcmF0b3IpO1xuXHRcdGNvbnN0IHNob3J0Y3V0cyA9IHdpbmRvd3NXaXRoU2hvcnRjdXRzLmdldCh3aW4pO1xuXHRcdHNob3J0Y3V0cy5zcGxpY2Uoc2hvcnRjdXRUb1VucmVnaXN0ZXJJZHgsIDEpO1xuXHR9XG59XG5cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgb3IgYGZhbHNlYCBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgc2hvcnRjdXQgYGFjY2VsZXJhdG9yYCBpc1xucmVnaXN0ZXJlZCBvbiBgd2luZG93YC5cbiAqIEBwYXJhbSAge0Jyb3dzZXJXaW5kb3d9IHdpbiAtIEJyb3dzZXJXaW5kb3cgaW5zdGFuY2UgdG8gY2hlY2suIFRoaXMgYXJndW1lbnQgY291bGQgYmUgb21pdHRlZCwgaW4gdGhpcyBjYXNlIHRoZSBmdW5jdGlvbiByZXR1cm5zIHdoZXRoZXIgdGhlIHNob3J0Y3V0IGBhY2NlbGVyYXRvcmAgaXMgcmVnaXN0ZXJlZCBvbiBhbGwgYXBwIHdpbmRvd3MuIElmIHlvdSByZWdpc3RlcmVkIHRoZSBzaG9ydGN1dCBvbiBhIHBhcnRpY3VsYXIgd2luZG93IGluc3RhbmNlLCBpdCByZXR1cm4gZmFsc2UuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGFjY2VsZXJhdG9yIC0gdGhlIHNob3J0Y3V0IHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufSAtIGlmIHRoZSBzaG9ydGN1dCBgYWNjZWxlcmF0b3JgIGlzIHJlZ2lzdGVyZWQgb24gYHdpbmRvd2AuXG4gKi9cbmZ1bmN0aW9uIGlzUmVnaXN0ZXJlZCh3aW4sIGFjY2VsZXJhdG9yKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiB3aW4gPT09ICdzdHJpbmcnKSB7XG5cdFx0Ly8gQ2hlY2sgc2hvcnRjdXQgZm9yIGFueSB3aW5kb3cgaW4gdGhlIGFwcFxuXHRcdC8vIHdpbiA9IGFjY2VsZXJhdG9yXG5cdFx0cmV0dXJuIGlzUmVnaXN0ZXJlZChBTllfV0lORE9XLCB3aW4pO1xuXHR9XG5cblx0X2NoZWNrQWNjZWxlcmF0b3IoYWNjZWxlcmF0b3IpO1xuXG5cdHJldHVybiBfaW5kZXhPZlNob3J0Y3V0KHdpbiwgYWNjZWxlcmF0b3IpICE9PSAtMTtcbn1cblxuY29uc3Qgd2luZG93Qmx1ciA9IGJlY2F1c2UgPT4gKF8sIHdpbikgPT4ge1xuXHRkZWJ1ZyhgRGlzYWJsaW5nIHNob3J0Y3V0cyBmb3IgYXBwIGFuZCBmb3Igd2luZG93ICckeyh3aW4uZ2V0VGl0bGUgJiYgd2luLmdldFRpdGxlKCkpIHx8ICdObyBuYW1lJ30nIGJlY2F1c2UgJHtiZWNhdXNlfS5gKTtcblx0X2Rpc2FibGVXaW5kb3dBbmRBcHAod2luKTtcbn07XG5cbmNvbnN0IHdpbmRvd0ZvY3VzID0gYmVjYXVzZSA9PiAoXywgd2luKSA9PiB7XG5cdGRlYnVnKGBFbmFibGluZyBzaG9ydGN1dHMgZm9yIGFwcCBhbmQgZm9yIHdpbmRvdyAnJHsod2luLmdldFRpdGxlICYmIHdpbi5nZXRUaXRsZSgpKSB8fCAnTm8gbmFtZSd9JyBiZWNhdXNlICR7YmVjYXVzZX0uYCk7XG5cdF9lbmFibGVXaW5kb3dBbmRBcHAod2luKTtcbn07XG5cbmFwcC5vbignYnJvd3Nlci13aW5kb3ctZm9jdXMnLCB3aW5kb3dGb2N1cygndGhlIHdpbmRvdyBnYWluZWQgZm9jdXMnKSk7XG5hcHAub24oJ2Jyb3dzZXItd2luZG93LWJsdXInLCB3aW5kb3dCbHVyKCd0aGUgd2luZG93IGxvb3NlIGZvY3VzJykpO1xuXG4vLyBBbGwgc2hvcnRjdXRzIHNob3VsZCBiZSB1bnJlZ2lzdGVyZWQgYnkgY2xvc2luZyB0aGUgd2luZG93LlxuLy8ganVzdCBmb3IgZG91YmxlIGNoZWNrXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgdW5yZWdpc3RlckFsbCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZWdpc3Rlcixcblx0dW5yZWdpc3Rlcixcblx0aXNSZWdpc3RlcmVkLFxuXHR1bnJlZ2lzdGVyQWxsLFxuXHRlbmFibGVBbGwsXG5cdGRpc2FibGVBbGwsXG5cdF9fbW9ja3VwXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvY2Fsc2hvcnRjdXQvaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-localshortcut/index.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/electron-main-hmr/main-hmr.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(6).install();\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\nif (socketPath == null) {\n    throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n}\n// module, but not relative path must be used (because this file is used as entry)\nconst HmrClient = __webpack_require__(2).HmrClient;\n// tslint:disable:no-unused-expression\nnew HmrClient(socketPath, module.hot, () => {\n    return __webpack_require__.h();\n});\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2VsZWN0cm9uLXdlYnBhY2svZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/OGJlNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi13ZWJwYWNrL2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcbmNvbnN0IHNvY2tldFBhdGggPSBwcm9jZXNzLmVudi5FTEVDVFJPTl9ITVJfU09DS0VUX1BBVEg7XG5pZiAoc29ja2V0UGF0aCA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBbSE1SXSBFbnYgRUxFQ1RST05fSE1SX1NPQ0tFVF9QQVRIIGlzIG5vdCBzZXRgKTtcbn1cbi8vIG1vZHVsZSwgYnV0IG5vdCByZWxhdGl2ZSBwYXRoIG11c3QgYmUgdXNlZCAoYmVjYXVzZSB0aGlzIGZpbGUgaXMgdXNlZCBhcyBlbnRyeSlcbmNvbnN0IEhtckNsaWVudCA9IHJlcXVpcmUoXCJlbGVjdHJvbi13ZWJwYWNrL2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7XG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtZXhwcmVzc2lvblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gICAgcmV0dXJuIF9fd2VicGFja19oYXNoX187XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1haW4taG1yLmpzLm1hcFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9lbGVjdHJvbi13ZWJwYWNrL2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi13ZWJwYWNrL2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./node_modules/ms/index.js":
/***/ (function(module, exports) {

eval("/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} [options]\n * @throws {Error} throw an error if val is not a non-empty string or a number\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options) {\n  options = options || {};\n  var type = typeof val;\n  if (type === 'string' && val.length > 0) {\n    return parse(val);\n  } else if (type === 'number' && isNaN(val) === false) {\n    return options.long ? fmtLong(val) : fmtShort(val);\n  }\n  throw new Error(\n    'val is not a non-empty string or a valid number. val=' +\n      JSON.stringify(val)\n  );\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  str = String(str);\n  if (str.length > 100) {\n    return;\n  }\n  var match = /^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(\n    str\n  );\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'yrs':\n    case 'yr':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'hrs':\n    case 'hr':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'mins':\n    case 'min':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 'secs':\n    case 'sec':\n    case 's':\n      return n * s;\n    case 'milliseconds':\n    case 'millisecond':\n    case 'msecs':\n    case 'msec':\n    case 'ms':\n      return n;\n    default:\n      return undefined;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtShort(ms) {\n  if (ms >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (ms >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (ms >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (ms >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtLong(ms) {\n  return plural(ms, d, 'day') ||\n    plural(ms, h, 'hour') ||\n    plural(ms, m, 'minute') ||\n    plural(ms, s, 'second') ||\n    ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, n, name) {\n  if (ms < n) {\n    return;\n  }\n  if (ms < n * 1.5) {\n    return Math.floor(ms / n) + ' ' + name;\n  }\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L21zL2luZGV4LmpzPzZkMzYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxPQUFPO0FBQ2xCLFlBQVksTUFBTTtBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL21zL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBIZWxwZXJzLlxuICovXG5cbnZhciBzID0gMTAwMDtcbnZhciBtID0gcyAqIDYwO1xudmFyIGggPSBtICogNjA7XG52YXIgZCA9IGggKiAyNDtcbnZhciB5ID0gZCAqIDM2NS4yNTtcblxuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEB0aHJvd3Mge0Vycm9yfSB0aHJvdyBhbiBlcnJvciBpZiB2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIG51bWJlclxuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHBhcnNlKHZhbCk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNOYU4odmFsKSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5sb25nID8gZm10TG9uZyh2YWwpIDogZm10U2hvcnQodmFsKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgJ3ZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgdmFsaWQgbnVtYmVyLiB2YWw9JyArXG4gICAgICBKU09OLnN0cmluZ2lmeSh2YWwpXG4gICk7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIGlmIChzdHIubGVuZ3RoID4gMTAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBtYXRjaCA9IC9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ2RheXMnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnZCc6XG4gICAgICByZXR1cm4gbiAqIGQ7XG4gICAgY2FzZSAnaG91cnMnOlxuICAgIGNhc2UgJ2hvdXInOlxuICAgIGNhc2UgJ2hycyc6XG4gICAgY2FzZSAnaHInOlxuICAgIGNhc2UgJ2gnOlxuICAgICAgcmV0dXJuIG4gKiBoO1xuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgY2FzZSAnbWlucyc6XG4gICAgY2FzZSAnbWluJzpcbiAgICBjYXNlICdtJzpcbiAgICAgIHJldHVybiBuICogbTtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdzZWNvbmQnOlxuICAgIGNhc2UgJ3NlY3MnOlxuICAgIGNhc2UgJ3NlYyc6XG4gICAgY2FzZSAncyc6XG4gICAgICByZXR1cm4gbiAqIHM7XG4gICAgY2FzZSAnbWlsbGlzZWNvbmRzJzpcbiAgICBjYXNlICdtaWxsaXNlY29uZCc6XG4gICAgY2FzZSAnbXNlY3MnOlxuICAgIGNhc2UgJ21zZWMnOlxuICAgIGNhc2UgJ21zJzpcbiAgICAgIHJldHVybiBuO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogU2hvcnQgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10U2hvcnQobXMpIHtcbiAgaWYgKG1zID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtcyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHJldHVybiBwbHVyYWwobXMsIGQsICdkYXknKSB8fFxuICAgIHBsdXJhbChtcywgaCwgJ2hvdXInKSB8fFxuICAgIHBsdXJhbChtcywgbSwgJ21pbnV0ZScpIHx8XG4gICAgcGx1cmFsKG1zLCBzLCAnc2Vjb25kJykgfHxcbiAgICBtcyArICcgbXMnO1xufVxuXG4vKipcbiAqIFBsdXJhbGl6YXRpb24gaGVscGVyLlxuICovXG5cbmZ1bmN0aW9uIHBsdXJhbChtcywgbiwgbmFtZSkge1xuICBpZiAobXMgPCBuKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChtcyA8IG4gKiAxLjUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihtcyAvIG4pICsgJyAnICsgbmFtZTtcbiAgfVxuICByZXR1cm4gTWF0aC5jZWlsKG1zIC8gbikgKyAnICcgKyBuYW1lICsgJ3MnO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L21zL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/ms/index.js\n");

/***/ }),

/***/ "./src/main/index.dev.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nprocess.env.NODE_ENV = 'development';\n\n__webpack_require__(\"./node_modules/electron-debug/index.js\")({ showDevTools: true });\n\n__webpack_require__(0).app.on('ready', () => {\n  let installExtension = __webpack_require__(1);\n  installExtension.default(installExtension.VUEJS_DEVTOOLS).then(() => {}).catch(err => {\n    console.log('Unable to install `vue-devtools`: \\n', err);\n  });\n});\n\n__webpack_require__(\"./src/main/index.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5kZXYuanM/NzMzNiJdLCJuYW1lcyI6WyJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyZXF1aXJlIiwic2hvd0RldlRvb2xzIiwiYXBwIiwib24iLCJpbnN0YWxsRXh0ZW5zaW9uIiwiZGVmYXVsdCIsIlZVRUpTX0RFVlRPT0xTIiwidGhlbiIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7QUFVQUEsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEdBQXVCLGFBQXZCOztBQUdBLG1CQUFBQyxDQUFRLHdDQUFSLEVBQTBCLEVBQUVDLGNBQWMsSUFBaEIsRUFBMUI7O0FBR0EsbUJBQUFELENBQVEsQ0FBUixFQUFvQkUsR0FBcEIsQ0FBd0JDLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DLE1BQU07QUFDeEMsTUFBSUMsbUJBQW1CLG1CQUFBSixDQUFRLENBQVIsQ0FBdkI7QUFDQUksbUJBQWlCQyxPQUFqQixDQUF5QkQsaUJBQWlCRSxjQUExQyxFQUNHQyxJQURILENBQ1EsTUFBTSxDQUFFLENBRGhCLEVBRUdDLEtBRkgsQ0FFU0MsT0FBTztBQUNaQyxZQUFRQyxHQUFSLENBQVksc0NBQVosRUFBb0RGLEdBQXBEO0FBQ0QsR0FKSDtBQUtELENBUEQ7O0FBVUEsbUJBQUFULENBQVEscUJBQVIiLCJmaWxlIjoiLi9zcmMvbWFpbi9pbmRleC5kZXYuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgZmlsZSBpcyB1c2VkIHNwZWNpZmljYWxseSBhbmQgb25seSBmb3IgZGV2ZWxvcG1lbnQuIEl0IGluc3RhbGxzXG4gKiBgZWxlY3Ryb24tZGVidWdgICYgYHZ1ZS1kZXZ0b29sc2AuIFRoZXJlIHNob3VsZG4ndCBiZSBhbnkgbmVlZCB0b1xuICogIG1vZGlmeSB0aGlzIGZpbGUsIGJ1dCBpdCBjYW4gYmUgdXNlZCB0byBleHRlbmQgeW91ciBkZXZlbG9wbWVudFxuICogIGVudmlyb25tZW50LlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbi8vIFNldCBlbnZpcm9ubWVudCBmb3IgZGV2ZWxvcG1lbnRcbnByb2Nlc3MuZW52Lk5PREVfRU5WID0gJ2RldmVsb3BtZW50J1xuXG4vLyBJbnN0YWxsIGBlbGVjdHJvbi1kZWJ1Z2Agd2l0aCBgZGV2dHJvbmBcbnJlcXVpcmUoJ2VsZWN0cm9uLWRlYnVnJykoeyBzaG93RGV2VG9vbHM6IHRydWUgfSlcblxuLy8gSW5zdGFsbCBgdnVlLWRldnRvb2xzYFxucmVxdWlyZSgnZWxlY3Ryb24nKS5hcHAub24oJ3JlYWR5JywgKCkgPT4ge1xuICBsZXQgaW5zdGFsbEV4dGVuc2lvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlcicpXG4gIGluc3RhbGxFeHRlbnNpb24uZGVmYXVsdChpbnN0YWxsRXh0ZW5zaW9uLlZVRUpTX0RFVlRPT0xTKVxuICAgIC50aGVuKCgpID0+IHt9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBpbnN0YWxsIGB2dWUtZGV2dG9vbHNgOiBcXG4nLCBlcnIpXG4gICAgfSlcbn0pXG5cbi8vIFJlcXVpcmUgYG1haW5gIHByb2Nlc3MgdG8gYm9vdCBhcHBcbnJlcXVpcmUoJy4vaW5kZXgnKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4vaW5kZXguZGV2LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/index.dev.js\n");

/***/ }),

/***/ "./src/main/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\n\nvar _electron = __webpack_require__(0);\n\nvar _menu = __webpack_require__(\"./src/main/menu.js\");\n\nvar _menu2 = _interopRequireDefault(_menu);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nlet mainWindow;\n\nfunction sendEventToWindow(channel, ...args) {\n\tif (mainWindow && mainWindow.webContents) {\n\t\tmainWindow.webContents.send(channel, ...args);\n\t}\n}\n\nfunction makeMenuClickable(menu) {\n\treturn menu.map(item => {\n\t\tif (item.submenu !== undefined) {\n\t\t\titem.submenu = makeMenuClickable(item.submenu);\n\t\t}\n\n\t\tif (!item.click) {\n\t\t\titem.click = (...args) => sendEventToWindow('appMenu-onclick', ...args);\n\t\t}\n\t\treturn item;\n\t});\n}\n\n_electron.Menu.setApplicationMenu(_electron.Menu.buildFromTemplate(makeMenuClickable(_menu2.default)));\n\nif (process.env.NODE_ENV !== 'development') {\n\tglobal.__static = __webpack_require__(5).join(__dirname, '/static').replace(/\\\\/g, '\\\\\\\\');\n}\n\nconst winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;\n\nfunction createWindow() {\n\tmainWindow = new _electron.BrowserWindow({\n\t\theight: 563,\n\t\tuseContentSize: true,\n\t\twidth: 1000\n\t});\n\n\tmainWindow.loadURL(winURL);\n\n\tmainWindow.on('closed', () => {\n\t\tmainWindow = null;\n\t});\n}\n\n_electron.app.on('ready', createWindow);\n\n_electron.app.on('window-all-closed', () => {\n\tif (process.platform !== 'darwin') {\n\t\t_electron.app.quit();\n\t}\n});\n\n_electron.app.on('activate', () => {\n\tif (mainWindow === null) {\n\t\tcreateWindow();\n\t}\n});\n/* WEBPACK VAR INJECTION */}.call(exports, \"src/main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5qcz8yYmY2Il0sIm5hbWVzIjpbIm1haW5XaW5kb3ciLCJzZW5kRXZlbnRUb1dpbmRvdyIsImNoYW5uZWwiLCJhcmdzIiwid2ViQ29udGVudHMiLCJzZW5kIiwibWFrZU1lbnVDbGlja2FibGUiLCJtZW51IiwibWFwIiwiaXRlbSIsInN1Ym1lbnUiLCJ1bmRlZmluZWQiLCJjbGljayIsInNldEFwcGxpY2F0aW9uTWVudSIsImJ1aWxkRnJvbVRlbXBsYXRlIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiZ2xvYmFsIiwiX19zdGF0aWMiLCJyZXF1aXJlIiwiam9pbiIsIl9fZGlybmFtZSIsInJlcGxhY2UiLCJ3aW5VUkwiLCJjcmVhdGVXaW5kb3ciLCJoZWlnaHQiLCJ1c2VDb250ZW50U2l6ZSIsIndpZHRoIiwibG9hZFVSTCIsIm9uIiwicGxhdGZvcm0iLCJxdWl0Il0sIm1hcHBpbmdzIjoiaURBQUE7O0FBRUE7O0FBQ0E7Ozs7OztBQUVBLElBQUlBLFVBQUo7O0FBRUEsU0FBU0MsaUJBQVQsQ0FBNEJDLE9BQTVCLEVBQXFDLEdBQUdDLElBQXhDLEVBQThDO0FBQzdDLEtBQUlILGNBQWNBLFdBQVdJLFdBQTdCLEVBQTBDO0FBQ3pDSixhQUFXSSxXQUFYLENBQXVCQyxJQUF2QixDQUE0QkgsT0FBNUIsRUFBcUMsR0FBR0MsSUFBeEM7QUFDQTtBQUNEOztBQUVELFNBQVNHLGlCQUFULENBQTRCQyxJQUE1QixFQUFrQztBQUNqQyxRQUFPQSxLQUFLQyxHQUFMLENBQVNDLFFBQVE7QUFDdkIsTUFBSUEsS0FBS0MsT0FBTCxLQUFpQkMsU0FBckIsRUFBZ0M7QUFDL0JGLFFBQUtDLE9BQUwsR0FBZUosa0JBQWtCRyxLQUFLQyxPQUF2QixDQUFmO0FBQ0E7O0FBRUQsTUFBSSxDQUFDRCxLQUFLRyxLQUFWLEVBQWlCO0FBQ2hCSCxRQUFLRyxLQUFMLEdBQWEsQ0FBQyxHQUFHVCxJQUFKLEtBQWFGLGtCQUFrQixpQkFBbEIsRUFBcUMsR0FBR0UsSUFBeEMsQ0FBMUI7QUFDQTtBQUNELFNBQU9NLElBQVA7QUFDQSxFQVRNLENBQVA7QUFVQTs7QUFFRCxlQUFLSSxrQkFBTCxDQUF3QixlQUFLQyxpQkFBTCxDQUF1QlIsaUNBQXZCLENBQXhCOztBQU1BLElBQUlTLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixhQUE3QixFQUE0QztBQUMzQ0MsUUFBT0MsUUFBUCxHQUFrQixtQkFBQUMsQ0FBUSxDQUFSLEVBQWdCQyxJQUFoQixDQUFxQkMsU0FBckIsRUFBZ0MsU0FBaEMsRUFBMkNDLE9BQTNDLENBQW1ELEtBQW5ELEVBQTBELE1BQTFELENBQWxCO0FBQ0E7O0FBRUQsTUFBTUMsU0FBU1QsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLGFBQXpCLEdBQ1gsdUJBRFcsR0FFWCxVQUFTSyxTQUFVLGFBRnZCOztBQUlBLFNBQVNHLFlBQVQsR0FBeUI7QUFJeEJ6QixjQUFhLDRCQUFrQjtBQUM5QjBCLFVBQVEsR0FEc0I7QUFFOUJDLGtCQUFnQixJQUZjO0FBRzlCQyxTQUFPO0FBSHVCLEVBQWxCLENBQWI7O0FBTUE1QixZQUFXNkIsT0FBWCxDQUFtQkwsTUFBbkI7O0FBRUF4QixZQUFXOEIsRUFBWCxDQUFjLFFBQWQsRUFBd0IsTUFBTTtBQUM3QjlCLGVBQWEsSUFBYjtBQUNBLEVBRkQ7QUFHQTs7QUFFRCxjQUFJOEIsRUFBSixDQUFPLE9BQVAsRUFBZ0JMLFlBQWhCOztBQUVBLGNBQUlLLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixNQUFNO0FBQ2pDLEtBQUlmLFFBQVFnQixRQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2xDLGdCQUFJQyxJQUFKO0FBQ0E7QUFDRCxDQUpEOztBQU1BLGNBQUlGLEVBQUosQ0FBTyxVQUFQLEVBQW1CLE1BQU07QUFDeEIsS0FBSTlCLGVBQWUsSUFBbkIsRUFBeUI7QUFDeEJ5QjtBQUNBO0FBQ0QsQ0FKRCxFIiwiZmlsZSI6Ii4vc3JjL21haW4vaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93LCBNZW51IH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgbWVudVRlbXBsYXRlIGZyb20gJy4vbWVudSdcblxubGV0IG1haW5XaW5kb3dcblxuZnVuY3Rpb24gc2VuZEV2ZW50VG9XaW5kb3cgKGNoYW5uZWwsIC4uLmFyZ3MpIHtcblx0aWYgKG1haW5XaW5kb3cgJiYgbWFpbldpbmRvdy53ZWJDb250ZW50cykge1xuXHRcdG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChjaGFubmVsLCAuLi5hcmdzKVxuXHR9XG59XG5cbmZ1bmN0aW9uIG1ha2VNZW51Q2xpY2thYmxlIChtZW51KSB7XG5cdHJldHVybiBtZW51Lm1hcChpdGVtID0+IHtcblx0XHRpZiAoaXRlbS5zdWJtZW51ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdGl0ZW0uc3VibWVudSA9IG1ha2VNZW51Q2xpY2thYmxlKGl0ZW0uc3VibWVudSlcblx0XHR9XG5cblx0XHRpZiAoIWl0ZW0uY2xpY2spIHtcblx0XHRcdGl0ZW0uY2xpY2sgPSAoLi4uYXJncykgPT4gc2VuZEV2ZW50VG9XaW5kb3coJ2FwcE1lbnUtb25jbGljaycsIC4uLmFyZ3MpXG5cdFx0fVxuXHRcdHJldHVybiBpdGVtXG5cdH0pXG59XG5cbk1lbnUuc2V0QXBwbGljYXRpb25NZW51KE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUobWFrZU1lbnVDbGlja2FibGUobWVudVRlbXBsYXRlKSkpXG5cbi8qKlxuICogU2V0IGBfX3N0YXRpY2AgcGF0aCB0byBzdGF0aWMgZmlsZXMgaW4gcHJvZHVjdGlvblxuICogaHR0cHM6Ly9zaW11bGF0ZWRncmVnLmdpdGJvb2tzLmlvL2VsZWN0cm9uLXZ1ZS9jb250ZW50L2VuL3VzaW5nLXN0YXRpYy1hc3NldHMuaHRtbFxuICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdkZXZlbG9wbWVudCcpIHtcblx0Z2xvYmFsLl9fc3RhdGljID0gcmVxdWlyZSgncGF0aCcpLmpvaW4oX19kaXJuYW1lLCAnL3N0YXRpYycpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbn1cblxuY29uc3Qgd2luVVJMID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcblx0PyBgaHR0cDovL2xvY2FsaG9zdDo5MDgwYFxuXHQ6IGBmaWxlOi8vJHtfX2Rpcm5hbWV9L2luZGV4Lmh0bWxgXG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdyAoKSB7XG5cdC8qKlxuXHQgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXG5cdCAqL1xuXHRtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuXHRcdGhlaWdodDogNTYzLFxuXHRcdHVzZUNvbnRlbnRTaXplOiB0cnVlLFxuXHRcdHdpZHRoOiAxMDAwLFxuXHR9KVxuXG5cdG1haW5XaW5kb3cubG9hZFVSTCh3aW5VUkwpXG5cblx0bWFpbldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuXHRcdG1haW5XaW5kb3cgPSBudWxsXG5cdH0pXG59XG5cbmFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpXG5cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuXHRcdGFwcC5xdWl0KClcblx0fVxufSlcblxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcblx0aWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcblx0XHRjcmVhdGVXaW5kb3coKVxuXHR9XG59KVxuXG4vKipcbiAqIEF1dG8gVXBkYXRlclxuICpcbiAqIFVuY29tbWVudCB0aGUgZm9sbG93aW5nIGNvZGUgYmVsb3cgYW5kIGluc3RhbGwgYGVsZWN0cm9uLXVwZGF0ZXJgIHRvXG4gKiBzdXBwb3J0IGF1dG8gdXBkYXRpbmcuIENvZGUgU2lnbmluZyB3aXRoIGEgdmFsaWQgY2VydGlmaWNhdGUgaXMgcmVxdWlyZWQuXG4gKiBodHRwczovL3NpbXVsYXRlZGdyZWcuZ2l0Ym9va3MuaW8vZWxlY3Ryb24tdnVlL2NvbnRlbnQvZW4vdXNpbmctZWxlY3Ryb24tYnVpbGRlci5odG1sI2F1dG8tdXBkYXRpbmdcbiAqL1xuXG4vKlxuaW1wb3J0IHsgYXV0b1VwZGF0ZXIgfSBmcm9tICdlbGVjdHJvbi11cGRhdGVyJ1xuXG5hdXRvVXBkYXRlci5vbigndXBkYXRlLWRvd25sb2FkZWQnLCAoKSA9PiB7XG5cdGF1dG9VcGRhdGVyLnF1aXRBbmRJbnN0YWxsKClcbn0pXG5cbmFwcC5vbigncmVhZHknLCAoKSA9PiB7XG5cdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXMoKVxufSlcbiAqL1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4vaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/index.js\n");

/***/ }),

/***/ "./src/main/menu.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _electron = __webpack_require__(0);\n\nexports.default = [{\n\tlabel: 'Кампании !',\n\tsubmenu: [{\n\t\tlabel: 'Загрузить',\n\t\taccelerator: 'CmdOrCtrl+O',\n\t\tid: 'open'\n\t}, {\n\t\tlabel: 'Сохранить как...',\n\t\taccelerator: 'CmdOrCtrl+S',\n\t\tid: 'save'\n\t}]\n}, {\n\tlabel: 'Правка',\n\tsubmenu: [{\n\t\tlabel: 'Отменить',\n\t\taccelerator: 'CmdOrCtrl+Z',\n\t\tid: 'undo'\n\t}, {\n\t\tlabel: 'Повторить',\n\t\taccelerator: 'CmdOrCtrl+Y',\n\t\tid: 'redo'\n\t}, { type: 'separator' }, {\n\t\tlabel: 'Очистить...',\n\t\tsubmenu: [{\n\t\t\tlabel: 'Кампании',\n\t\t\tid: 'clear-direct'\n\t\t}, {\n\t\t\tlabel: 'Ключевые слова',\n\t\t\tid: 'clear-keywords'\n\t\t}, {\n\t\t\tlabel: 'Быстрые ссылки',\n\t\t\tid: 'clear-fastLinks'\n\t\t}, { type: 'separator' }, {\n\t\t\tlabel: 'Очистить всё',\n\t\t\tid: 'clear-all'\n\t\t}]\n\t}]\n}, {\n\tlabel: 'Навигация',\n\tsubmenu: [{\n\t\tlabel: 'Следующая вкладка',\n\t\tid: 'next-tab',\n\t\taccelerator: 'CmdOrCtrl+Tab'\n\t}, {\n\t\tlabel: 'Предыдущая вкладка',\n\t\tid: 'before-tab',\n\t\taccelerator: 'CmdOrCtrl+Shift+Tab'\n\t}, { type: 'separator' }, {\n\t\tlabel: 'Обзор',\n\t\tid: 'goto',\n\t\tto: 'View'\n\t}, {\n\t\tlabel: 'Ключевые слова',\n\t\tid: 'goto',\n\t\tto: 'Keywords'\n\t}, {\n\t\tlabel: 'Быстрые ссылки',\n\t\tid: 'goto',\n\t\tto: 'FastLinks'\n\t}, {\n\t\tlabel: 'Пометка ссылок',\n\t\tid: 'goto',\n\t\tto: 'UtmMark'\n\t}]\n}, {\n\tlabel: 'Справка',\n\tsubmenu: [{\n\t\tlabel: 'Открыть справку',\n\t\taccelerator: 'F1',\n\t\tclick: () => _electron.shell.openExternal('https://github.com/cawa-93/command-editor')\n\t}, {\n\t\tlabel: 'О программе',\n\t\tid: 'about'\n\t}]\n}];//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9tZW51LmpzPzQwOGEiXSwibmFtZXMiOlsibGFiZWwiLCJzdWJtZW51IiwiYWNjZWxlcmF0b3IiLCJpZCIsInR5cGUiLCJ0byIsImNsaWNrIiwib3BlbkV4dGVybmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7a0JBRWUsQ0FBQztBQUNmQSxRQUFPLFlBRFE7QUFFZkMsVUFBUyxDQUFDO0FBQ1RELFNBQU8sV0FERTtBQUVURSxlQUFhLGFBRko7QUFHVEMsTUFBSTtBQUhLLEVBQUQsRUFJTjtBQUNGSCxTQUFPLGtCQURMO0FBRUZFLGVBQWEsYUFGWDtBQUdGQyxNQUFJO0FBSEYsRUFKTTtBQUZNLENBQUQsRUFXWjtBQUNGSCxRQUFPLFFBREw7QUFFRkMsVUFBUyxDQUFDO0FBQ1RELFNBQU8sVUFERTtBQUVURSxlQUFhLGFBRko7QUFHVEMsTUFBSTtBQUhLLEVBQUQsRUFJTjtBQUNGSCxTQUFPLFdBREw7QUFFRkUsZUFBYSxhQUZYO0FBR0ZDLE1BQUk7QUFIRixFQUpNLEVBU1QsRUFBQ0MsTUFBTSxXQUFQLEVBVFMsRUFVVDtBQUNDSixTQUFPLGFBRFI7QUFFQ0MsV0FBUyxDQUFDO0FBQ1RELFVBQU8sVUFERTtBQUVURyxPQUFJO0FBRkssR0FBRCxFQUdOO0FBQ0ZILFVBQU8sZ0JBREw7QUFFRkcsT0FBSTtBQUZGLEdBSE0sRUFNTjtBQUNGSCxVQUFPLGdCQURMO0FBRUZHLE9BQUk7QUFGRixHQU5NLEVBVVQsRUFBQ0MsTUFBTSxXQUFQLEVBVlMsRUFXVDtBQUNDSixVQUFPLGNBRFI7QUFFQ0csT0FBSTtBQUZMLEdBWFM7QUFGVixFQVZTO0FBRlAsQ0FYWSxFQXlDWjtBQUNGSCxRQUFPLFdBREw7QUFFRkMsVUFBUyxDQUFDO0FBQ1RELFNBQU8sbUJBREU7QUFFVEcsTUFBSSxVQUZLO0FBR1RELGVBQWE7QUFISixFQUFELEVBSU47QUFDRkYsU0FBTyxvQkFETDtBQUVGRyxNQUFJLFlBRkY7QUFHRkQsZUFBYTtBQUhYLEVBSk0sRUFTVCxFQUFDRSxNQUFNLFdBQVAsRUFUUyxFQVVUO0FBQ0NKLFNBQU8sT0FEUjtBQUVDRyxNQUFJLE1BRkw7QUFHQ0UsTUFBSTtBQUhMLEVBVlMsRUFjTjtBQUNGTCxTQUFPLGdCQURMO0FBRUZHLE1BQUksTUFGRjtBQUdGRSxNQUFJO0FBSEYsRUFkTSxFQWtCTjtBQUNGTCxTQUFPLGdCQURMO0FBRUZHLE1BQUksTUFGRjtBQUdGRSxNQUFJO0FBSEYsRUFsQk0sRUFzQk47QUFDRkwsU0FBTyxnQkFETDtBQUVGRyxNQUFJLE1BRkY7QUFHRkUsTUFBSTtBQUhGLEVBdEJNO0FBRlAsQ0F6Q1ksRUF1RVo7QUFDRkwsUUFBTyxTQURMO0FBRUZDLFVBQVMsQ0FBQztBQUNURCxTQUFPLGlCQURFO0FBRVRFLGVBQWEsSUFGSjtBQUdUSSxTQUFPLE1BQU0sZ0JBQU1DLFlBQU4sQ0FBbUIsMkNBQW5CO0FBSEosRUFBRCxFQUlOO0FBQ0ZQLFNBQU8sYUFETDtBQUVGRyxNQUFJO0FBRkYsRUFKTTtBQUZQLENBdkVZLEMiLCJmaWxlIjoiLi9zcmMvbWFpbi9tZW51LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzaGVsbH0gZnJvbSAnZWxlY3Ryb24nXG5cbmV4cG9ydCBkZWZhdWx0IFt7XG5cdGxhYmVsOiAn0JrQsNC80L/QsNC90LjQuCAhJyxcblx0c3VibWVudTogW3tcblx0XHRsYWJlbDogJ9CX0LDQs9GA0YPQt9C40YLRjCcsXG5cdFx0YWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTycsXG5cdFx0aWQ6ICdvcGVuJyxcblx0fSwge1xuXHRcdGxhYmVsOiAn0KHQvtGF0YDQsNC90LjRgtGMINC60LDQui4uLicsXG5cdFx0YWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUycsXG5cdFx0aWQ6ICdzYXZlJyxcblx0fV0sXG59LCB7XG5cdGxhYmVsOiAn0J/RgNCw0LLQutCwJyxcblx0c3VibWVudTogW3tcblx0XHRsYWJlbDogJ9Ce0YLQvNC10L3QuNGC0YwnLFxuXHRcdGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1onLFxuXHRcdGlkOiAndW5kbycsXG5cdH0sIHtcblx0XHRsYWJlbDogJ9Cf0L7QstGC0L7RgNC40YLRjCcsXG5cdFx0YWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWScsXG5cdFx0aWQ6ICdyZWRvJyxcblx0fSxcblx0e3R5cGU6ICdzZXBhcmF0b3InfSxcblx0e1xuXHRcdGxhYmVsOiAn0J7Rh9C40YHRgtC40YLRjC4uLicsXG5cdFx0c3VibWVudTogW3tcblx0XHRcdGxhYmVsOiAn0JrQsNC80L/QsNC90LjQuCcsXG5cdFx0XHRpZDogJ2NsZWFyLWRpcmVjdCcsXG5cdFx0fSwge1xuXHRcdFx0bGFiZWw6ICfQmtC70Y7Rh9C10LLRi9C1INGB0LvQvtCy0LAnLFxuXHRcdFx0aWQ6ICdjbGVhci1rZXl3b3JkcycsXG5cdFx0fSwge1xuXHRcdFx0bGFiZWw6ICfQkdGL0YHRgtGA0YvQtSDRgdGB0YvQu9C60LgnLFxuXHRcdFx0aWQ6ICdjbGVhci1mYXN0TGlua3MnLFxuXHRcdH0sXG5cdFx0e3R5cGU6ICdzZXBhcmF0b3InfSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ9Ce0YfQuNGB0YLQuNGC0Ywg0LLRgdGRJyxcblx0XHRcdGlkOiAnY2xlYXItYWxsJyxcblx0XHR9XSxcblx0fV0sXG59LCB7XG5cdGxhYmVsOiAn0J3QsNCy0LjQs9Cw0YbQuNGPJyxcblx0c3VibWVudTogW3tcblx0XHRsYWJlbDogJ9Ch0LvQtdC00YPRjtGJ0LDRjyDQstC60LvQsNC00LrQsCcsXG5cdFx0aWQ6ICduZXh0LXRhYicsXG5cdFx0YWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrVGFiJyxcblx0fSwge1xuXHRcdGxhYmVsOiAn0J/RgNC10LTRi9C00YPRidCw0Y8g0LLQutC70LDQtNC60LAnLFxuXHRcdGlkOiAnYmVmb3JlLXRhYicsXG5cdFx0YWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrU2hpZnQrVGFiJyxcblx0fSxcblx0e3R5cGU6ICdzZXBhcmF0b3InfSxcblx0e1xuXHRcdGxhYmVsOiAn0J7QsdC30L7RgCcsXG5cdFx0aWQ6ICdnb3RvJyxcblx0XHR0bzogJ1ZpZXcnLFxuXHR9LCB7XG5cdFx0bGFiZWw6ICfQmtC70Y7Rh9C10LLRi9C1INGB0LvQvtCy0LAnLFxuXHRcdGlkOiAnZ290bycsXG5cdFx0dG86ICdLZXl3b3JkcycsXG5cdH0sIHtcblx0XHRsYWJlbDogJ9CR0YvRgdGC0YDRi9C1INGB0YHRi9C70LrQuCcsXG5cdFx0aWQ6ICdnb3RvJyxcblx0XHR0bzogJ0Zhc3RMaW5rcycsXG5cdH0sIHtcblx0XHRsYWJlbDogJ9Cf0L7QvNC10YLQutCwINGB0YHRi9C70L7QuicsXG5cdFx0aWQ6ICdnb3RvJyxcblx0XHR0bzogJ1V0bU1hcmsnLFxuXHR9LFxuXHRdLFxufSwge1xuXHRsYWJlbDogJ9Ch0L/RgNCw0LLQutCwJyxcblx0c3VibWVudTogW3tcblx0XHRsYWJlbDogJ9Ce0YLQutGA0YvRgtGMINGB0L/RgNCw0LLQutGDJyxcblx0XHRhY2NlbGVyYXRvcjogJ0YxJyxcblx0XHRjbGljazogKCkgPT4gc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2dpdGh1Yi5jb20vY2F3YS05My9jb21tYW5kLWVkaXRvcicpLFxuXHR9LCB7XG5cdFx0bGFiZWw6ICfQniDQv9GA0L7Qs9GA0LDQvNC80LUnLFxuXHRcdGlkOiAnYWJvdXQnLFxuXHR9XSxcbn1dXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFpbi9tZW51LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/menu.js\n");

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzY5MjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb25cIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n");

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-devtools-installer\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIj8wMGI2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///1\n");

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiPzRiMGYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svZWxlY3Ryb24tbWFpbi1obXIvSG1yQ2xpZW50XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb24td2VicGFjay9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///2\n");

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiPzJlMDkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZnNcIlxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///3\n");

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

eval("module.exports = require(\"net\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXRcIj9lYjg1Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJuZXRcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///4\n");

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NWIyYSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI1LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///5\n");

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/YTMyNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI2LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInNvdXJjZS1tYXAtc3VwcG9ydC9zb3VyY2UtbWFwLXN1cHBvcnQuanNcIlxuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///6\n");

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

eval("module.exports = require(\"tty\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0dHlcIj9iZjFjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6IjcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0dHlcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ0dHlcIlxuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///7\n");

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCI/NzBjNSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiI4LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInV0aWxcIlxuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///8\n");

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/electron-webpack/electron-main-hmr/main-hmr.js");
__webpack_require__("./src/main/index.dev.js");
module.exports = __webpack_require__("./src/main/index.js");


/***/ })

/******/ });