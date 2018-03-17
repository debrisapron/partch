(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Partch"] = factory();
	else
		root["Partch"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./entry.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./entry.js":
/*!******************!*\
  !*** ./entry.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src */ \"./src/index.js\").default\n\n\n//# sourceURL=webpack://Partch/./entry.js?");

/***/ }),

/***/ "./node_modules/audio-context/index.js":
/*!*********************************************!*\
  !*** ./node_modules/audio-context/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar cache = {}\r\n\r\nmodule.exports = function getContext (options) {\r\n\tif (typeof window === 'undefined') return null\r\n\t\r\n\tvar OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext\r\n\tvar Context = window.AudioContext || window.webkitAudioContext\r\n\t\r\n\tif (!Context) return null\r\n\r\n\tif (typeof options === 'number') {\r\n\t\toptions = {sampleRate: options}\r\n\t}\r\n\r\n\tvar sampleRate = options && options.sampleRate\r\n\r\n\r\n\tif (options && options.offline) {\r\n\t\tif (!OfflineContext) return null\r\n\r\n\t\treturn new OfflineContext(options.channels || 2, options.length, sampleRate || 44100)\r\n\t}\r\n\r\n\r\n\t//cache by sampleRate, rather strong guess\r\n\tvar ctx = cache[sampleRate]\r\n\r\n\tif (ctx) return ctx\r\n\r\n\t//several versions of firefox have issues with the\r\n\t//constructor argument\r\n\t//see: https://bugzilla.mozilla.org/show_bug.cgi?id=1361475\r\n\ttry {\r\n\t\tctx = new Context(options)\r\n\t}\r\n\tcatch (err) {\r\n\t\tctx = new Context()\r\n\t}\r\n\tcache[ctx.sampleRate] = cache[sampleRate] = ctx\r\n\r\n\treturn ctx\r\n}\r\n\n\n//# sourceURL=webpack://Partch/./node_modules/audio-context/index.js?");

/***/ }),

/***/ "./node_modules/audio-loader/lib/base64.js":
/*!*************************************************!*\
  !*** ./node_modules/audio-loader/lib/base64.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n// DECODE UTILITIES\r\nfunction b64ToUint6 (nChr) {\r\n  return nChr > 64 && nChr < 91 ? nChr - 65\r\n    : nChr > 96 && nChr < 123 ? nChr - 71\r\n    : nChr > 47 && nChr < 58 ? nChr + 4\r\n    : nChr === 43 ? 62\r\n    : nChr === 47 ? 63\r\n    : 0\r\n}\r\n\r\n// Decode Base64 to Uint8Array\r\n// ---------------------------\r\nfunction decode (sBase64, nBlocksSize) {\r\n  var sB64Enc = sBase64.replace(/[^A-Za-z0-9\\+\\/]/g, '')\r\n  var nInLen = sB64Enc.length\r\n  var nOutLen = nBlocksSize\r\n    ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize\r\n    : nInLen * 3 + 1 >> 2\r\n  var taBytes = new Uint8Array(nOutLen)\r\n\r\n  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {\r\n    nMod4 = nInIdx & 3\r\n    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4\r\n    if (nMod4 === 3 || nInLen - nInIdx === 1) {\r\n      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {\r\n        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255\r\n      }\r\n      nUint24 = 0\r\n    }\r\n  }\r\n  return taBytes\r\n}\r\n\r\nmodule.exports = { decode: decode }\r\n\n\n//# sourceURL=webpack://Partch/./node_modules/audio-loader/lib/base64.js?");

/***/ }),

/***/ "./node_modules/audio-loader/lib/browser.js":
/*!**************************************************!*\
  !*** ./node_modules/audio-loader/lib/browser.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* global XMLHttpRequest */\r\n\r\nvar load = __webpack_require__(/*! ./load */ \"./node_modules/audio-loader/lib/load.js\")\r\nvar context = __webpack_require__(/*! audio-context */ \"./node_modules/audio-context/index.js\")\r\n\r\nmodule.exports = function (source, options, cb) {\r\n  if (options instanceof Function) {\r\n    cb = options\r\n    options = {}\r\n  }\r\n  options = options || {}\r\n  options.ready = cb || function () {}\r\n  var ac = options && options.context ? options.context : context()\r\n  var defaults = { decode: getAudioDecoder(ac), fetch: fetch }\r\n  var opts = Object.assign(defaults, options)\r\n  return load(source, opts)\r\n}\r\n\r\n/**\r\n * Wraps AudioContext's decodeAudio into a Promise\r\n */\r\nfunction getAudioDecoder (ac) {\r\n  return function decode (buffer) {\r\n    return new Promise(function (resolve, reject) {\r\n      ac.decodeAudioData(buffer,\r\n        function (data) { resolve(data) },\r\n        function (err) { reject(err) })\r\n    })\r\n  }\r\n}\r\n\r\n/*\r\n * Wraps a XMLHttpRequest into a Promise\r\n *\r\n * @param {String} url\r\n * @param {String} type - can be 'text' or 'arraybuffer'\r\n * @return {Promise}\r\n */\r\nfunction fetch (url, type) {\r\n  return new Promise(function (resolve, reject) {\r\n    var req = new XMLHttpRequest()\r\n    if (type) req.responseType = type\r\n\r\n    req.open('GET', url)\r\n    req.onload = function () {\r\n      req.status === 200 ? resolve(req.response) : reject(Error(req.statusText))\r\n    }\r\n    req.onerror = function () { reject(Error('Network Error')) }\r\n    req.send()\r\n  })\r\n}\r\n\n\n//# sourceURL=webpack://Partch/./node_modules/audio-loader/lib/browser.js?");

/***/ }),

/***/ "./node_modules/audio-loader/lib/load.js":
/*!***********************************************!*\
  !*** ./node_modules/audio-loader/lib/load.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar base64 = __webpack_require__(/*! ./base64 */ \"./node_modules/audio-loader/lib/base64.js\")\r\nvar isBuffer = __webpack_require__(/*! is-buffer */ \"./node_modules/is-buffer/index.js\")\r\n\r\n// Given a regex, return a function that test if against a string\r\nfunction fromRegex (r) {\r\n  return function (o) { return typeof o === 'string' && r.test(o) }\r\n}\r\n// Try to apply a prefix to a name\r\nfunction prefix (pre, name) {\r\n  return typeof pre === 'string' ? pre + name\r\n    : typeof pre === 'function' ? pre(name)\r\n    : name\r\n}\r\n\r\n/**\r\n * Load one or more audio files\r\n *\r\n *\r\n * Possible option keys:\r\n *\r\n * - __from__ {Function|String}: a function or string to convert from file names to urls.\r\n * If is a string it will be prefixed to the name:\r\n * `load('snare.mp3', { from: 'http://audio.net/samples/' })`\r\n * If it's a function it receives the file name and should return the url as string.\r\n * - __only__ {Array} - when loading objects, if provided, only the given keys\r\n * will be included in the decoded object:\r\n * `load('piano.json', { only: ['C2', 'D2'] })`\r\n *\r\n * @param {Object} source - the object to be loaded\r\n * @param {Object} options - (Optional) the load options for that object\r\n * @param {Object} defaultValue - (Optional) the default value to return as\r\n * in a promise if not valid loader found\r\n */\r\nfunction load (source, options, defVal) {\r\n  var loader =\r\n    // Basic audio loading\r\n      isArrayBuffer(source) || isBuffer(source) ? decodeBuffer\r\n    : isAudioFileName(source) ? loadAudioFile\r\n    : isPromise(source) ? loadPromise\r\n    // Compound objects\r\n    : isArray(source) ? loadArrayData\r\n    : isObject(source) ? loadObjectData\r\n    : isJsonFileName(source) ? loadJsonFile\r\n    // Base64 encoded audio\r\n    : isBase64Audio(source) ? loadBase64Audio\r\n    : isJsFileName(source) ? loadMidiJSFile\r\n    : null\r\n\r\n  var opts = options || {}\r\n  var promise = loader ? loader(source, opts)\r\n    : defVal ? Promise.resolve(defVal)\r\n    : Promise.reject('Source not valid (' + source + ')')\r\n\r\n  return promise.then(function (data) {\r\n    opts.ready(null, data)\r\n    return data\r\n  }, function (err) {\r\n    opts.ready(err)\r\n    throw err\r\n  })\r\n}\r\n\r\n// BASIC AUDIO LOADING\r\n// ===================\r\n\r\n// Load (decode) an array buffer\r\nfunction isArrayBuffer (o) { return o instanceof ArrayBuffer }\r\nfunction decodeBuffer (array, options) {\r\n  return options.decode(array)\r\n}\r\n\r\n// Load an audio filename\r\nvar isAudioFileName = fromRegex(/\\.(mp3|wav|ogg)(\\?.*)?$/i)\r\nfunction loadAudioFile (name, options) {\r\n  var url = prefix(options.from, name)\r\n  return load(options.fetch(url, 'arraybuffer'), options)\r\n}\r\n\r\n// Load the result of a promise\r\nfunction isPromise (o) { return o && typeof o.then === 'function' }\r\nfunction loadPromise (promise, options) {\r\n  return promise.then(function (value) {\r\n    return load(value, options)\r\n  })\r\n}\r\n\r\n// COMPOUND OBJECTS\r\n// ================\r\n\r\n// Try to load all the items of an array\r\nvar isArray = Array.isArray\r\nfunction loadArrayData (array, options) {\r\n  return Promise.all(array.map(function (data) {\r\n    return load(data, options, data)\r\n  }))\r\n}\r\n\r\n// Try to load all the values of a key/value object\r\nfunction isObject (o) { return o && typeof o === 'object' }\r\nfunction loadObjectData (obj, options) {\r\n  var dest = {}\r\n  var promises = Object.keys(obj).map(function (key) {\r\n    if (options.only && options.only.indexOf(key) === -1) return null\r\n    var value = obj[key]\r\n    return load(value, options, value).then(function (audio) {\r\n      dest[key] = audio\r\n    })\r\n  })\r\n  return Promise.all(promises).then(function () { return dest })\r\n}\r\n\r\n// Load the content of a JSON file\r\nvar isJsonFileName = fromRegex(/\\.json(\\?.*)?$/i)\r\nfunction loadJsonFile (name, options) {\r\n  var url = prefix(options.from, name)\r\n  return load(options.fetch(url, 'text').then(JSON.parse), options)\r\n}\r\n\r\n// BASE64 ENCODED FORMATS\r\n// ======================\r\n\r\n// Load strings with Base64 encoded audio\r\nvar isBase64Audio = fromRegex(/^data:audio/)\r\nfunction loadBase64Audio (source, options) {\r\n  var i = source.indexOf(',')\r\n  return load(base64.decode(source.slice(i + 1)).buffer, options)\r\n}\r\n\r\n// Load .js files with MidiJS soundfont prerendered audio\r\nvar isJsFileName = fromRegex(/\\.js(\\?.*)?$/i)\r\nfunction loadMidiJSFile (name, options) {\r\n  var url = prefix(options.from, name)\r\n  return load(options.fetch(url, 'text').then(midiJsToJson), options)\r\n}\r\n\r\n// convert a MIDI.js javascript soundfont file to json\r\nfunction midiJsToJson (data) {\r\n  var begin = data.indexOf('MIDI.Soundfont.')\r\n  if (begin < 0) throw Error('Invalid MIDI.js Soundfont format')\r\n  begin = data.indexOf('=', begin) + 2\r\n  var end = data.lastIndexOf(',')\r\n  return JSON.parse(data.slice(begin, end) + '}')\r\n}\r\n\r\nif (typeof module === 'object' && module.exports) module.exports = load\r\nif (typeof window !== 'undefined') window.loadAudio = load\r\n\n\n//# sourceURL=webpack://Partch/./node_modules/audio-loader/lib/load.js?");

/***/ }),

/***/ "./node_modules/freeverb/index.js":
/*!****************************************!*\
  !*** ./node_modules/freeverb/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// adapted from: https://github.com/TONEnoTONE/Tone.js/blob/master/Tone/effect/Freeverb.js\n\nvar combFilterTunings = [1557 / 44100, 1617 / 44100, 1491 / 44100, 1422 / 44100, 1277 / 44100, 1356 / 44100, 1188 / 44100, 1116 / 44100]\nvar allpassFilterFrequencies = [225, 556, 441, 341]\n\nvar LowpassCombFilter = __webpack_require__(/*! ./lib/lowpass-comb-filter */ \"./node_modules/freeverb/lib/lowpass-comb-filter.js\")\n\nmodule.exports = Freeverb\n\nfunction Freeverb (audioContext) {\n  var node = audioContext.createGain()\n  node.channelCountMode = 'explicit'\n  node.channelCount = 2\n\n  var output = audioContext.createGain()\n  var merger = audioContext.createChannelMerger(2)\n  var splitter = audioContext.createChannelSplitter(2)\n  var highpass = audioContext.createBiquadFilter()\n  highpass.type = 'highpass'\n  highpass.frequency.value = 200\n\n  var wet = audioContext.createGain()\n  var dry = audioContext.createGain()\n\n  node.connect(dry)\n  node.connect(wet)\n  wet.connect(splitter)\n  merger.connect(highpass)\n  highpass.connect(output)\n  dry.connect(output)\n\n  var combFilters = []\n  var allpassFiltersL = []\n  var allpassFiltersR = []\n  var roomSize = 0.8\n  var dampening = 3000\n\n  // make the allpass filters on the right\n  for (var l = 0; l < allpassFilterFrequencies.length; l++) {\n    var allpassL = audioContext.createBiquadFilter()\n    allpassL.type = 'allpass'\n    allpassL.frequency.value = allpassFilterFrequencies[l]\n    allpassFiltersL.push(allpassL)\n\n    if (allpassFiltersL[l - 1]) {\n      allpassFiltersL[l - 1].connect(allpassL)\n    }\n  }\n\n  // make the allpass filters on the left\n  for (var r = 0; r < allpassFilterFrequencies.length; r++) {\n    var allpassR = audioContext.createBiquadFilter()\n    allpassR.type = 'allpass'\n    allpassR.frequency.value = allpassFilterFrequencies[r]\n    allpassFiltersR.push(allpassR)\n\n    if (allpassFiltersR[r - 1]) {\n      allpassFiltersR[r - 1].connect(allpassR)\n    }\n  }\n\n  allpassFiltersL[allpassFiltersL.length - 1].connect(merger, 0, 0)\n  allpassFiltersR[allpassFiltersR.length - 1].connect(merger, 0, 1)\n\n  // make the comb filters\n  for (var c = 0; c < combFilterTunings.length; c++) {\n    var lfpf = LowpassCombFilter(audioContext)\n    lfpf.delayTime.value = combFilterTunings[c]\n    if (c < combFilterTunings.length / 2) {\n      splitter.connect(lfpf, 0)\n      lfpf.connect(allpassFiltersL[0])\n    } else {\n      splitter.connect(lfpf, 1)\n      lfpf.connect(allpassFiltersR[0])\n    }\n    combFilters.push(lfpf)\n  }\n\n  Object.defineProperties(node, {\n    roomSize: {\n      get: function () {\n        return roomSize\n      },\n      set: function (value) {\n        roomSize = value\n        refreshFilters()\n      }\n    },\n    dampening: {\n      get: function () {\n        return dampening\n      },\n\n      set: function (value) {\n        dampening = value\n        refreshFilters()\n      }\n    }\n  })\n\n  refreshFilters()\n\n  node.connect = output.connect.bind(output)\n  node.disconnect = output.disconnect.bind(output)\n  node.wet = wet.gain\n  node.dry = dry.gain\n\n  // expose combFilters for direct automation\n  node.combFilters = combFilters\n\n  return node\n\n  // scoped\n\n  function refreshFilters () {\n    for (var i = 0; i < combFilters.length; i++) {\n      combFilters[i].resonance.value = roomSize\n      combFilters[i].dampening.value = dampening\n    }\n  }\n}\n\n\n//# sourceURL=webpack://Partch/./node_modules/freeverb/index.js?");

/***/ }),

/***/ "./node_modules/freeverb/lib/lowpass-comb-filter.js":
/*!**********************************************************!*\
  !*** ./node_modules/freeverb/lib/lowpass-comb-filter.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// adapted from: https://github.com/TONEnoTONE/Tone.js/blob/master/Tone/component/LowpassCombFilter.js\n\nmodule.exports = LowpassCombFilter\n\nfunction LowpassCombFilter (context) {\n  var node = context.createDelay(1)\n\n  var output = context.createBiquadFilter()\n\n  // this magic number seems to fix everything in Chrome 53\n  // see https://github.com/livejs/freeverb/issues/1#issuecomment-249080213\n  output.Q.value = -3.0102999566398125\n\n  output.type = 'lowpass'\n  node.dampening = output.frequency\n\n  var feedback = context.createGain()\n  node.resonance = feedback.gain\n\n  node.connect(output)\n  output.connect(feedback)\n  feedback.connect(node)\n\n  node.dampening.value = 3000\n  node.delayTime.value = 0.1\n  node.resonance.value = 0.5\n\n  return node\n}\n\n\n//# sourceURL=webpack://Partch/./node_modules/freeverb/lib/lowpass-comb-filter.js?");

/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*!\n * Determine if an object is a Buffer\n *\n * @author   Feross Aboukhadijeh <https://feross.org>\n * @license  MIT\n */\n\n// The _isBuffer check is for Safari 5-7 support, because it's missing\n// Object.prototype.constructor. Remove this eventually\nmodule.exports = function (obj) {\n  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)\n}\n\nfunction isBuffer (obj) {\n  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)\n}\n\n// For Node v0.10 support. Remove this eventually.\nfunction isSlowBuffer (obj) {\n  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))\n}\n\n\n//# sourceURL=webpack://Partch/./node_modules/is-buffer/index.js?");

/***/ }),

/***/ "./node_modules/um-sequencer/index.js":
/*!********************************************!*\
  !*** ./node_modules/um-sequencer/index.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction Sequencer(getCurrentTime, options = {}) {\n\n  // NOTE\n  // All absolute times are in seconds.\n  // All musical times are in whole notes.\n\n  //// Setup ///////////////////////////////////////////////////////////////////\n\n  let _interval = options.interval || 0.025 // Time between ticks.\n  let _lookahead = options.lookahead || 0.1 // Time to look ahead for events to schedule.\n  let _useWorker = options.useWorker == null ? true : options.useWorker\n  let _timerId\n  let _clockWorker\n  let _isPlaying = false\n  let _tempo\n  let _nextEventIndex\n  let _nextEventTime\n  let _events\n  let _deltas\n\n  if (_useWorker) {\n    _clockWorker = new Worker(clockWorkerUrl())\n    _clockWorker.onmessage = onTick\n  }\n\n  //// Playback ////////////////////////////////////////////////////////////////\n\n  function init(events, options) {\n    _tempo = options.tempo || 120\n\n    // Add the loop event if present & sort the events by time.\n    _events = events.slice()\n    if (options.loopLength) {\n      _events.push({ time: options.loopLength, loop: true })\n    }\n    _events.sort((a, b) => a.time - b.time)\n\n    // For each event, get the delta time since the previous event.\n    _deltas = _events.map(({ time, callback }, i, arr) => {\n      return i === 0 ? time : (time - arr[i - 1].time)\n    })\n\n    // Point the sequencer to the first event.\n    _nextEventIndex = 0\n\n    // Schedule the first event to play after a tick has passed.\n    _nextEventTime = getCurrentTime() + _interval + secsFromWholeNotes(_deltas[0])\n  }\n\n  // While there are notes that will need to play during the next lookahead period,\n  // schedule them and advance the pointer.\n  function onTick() {\n    let horizon = getCurrentTime() + _lookahead\n    while (_isPlaying && (_nextEventTime < horizon)) {\n      dispatch()\n      advance()\n    }\n  }\n\n  function dispatch() {\n    let callback = _events[_nextEventIndex].callback\n    if (callback) { callback(_nextEventTime) }\n  }\n\n  // Move the pointer to the next note.\n  function advance() {\n    let loop = _events[_nextEventIndex].loop\n    let isLastEvent = _nextEventIndex === _deltas.length - 1\n\n    // If we are not looping and this is the end of the sequence, stop.\n    if (isLastEvent && !loop) {\n      stop()\n      return\n    }\n\n    // If we are at the loop point, move it to the first note.\n    _nextEventIndex = loop ? 0 : _nextEventIndex + 1\n    _nextEventTime += secsFromWholeNotes(_deltas[_nextEventIndex])\n  }\n\n  function secsFromWholeNotes(whns) {\n    return whns * (240 / _tempo)\n  }\n\n  //// Clock ///////////////////////////////////////////////////////////////////\n\n  function startClock() {\n    if (_useWorker) {\n      _clockWorker.postMessage({ action: 'start', interval: _interval })\n    } else {\n      _timerId = setInterval(onTick, _interval * 1000)\n    }\n  }\n\n  function stopClock() {\n    if (_useWorker) {\n      _clockWorker.postMessage({ action: 'stop' })\n    } else {\n      clearInterval(_timerId)\n      _timerId = null\n    }\n  }\n\n  function ClockWorker() {\n    // NOTE This function runs in a separate context, so does not have access to\n    // instance variables!\n    let _workerTimerId\n    onmessage = (e) => {\n      let action = e.data.action\n\n      if (action === 'start') {\n        _workerTimerId = setInterval(() => {\n          postMessage({ action: 'tick' })\n        }, e.data.interval * 1000)\n      }\n\n      if (action === 'stop') {\n        clearInterval(_workerTimerId)\n        _workerTimerId = null\n      }\n    }\n  }\n\n  function clockWorkerUrl() {\n    let blob = new Blob(\n      [`(${ClockWorker.toString()})()`],\n      { type: 'application/javascript' }\n    )\n    return URL.createObjectURL(blob)\n  }\n\n  //// API /////////////////////////////////////////////////////////////////////\n\n  function play(events, options = {}) {\n    if (_isPlaying) { stop() }\n    _isPlaying = true\n    init(events, options)\n    startClock()\n  }\n\n  function stop() {\n    if (_isPlaying) {\n      _isPlaying = false\n      stopClock()\n    }\n  }\n\n  function changeTempo(tempo) {\n    // Tempo changes may take up to [lookahead] to take effect.\n    if (!_isPlaying) { return }\n    _tempo = tempo\n  }\n\n  function isPlaying() {\n    return _isPlaying\n  }\n\n  return { play, stop, changeTempo, isPlaying }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Sequencer);\n\n\n//# sourceURL=webpack://Partch/./node_modules/um-sequencer/index.js?");

/***/ }),

/***/ "./src/Patch.js":
/*!**********************!*\
  !*** ./src/Patch.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\nfunction Patch(context, nodes, ...connections) {\n\n  // Clone nodes collection as we will be mutating it.\n  nodes = { ...nodes }\n\n  // Connect nodes\n  connections.forEach((row) => row\n    .split('>')\n    .map((pp) => pp.trim())\n    .reduce((from, to) => {\n      if (from === 'in' && !nodes.in) {\n        nodes.in = Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Gain\"])(context)\n      }\n      if (to === 'out' && !nodes.out) {\n        nodes.out = Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Gain\"])(context)\n      }\n      let fromNode = nodes[from]\n      let toNode = getNodeFromPath(to)\n      fromNode.connect(toNode.input || toNode)\n\n      // We always connect from the root node of the path.\n      return to.split('.')[0]\n    })\n  )\n\n  function getNodeFromPath(path) {\n    let pathNodes = path.split('.')\n    return pathNodes.reduce((parent, child) => {\n      return parent[child] || (parent.nodes && parent.nodes[child])\n    }, nodes)\n  }\n\n  //// Patch instance methods //////////////////////////////////////////////////\n\n  function connect(...args) {\n    return nodes.out.connect(...args)\n  }\n\n  function disconnect(...args) {\n    return nodes.out.disconnect(...args)\n  }\n\n  function stop(time) {\n    let currTime = context.currentTime\n    time = time || currTime\n    Object.values(nodes).forEach((node) => node.stop && node.stop(time))\n    setTimeout(\n      () => nodes.out.disconnect(),\n      (time - currTime) * 1000\n    )\n    return patch\n  }\n\n  function triggerAttack(time) {\n    Object.values(nodes).forEach((node) => {\n      node.triggerAttack && node.triggerAttack(time)\n    })\n    return patch\n  }\n\n  function triggerRelease(time) {\n    time = time || context.currentTime\n    let stopTimes = Object.values(nodes)\n      .map((node) => node.triggerRelease ? node.triggerRelease(time) : time)\n    let stopTime = Math.max(...stopTimes)\n    // TODO This causes any non-envelope tails (e.g. delay) to be truncated at\n    // stopTime. Smart solution is an analyzer that listens to signal and waits\n    // for n seconds of silence, but could be resource-intensive. Could also\n    // allow keepAlive setting which simply keeps all nodes with delays in\n    // around for n seconds.\n    stop(stopTime)\n    return stopTime\n  }\n\n  let patch = {\n    connect, disconnect, context, nodes, stop, triggerAttack, triggerRelease,\n    input: nodes.in\n  }\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"partchifyNode\"])(patch)\n  return patch\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Patch);\n\n\n//# sourceURL=webpack://Partch/./src/Patch.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: isPlainObject, stopAllNodes, testNode, partchifyNode, loadAudioFile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isPlainObject\", function() { return isPlainObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"stopAllNodes\", function() { return stopAllNodes; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"testNode\", function() { return testNode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"partchifyNode\", function() { return partchifyNode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadAudioFile\", function() { return loadAudioFile; });\n/* harmony import */ var audio_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! audio-loader */ \"./node_modules/audio-loader/lib/browser.js\");\n/* harmony import */ var audio_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(audio_loader__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n/* harmony import */ var _nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nodes/noiseNodes */ \"./src/nodes/noiseNodes.js\");\n\n// Circular references FTW\n\n\n\nlet _playingNodes = new Map()\nlet _audioFileCache = {}\n\nfunction isPlainObject(thing) {\n  return typeof thing === 'object' && thing.constructor === Object\n}\n\nfunction stopAllNodes() {\n  // TODO Should also disconnect everything. Poss way to do this: use a master\n  // node instead of context.destination & disconnect that.\n  Array.from(_playingNodes).forEach(([node]) => node.stop())\n}\n\nfunction testNode(node, dur = 0.2, type = 'bleep') {\n  // Monitor the node, and if the node is a destination, send a test sound\n  // through it, otherwise just stop it after a bit.\n  if (node.input) {\n    let src = type === 'noise' ? Object(_nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_2__[\"WhiteNoise\"])(node.context) : Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Saw\"])(node.context)\n    src.connect(node)\n    setTimeout(src.stop, dur * 1000)\n    setTimeout(node.stop, 10000)\n  } else {\n    setTimeout(node.stop, dur * 1000)\n  }\n  node.monitor()\n}\n\n// Takes a sad node and makes it better.\nfunction partchifyNode(node) {\n  node.__partchNode = true\n\n  // If node can be connected, make connect understand `node.input` and add\n  // monitor & test methods.\n  if (node.connect && !node.__connectPatched) {\n    node.__connectPatched = true\n    node.__connect = node.connect\n    node.__disconnect = node.disconnect\n    node.__connections = []\n\n    node.connect = (destination) => {\n      node.__connect(destination.input || destination)\n      node.__connections.push(destination)\n      return destination\n    }\n\n    node.disconnect = (outputOrDestination, output, input) => {\n      if (!outputOrDestination) {\n        node.__disconnect()\n        node.__connections = []\n      } else if (!isNaN(outputOrDestination)) {\n        node.__disconnect(outputOrDestination)\n        // TODO Handle multiple outputs.\n      } else {\n        let destination = outputOrDestination\n        node.__disconnect(destination.input || destination, output, input)\n        node.__connections = node.__connections.filter((conn) => {\n          return conn !== destination\n        })\n      }\n      return node\n    }\n\n    node.monitor = () => {\n      node.__connect(node.context.destination)\n      return node\n    }\n\n    node.test = (...args) => testNode(node, ...args)\n  }\n\n  // If node is a source, patch stop to record its stopped / not stopped status.\n  if (node.stop && !node.__stopPatched) {\n    node.__stopPatched = true\n    node.__stop = node.stop\n    _playingNodes.set(node, true)\n\n    node.stop = (time) => {\n      node.__stop(time)\n      _playingNodes.delete(node)\n    }\n  }\n}\n\nfunction loadAudioFile(context, url) {\n  if (_audioFileCache[url]) { return Promise.resolve(_audioFileCache[url]) }\n  let promiseOfBuffer = audio_loader__WEBPACK_IMPORTED_MODULE_0___default()(url, { context })\n  promiseOfBuffer.then((buffer) => _audioFileCache[url] = buffer)\n  _audioFileCache[url] = promiseOfBuffer\n  return promiseOfBuffer\n}\n\n\n//# sourceURL=webpack://Partch/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Patch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Patch */ \"./src/Patch.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nodes_Adsr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nodes/Adsr */ \"./src/nodes/Adsr.js\");\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n/* harmony import */ var _nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nodes/noiseNodes */ \"./src/nodes/noiseNodes.js\");\n/* harmony import */ var _nodes_Over__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nodes/Over */ \"./src/nodes/Over.js\");\n/* harmony import */ var _nodes_Synth__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./nodes/Synth */ \"./src/nodes/Synth.js\");\n/* harmony import */ var _nodes_thirdPartyNodes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./nodes/thirdPartyNodes */ \"./src/nodes/thirdPartyNodes.js\");\n\n\n\n\n\n\n\n\n\nfunction getDefaultAudioContext() {\n  return window.__partchAudioContext ||\n    (window.__partchAudioContext = new window.AudioContext())\n}\n\nfunction Partch(context = getDefaultAudioContext()) {\n  let _Patch = _Patch__WEBPACK_IMPORTED_MODULE_0__[\"default\"].bind(null, context)\n  _Patch.context = context\n  _Patch.panic = _helpers__WEBPACK_IMPORTED_MODULE_1__[\"stopAllNodes\"]\n  _Patch.load = (url) => Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"loadAudioFile\"])(context, url)\n  ;[_nodes_Adsr__WEBPACK_IMPORTED_MODULE_2__[\"default\"], _nodes_Over__WEBPACK_IMPORTED_MODULE_5__[\"default\"], _nodes_Synth__WEBPACK_IMPORTED_MODULE_6__[\"default\"]]\n    .concat(Object.values(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_3__))\n    .concat(Object.values(_nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_4__))\n    .concat(Object.values(_nodes_thirdPartyNodes__WEBPACK_IMPORTED_MODULE_7__))\n    .forEach((f) => _Patch[f.name] = f.bind(null, context))\n  return _Patch\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Partch);\n\n\n//# sourceURL=webpack://Partch/./src/index.js?");

/***/ }),

/***/ "./src/nodes/Adsr.js":
/*!***************************!*\
  !*** ./src/nodes/Adsr.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\n// TODO Make an ADSR which responds naturally to being adjusted while playing.\nfunction Adsr(context, config = 1) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { release: config }\n  let attack = params.attack || params.a || 0.01\n  let decay = params.decay || params.d || 0\n  let sustain = params.sustain || params.s || 1\n  let release = params.release || params.r || 1\n  let level = params.level || 1\n  let node = Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Const\"])(context, 0)\n\n  node.triggerAttack = (time) => {\n    time = time || context.currentTime\n    node.offset.linearRampToValueAtTime(level, time + attack)\n    if (sustain < 1) {\n      node.offset.linearRampToValueAtTime(\n        level * sustain,\n        time + attack + decay\n      )\n    }\n    return node\n  }\n\n  node.triggerRelease = (time) => {\n    let currTime = context.currentTime\n    time = time || currTime\n    let wait = Math.max(0, (time - currTime) - 0.01)\n    let stopTime = time + release\n    setTimeout(() => {\n      node.offset.linearRampToValueAtTime(0, stopTime)\n      node.stop(stopTime)\n    }, wait * 1000)\n    return stopTime\n  }\n\n  return node\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Adsr);\n\n\n//# sourceURL=webpack://Partch/./src/nodes/Adsr.js?");

/***/ }),

/***/ "./src/nodes/Over.js":
/*!***************************!*\
  !*** ./src/nodes/Over.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n/* harmony import */ var _Patch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Patch */ \"./src/Patch.js\");\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\n\nconst CURVE_LEN = 8192\n\n// Adapted from https://github.com/Theodeus/tuna/blob/master/tuna.js#L1170\n// TODO Descriptive names for these?\nconst ALGOS = [\n  (arr, amount) => {\n    amount = Math.min(amount, 0.9999)\n    let k = 2 * amount / (1 - amount)\n    let i, x\n    for (i = 0; i < CURVE_LEN; i++) {\n      x = i * 2 / CURVE_LEN - 1\n      arr[i] = (1 + k) * x / (1 + k * Math.abs(x))\n    }\n  },\n  (arr, amount) => {\n    let i, x, y\n    for (i = 0; i < CURVE_LEN; i++) {\n      x = i * 2 / CURVE_LEN - 1\n      y = ((0.5 * Math.pow((x + 1.4), 2)) - 1) * y >= 0 ? 5.8 : 1.2\n      arr[i] = Math.tanh(y)\n    }\n  },\n  (arr, amount) => {\n    let a = 1 - amount\n    let i, x, y\n    for (i = 0; i < CURVE_LEN; i++) {\n      x = i * 2 / CURVE_LEN - 1\n      y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a)\n      arr[i] = Math.tanh(y * 2)\n    }\n  },\n  (arr, amount) => {\n    let a = 1 - amount > 0.99 ? 0.99 : 1 - amount\n    let i, x, y, abx\n    for (i = 0; i < CURVE_LEN; i++) {\n      x = i * 2 / CURVE_LEN - 1\n      abx = Math.abs(x)\n      if (abx < a) {\n        y = abx\n      } else if (abx > a) {\n        y = a + (abx - a) / (1 + Math.pow((abx - a) / (1 - a), 2))\n      } else if (abx > 1) {\n        y = abx\n      }\n      arr[i] = sign(x) * y * (1 / ((a + 1) / 2))\n    }\n  },\n  (arr, amount) => {\n    let i, x\n    for (i = 0; i < CURVE_LEN; i++) {\n      x = i * 2 / CURVE_LEN - 1\n      if (x < -0.08905) {\n        arr[i] =\n          (-3 / 4) *\n          (\n            1 -\n            (Math.pow((1 - (Math.abs(x) - 0.032857)), 12)) +\n            (1 / 3) *\n            (Math.abs(x) - 0.032847)\n          ) +\n          0.01\n      } else if (x >= -0.08905 && x < 0.320018) {\n        arr[i] = (-6.153 * (x * x)) + 3.9375 * x\n      } else {\n        arr[i] = 0.630035\n      }\n    }\n  },\n  (arr, amount) => {\n    let a = 2 + Math.round(amount * 14)\n    // we go from 2 to 16 bits, keep in mind for the UI\n    let bits = Math.round(Math.pow(2, a - 1))\n    // real number of quantization steps divided by 2\n    let i, x\n    for (i = 0; i < CURVE_LEN; i++) {\n      x = i * 2 / CURVE_LEN - 1\n      arr[i] = Math.round(x * bits) / bits\n    }\n  }\n]\n\nlet _curveCache = {}\n\nfunction sign(x) {\n  if (x === 0) {\n    return 1\n  } else {\n    return Math.abs(x) / x\n  }\n}\n\nfunction getCurve(algo = 0, amount = 0.725) {\n  let cacheKey = `${algo}/${amount}`\n  if (!_curveCache[cacheKey]) {\n    let arr = new Float32Array(CURVE_LEN)\n    ALGOS[algo](arr, amount)\n    _curveCache[cacheKey] = arr\n  }\n  return _curveCache[cacheKey]\n}\n\nfunction Over(context, config) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { drive: config }\n  let curve = getCurve(params.algo, params.shape)\n  return Object(_Patch__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(context, {\n    drive: Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_2__[\"Gain\"])(context, params.drive),\n    shaper: Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_2__[\"Shaper\"])(context, curve),\n    makeup: Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_2__[\"Gain\"])(context, params.makeup)\n  }, 'in > drive > shaper > makeup > out')\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Over);\n\n\n//# sourceURL=webpack://Partch/./src/nodes/Over.js?");

/***/ }),

/***/ "./src/nodes/Synth.js":
/*!****************************!*\
  !*** ./src/nodes/Synth.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var um_sequencer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! um-sequencer */ \"./node_modules/um-sequencer/index.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\n\nfunction twelveTet(nn, ref = 440) {\n  return nn && Math.pow(2, ((nn - 69) / 12)) * ref\n}\n\nfunction Synth(context, Voice) {\n  let synthOut = Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_2__[\"Gain\"])(context)\n  let sequencers = []\n\n  synthOut.play = (config) => {\n    if (!Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"isPlainObject\"])(config)) {\n      config = { nn: config || 69 }\n    }\n    let nn = config.nn || 69\n    let time = config.time || config.t || context.currentTime\n    let dur = config.dur || 0.2\n    let frequency = twelveTet(nn)\n    let voice = Voice(frequency)\n    voice.connect(synthOut)\n    voice.triggerAttack(time)\n    if (dur) {\n      voice.triggerRelease(time + dur)\n    }\n    return voice\n  }\n\n  synthOut.sequence = (events, options) => {\n    // Convert Partch events to um-sequencer events.\n    events = events.map((ev) => {\n      return {\n        time: ev.time || ev.t,\n        callback: (t) => synthOut.play({ ...ev, time: t })\n      }\n    })\n    let sequencer = Object(um_sequencer__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(() => context.currentTime)\n    sequencer.play(events, options)\n    sequencers.push(sequencer)\n    return sequencer\n  }\n\n  synthOut.test = (dur, nn) => {\n    synthOut.monitor().play({ dur, nn })\n  }\n\n  synthOut.stop = () => {\n    sequencers.forEach((s) => s.stop())\n    sequencers = []\n  }\n\n  // Partchify it again as it now has a stop method\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"partchifyNode\"])(synthOut)\n\n  return synthOut\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Synth);\n\n\n//# sourceURL=webpack://Partch/./src/nodes/Synth.js?");

/***/ }),

/***/ "./src/nodes/nativeNodes.js":
/*!**********************************!*\
  !*** ./src/nodes/nativeNodes.js ***!
  \**********************************/
/*! exports provided: Apf, Bpf, Const, Delay, Filter, Gain, HighShelf, Hpf, LowShelf, Lpf, Notch, Osc, Peak, Sample, Shaper, Saw, Sin, Sqr, Tri */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Apf\", function() { return Apf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Bpf\", function() { return Bpf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Const\", function() { return Const; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Delay\", function() { return Delay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Filter\", function() { return Filter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Gain\", function() { return Gain; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HighShelf\", function() { return HighShelf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Hpf\", function() { return Hpf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LowShelf\", function() { return LowShelf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Lpf\", function() { return Lpf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Notch\", function() { return Notch; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Osc\", function() { return Osc; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Peak\", function() { return Peak; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sample\", function() { return Sample; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Shaper\", function() { return Shaper; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Saw\", function() { return Saw; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sin\", function() { return Sin; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sqr\", function() { return Sqr; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Tri\", function() { return Tri; });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n\n\nconst CV_TO_GAIN_CURVE = Float32Array.from(\n  Array(8193).fill(null)\n    .map((__, i) => cvToGain(Math.abs(i - 4096) / 4096)\n  )\n)\nconst AUDIBLE_RANGE_IN_CENTS = 12000\n\nfunction cvToGain(cv) {\n  return cv ** 3.321928094887362 // 0 -> 0, 0.5 -> 0.1, 1 -> 1\n}\n\nfunction WaaNode(context, _constructor, defaultParam, isDest, config) {\n  let params = config === undefined || Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config)\n    ? config\n    : { [defaultParam]: config }\n  let node = new window[_constructor](context, params)\n  if (isDest) { node.input = node }\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"partchifyNode\"])(node)\n  if (node.start) { node.start(context.currentTime) }\n  return node\n}\n\nfunction OscillatorNode(context, type, config) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { frequency: config || 440 }\n  params = { type, ...params }\n  let node = WaaNode(context, 'OscillatorNode', 'frequency', false, params)\n  let frequencyCv\n\n  Object.defineProperty(node, 'frequencyCv', {\n    get() {\n      if (frequencyCv) { return frequencyCv }\n      let ctrl = Const(context, 0)\n      frequencyCv = ctrl.offset\n      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)\n      ctrl.connect(scaler).connect(node.detune)\n      return frequencyCv\n    }\n  })\n\n  if (params.frequencyCv) {\n    node.frequencyCv.value = params.frequencyCv\n  }\n\n  return node\n}\n\nfunction FilterNode(context, type, config) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { frequency: config || 350 }\n  params = { type, ...params }\n  let node = WaaNode(\n    context, 'BiquadFilterNode', 'frequency', true, params\n  )\n  let frequencyCv\n\n  Object.defineProperty(node, 'frequencyCv', {\n    get() {\n      if (frequencyCv) { return frequencyCv }\n      let ctrl = Const(context, 0)\n      frequencyCv = ctrl.offset\n      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)\n      ctrl.connect(scaler).connect(node.detune)\n      return frequencyCv\n    }\n  })\n\n  if (params.frequencyCv) {\n    node.frequencyCv.value = params.frequencyCv\n  }\n\n  return node\n}\n\nfunction Apf(context, config) {\n  return FilterNode(context, 'allpass', config)\n}\n\nfunction Bpf(context, config) {\n  return FilterNode(context, 'bandpass', config)\n}\n\nfunction Const(context, config) {\n  return WaaNode(context, 'ConstantSourceNode', 'offset', false, config)\n}\n\nfunction Delay(context, config) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { delayTime: config || 0 }\n  params = { delayTime: 0, maxDelayTime: 1, ...params }\n  if (params.delayTime > params.maxDelayTime) {\n    params.maxDelayTime = params.delayTime\n  }\n  return WaaNode(context, 'DelayNode', 'delayTime', true, params)\n}\n\nfunction Filter(context, config) {\n  return FilterNode(context, undefined, config)\n}\n\nfunction Gain(context, config) {\n  let node = WaaNode(context, 'GainNode', 'gain', true, config)\n  let gainCv\n\n  Object.defineProperty(node, 'gainCv', {\n    get() {\n      if (gainCv) { return gainCv }\n      let ctrl = Const(context, 0)\n      gainCv = ctrl.offset\n      let shaper = Shaper(context, CV_TO_GAIN_CURVE)\n      ctrl.connect(shaper).connect(node.gain)\n      return gainCv\n    }\n  })\n\n  if (config && config.gainCv) {\n    node.gainCv.value = config.gainCv\n  }\n\n  return node\n}\n\nfunction HighShelf(context, config) {\n  return FilterNode(context, 'highshelf', config)\n}\n\nfunction Hpf(context, config) {\n  return FilterNode(context, 'highpass', config)\n}\n\nfunction LowShelf(context, config) {\n  return FilterNode(context, 'lowshelf', config)\n}\n\nfunction Lpf(context, config) {\n  return FilterNode(context, 'lowpass', config)\n}\n\nfunction Notch(context, config) {\n  return FilterNode(context, 'notch', config)\n}\n\nfunction Osc(context, config) {\n  return OscillatorNode(context, undefined, config)\n}\n\nfunction Peak(context, config) {\n  return FilterNode(context, 'peaking', config)\n}\n\nfunction Sample(context, config) {\n  return WaaNode(context, 'AudioBufferSourceNode', 'buffer', false, config)\n}\n\nfunction Shaper(context, config) {\n  return WaaNode(context, 'WaveShaperNode', 'curve', true, config)\n}\n\nfunction Saw(context, config) {\n  return OscillatorNode(context, 'sawtooth', config)\n}\n\nfunction Sin(context, config) {\n  return OscillatorNode(context, 'sine', config)\n}\n\nfunction Sqr(context, config) {\n  return OscillatorNode(context, 'square', config)\n}\n\nfunction Tri(context, config) {\n  return OscillatorNode(context, 'triangle', config)\n}\n\n\n//# sourceURL=webpack://Partch/./src/nodes/nativeNodes.js?");

/***/ }),

/***/ "./src/nodes/noiseNodes.js":
/*!*********************************!*\
  !*** ./src/nodes/noiseNodes.js ***!
  \*********************************/
/*! exports provided: Noise, BrownNoise, PinkNoise, WhiteNoise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Noise\", function() { return Noise; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BrownNoise\", function() { return BrownNoise; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PinkNoise\", function() { return PinkNoise; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WhiteNoise\", function() { return WhiteNoise; });\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\nlet _brownNoiseBuffer\nlet _pinkNoiseBuffer\nlet _whiteNoiseBuffer\n\nfunction getBrownNoiseBuffer(context) {\n  // Adapted from https://github.com/mohayonao/brown-noise-node\n  if (_brownNoiseBuffer) { return _brownNoiseBuffer }\n\n  let noiseData = new Float32Array(context.sampleRate * 5)\n  let lastOut = 0\n  for (let i = 0, imax = noiseData.length; i < imax; i++) {\n    let white = Math.random() * 2 - 1\n\n    noiseData[i] = (lastOut + (0.02 * white)) / 1.02\n    lastOut = noiseData[i]\n    noiseData[i] *= 3.5 // (roughly) compensate for gain\n  }\n\n  let buffer = context.createBuffer(\n    1, noiseData.length, context.sampleRate\n  )\n  buffer.getChannelData(0).set(noiseData)\n  _brownNoiseBuffer = buffer\n  return buffer\n}\n\nfunction getPinkNoiseBuffer(context) {\n  // Adapted from https://github.com/mohayonao/pink-noise-node\n  if (_pinkNoiseBuffer) { return _pinkNoiseBuffer }\n\n  let noiseData = new Float32Array(context.sampleRate * 5)\n  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0\n  for (let i = 0, imax = noiseData.length; i < imax; i++) {\n    let white = Math.random() * 2 - 1\n\n    b0 = 0.99886 * b0 + white * 0.0555179\n    b1 = 0.99332 * b1 + white * 0.0750759\n    b2 = 0.96900 * b2 + white * 0.1538520\n    b3 = 0.86650 * b3 + white * 0.3104856\n    b4 = 0.55000 * b4 + white * 0.5329522\n    b5 = -0.7616 * b5 - white * 0.0168980\n\n    noiseData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362\n    noiseData[i] *= 0.11\n    b6 = white * 0.115926\n  }\n\n  let buffer = context.createBuffer(\n    1, noiseData.length, context.sampleRate\n  )\n  buffer.getChannelData(0).set(noiseData)\n  _pinkNoiseBuffer = buffer\n  return buffer\n}\n\nfunction getWhiteNoiseBuffer(context) {\n  // Adapted from http://noisehack.com/generate-noise-web-audio-api/\n  if (_whiteNoiseBuffer) { return _whiteNoiseBuffer }\n  let bufferSize = 2 * context.sampleRate\n  let buffer = context.createBuffer(1, bufferSize, context.sampleRate)\n  let output = buffer.getChannelData(0)\n  for (let i = 0; i < bufferSize; i++) {\n    output[i] = Math.random() * 2 - 1\n  }\n  _whiteNoiseBuffer = buffer\n  return buffer\n}\n\nfunction getNoiseBuffer(context, color = 'white') {\n  switch (color) {\n    case 'brown': return getBrownNoiseBuffer(context)\n    case 'pink': return getPinkNoiseBuffer(context)\n    default: return getWhiteNoiseBuffer(context)\n  }\n}\n\nfunction Noise(context, config = 'white') {\n  let color = config.color || config\n  let buffer = getNoiseBuffer(context, color)\n  return Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_0__[\"Sample\"])(context, { buffer, loop: true })\n}\n\nfunction BrownNoise(context) {\n  return Noise(context, 'brown')\n}\n\nfunction PinkNoise(context) {\n  return Noise(context, 'pink')\n}\n\nfunction WhiteNoise(context) {\n  return Noise(context, 'white')\n}\n\n\n//# sourceURL=webpack://Partch/./src/nodes/noiseNodes.js?");

/***/ }),

/***/ "./src/nodes/thirdPartyNodes.js":
/*!**************************************!*\
  !*** ./src/nodes/thirdPartyNodes.js ***!
  \**************************************/
/*! exports provided: Freeverb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Freeverb\", function() { return Freeverb; });\n/* harmony import */ var freeverb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! freeverb */ \"./node_modules/freeverb/index.js\");\n/* harmony import */ var freeverb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(freeverb__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n\n\n\nfunction Freeverb(context, config) {\n  let node = freeverb__WEBPACK_IMPORTED_MODULE_0___default()(context)\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"isPlainObject\"])(config) ? config : { wet: config }\n  node.wet.level = params.wet || 0\n  node.dry.level = params.dry == null ? 1 : params.dry\n  node.roomSize = params.roomSize || 0.8\n  node.dampening = params.dampening || 3000\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"partchifyNode\"])(node)\n  return node\n}\n\n\n//# sourceURL=webpack://Partch/./src/nodes/thirdPartyNodes.js?");

/***/ })

/******/ });
});