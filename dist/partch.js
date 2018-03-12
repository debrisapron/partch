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

/***/ "./src/Patch.js":
/*!**********************!*\
  !*** ./src/Patch.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\nfunction Patch(context, nodes, ...connections) {\n\n  // Clone nodes collection as we will be mutating it.\n  nodes = { ...nodes }\n\n  // Connect nodes\n  connections.forEach((row) => row\n    .split('>')\n    .map((pp) => pp.trim())\n    .reduce((from, to) => {\n      if (from === 'in' && !nodes.in) {\n        nodes.in = Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Gain\"])(context)\n      }\n      if (to === 'out' && !nodes.out) {\n        nodes.out = Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Gain\"])(context)\n      }\n      let fromNode = nodes[from]\n      let toNode = getNodeFromPath(to)\n      fromNode.connect(toNode.input || toNode)\n\n      // We always connect from the root node of the path.\n      return to.split('.')[0]\n    })\n  )\n\n  function getNodeFromPath(path) {\n    let pathNodes = path.split('.')\n    return pathNodes.reduce((parent, child) => {\n      return parent[child] || (parent.nodes && parent.nodes[child])\n    }, nodes)\n  }\n\n  //// Patch instance methods //////////////////////////////////////////////////\n\n  function start(time = 0) {\n    Object.values(nodes).forEach((node) => node.start && node.start(time))\n    return patch\n  }\n\n  function stop(time = 0) {\n    Object.values(nodes).forEach((node) => node.stop && node.stop(time))\n    return patch\n  }\n\n  function release(time = 0) {\n    let stopTimes = Object.values(nodes)\n      .map((node) => node.release ? node.release(time) : time)\n    let stopTime = Math.max(...stopTimes)\n    stop(stopTime)\n    return patch\n  }\n\n  function connect(destination) {\n    return nodes.out.connect(destination)\n  }\n\n  let patch = {\n    connect, context, nodes, release, start, stop,\n    input: nodes.in\n  }\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"partchifyNode\"])(patch)\n  return patch\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Patch);\n\n\n//# sourceURL=webpack://Partch/./src/Patch.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: isPlainObject, resetContext, testNode, partchifyNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isPlainObject\", function() { return isPlainObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resetContext\", function() { return resetContext; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"testNode\", function() { return testNode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"partchifyNode\", function() { return partchifyNode; });\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n/* harmony import */ var _nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes/noiseNodes */ \"./src/nodes/noiseNodes.js\");\n// Circular references FTW\n\n\n\nlet _allNodes = []\n\nfunction isPlainObject(thing) {\n  return typeof thing === 'object' && thing.constructor === Object\n}\n\nfunction resetContext(context) {\n  context.__nodes.forEach((node) => {\n    if (node.__started && !node.__stopped) { node.stop() }\n    if (node.disconnect) { node.disconnect() }\n  })\n  context.__nodes = []\n}\n\nfunction testNode(node, dur = 0.2, type) {\n  // If the node is a destination, test sends a test sound through it, otherwise\n  // just starts & stops it.\n  node.monitor()\n  if (node.start) { node.start().stopAfter(dur) }\n  if (node.input) {\n    let src = type === 'noise'\n      ? Object(_nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_1__[\"WhiteNoise\"])(node.context)\n      : Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_0__[\"Osc\"])(node.context, { type: 'sawtooth' })\n    src.start().stopAfter(dur).connect(node)\n  }\n}\n\n// Takes a sad node and makes it better.\nfunction partchifyNode(node) {\n  node.__partchNode = true\n  node.context.__nodes.push(node)\n\n  // If node can be connected, make connect understand `node.input` and add\n  // monitor & test methods.\n  if (node.connect) {\n    node.__connect = node.connect\n    node.__disconnect = node.disconnect\n    node.__connections = []\n\n    node.connect = (destination) => {\n      node.__connect(destination.input || destination)\n      node.__connections.push(destination)\n      return destination\n    }\n\n    node.disconnect = (outputOrDestination, output, input) => {\n      if (!outputOrDestination) {\n        node.__disconnect()\n        node.__connections = []\n      } else if (!isNaN(outputOrDestination)) {\n        node.__disconnect(outputOrDestination)\n        // TODO Handle multiple outputs.\n      } else {\n        let destination = outputOrDestination\n        node.__disconnect(destination.input || destination, output, input)\n        node.__connections = node.__connections.filter((conn) => {\n          return conn !== destination\n        })\n      }\n      return node\n    }\n\n    node.monitor = () => {\n      node.__connect(node.context.destination)\n      return node\n    }\n\n    node.test = (...args) => testNode(node, ...args)\n  }\n\n  // If node is a source, make start & stop return the node and add stopAfter.\n  if (node.start) {\n    node.__start = node.start\n    node.__stop = node.stop\n    node.__started = false\n    node.__stopped = false\n\n    node.start = (time) => {\n      node.__start(time)\n      node.__started = true\n      return node\n    }\n\n    node.stop = (time) => {\n      node.__stop(time)\n      node.__stopped = true\n      return node\n    }\n\n    node.stopAfter = (interval) => {\n      let stopTime = interval + node.context.currentTime\n      let timeout = Math.abs((interval * 1000) - 10)\n      setTimeout(() => node.__stop(stopTime), timeout)\n      return node\n    }\n  }\n\n  // If node has a release function, add releaseAfter.\n  if (node.release) {\n    node.releaseAfter = (interval) => {\n      let releaseTime = interval + node.context.currentTime\n      let timeout = Math.abs((interval * 1000) - 10)\n      setTimeout(() => node.release(releaseTime), timeout)\n      return node\n    }\n  }\n}\n\n\n//# sourceURL=webpack://Partch/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Patch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Patch */ \"./src/Patch.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nodes_Adsr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nodes/Adsr */ \"./src/nodes/Adsr.js\");\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n/* harmony import */ var _nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nodes/noiseNodes */ \"./src/nodes/noiseNodes.js\");\n/* harmony import */ var _nodes_Synth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nodes/Synth */ \"./src/nodes/Synth.js\");\n\n\n\n\n\n\n\nfunction getDefaultAudioContext() {\n  return window.__partchAudioContext ||\n    (window.__partchAudioContext = new window.AudioContext())\n}\n\nfunction Partch(context = getDefaultAudioContext()) {\n  context.__nodes = []\n  let _Patch = _Patch__WEBPACK_IMPORTED_MODULE_0__[\"default\"].bind(null, context)\n  _Patch.context = context\n  _Patch.panic = () => resetContext(context)\n  Object.values(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_3__)\n    .concat(Object.values(_nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_4__))\n    .concat(_nodes_Adsr__WEBPACK_IMPORTED_MODULE_2__[\"default\"], _nodes_Synth__WEBPACK_IMPORTED_MODULE_5__[\"default\"])\n    .forEach((f) => _Patch[f.name] = f.bind(null, context))\n  return _Patch\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Partch);\n\n\n//# sourceURL=webpack://Partch/./src/index.js?");

/***/ }),

/***/ "./src/nodes/Adsr.js":
/*!***************************!*\
  !*** ./src/nodes/Adsr.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\n// TODO Make an ADSR which responds naturally to being adjusted while playing.\nfunction Adsr(context, config = 1) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { release: config }\n  let {\n    attack = 0.01,\n    decay = 0,\n    sustain = 1,\n    release = 1,\n    level = 1\n  } = params\n  let node = Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Const\"])(context, 0)\n  let _start = node.start\n\n  node.start = (time) => {\n    time = time || context.currentTime\n    _start(time)\n    node.offset.linearRampToValueAtTime(level, time + attack)\n    if (sustain < 1) {\n      node.offset.linearRampToValueAtTime(\n        level * sustain,\n        time + attack + decay\n      )\n    }\n    return node\n  }\n\n  node.release = (time) => {\n    time = time || context.currentTime\n    let stopTime = time + release\n    node.offset.linearRampToValueAtTime(0, stopTime)\n    node.stop(stopTime)\n    return stopTime\n  }\n\n  return node\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Adsr);\n\n\n//# sourceURL=webpack://Partch/./src/nodes/Adsr.js?");

/***/ }),

/***/ "./src/nodes/Synth.js":
/*!****************************!*\
  !*** ./src/nodes/Synth.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\nfunction twelveTet(nn, ref = 440) {\n  return nn && Math.pow(2, ((nn - 69) / 12)) * ref\n}\n\nfunction Synth(context, Voice) {\n  let synthOut = Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_0__[\"Gain\"])(context)\n\n  synthOut.play = (note = 69, time = 0) => {\n    let frequency = twelveTet(note)\n    let voice = Voice(frequency)\n    voice.connect(synthOut)\n    voice.start(time)\n    return voice\n  }\n\n  synthOut.test = (dur = 0.2, note) => {\n    synthOut.monitor().play(note).releaseAfter(dur)\n  }\n\n  return synthOut\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Synth);\n\n\n//# sourceURL=webpack://Partch/./src/nodes/Synth.js?");

/***/ }),

/***/ "./src/nodes/nativeNodes.js":
/*!**********************************!*\
  !*** ./src/nodes/nativeNodes.js ***!
  \**********************************/
/*! exports provided: Const, Delay, Filter, Gain, Osc, Sample, Shaper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Const\", function() { return Const; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Delay\", function() { return Delay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Filter\", function() { return Filter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Gain\", function() { return Gain; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Osc\", function() { return Osc; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sample\", function() { return Sample; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Shaper\", function() { return Shaper; });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n\n\nconst CV_TO_GAIN_CURVE = Float32Array.from(\n  Array(8193).fill(null)\n    .map((__, i) => cvToGain(Math.abs(i - 4096) / 4096)\n  )\n)\nconst AUDIBLE_RANGE_IN_CENTS = 12000\n\nfunction cvToGain(cv) {\n  return cv ** 3.321928094887362 // 0 -> 0, 0.5 -> 0.1, 1 -> 1\n}\n\nfunction WaaNode(context, _constructor, defaultParam, isDest, config) {\n  let params = config === undefined || Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config)\n    ? config\n    : { [defaultParam]: config }\n  let node = new window[_constructor](context, params)\n  if (isDest) { node.input = node }\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"partchifyNode\"])(node)\n  return node\n}\n\nfunction Const(context, config) {\n  return WaaNode(context, 'ConstantSourceNode', 'offset', false, config)\n}\n\nfunction Delay(context, config) {\n  return WaaNode(context, 'DelayNode', 'delayTime', true, config)\n}\n\nfunction Filter(context, config) {\n  let node = WaaNode(\n    context, 'BiquadFilterNode', 'frequency', true, config\n  )\n\n  Object.defineProperty(node, 'frequencyCv', {\n    get() {\n      let ctrl = Const(context, 0)\n      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)\n      ctrl.connect(scaler).connect(node.detune)\n      ctrl.start()\n      return ctrl.offset\n    }\n  })\n\n  return node\n}\n\nfunction Gain(context, config) {\n  let node = WaaNode(context, 'GainNode', 'gain', true, config)\n\n  Object.defineProperty(node, 'gainCv', {\n    get() {\n      let ctrl = Const(context, 0)\n      let shaper = Shaper(context, CV_TO_GAIN_CURVE)\n      ctrl.connect(shaper).connect(node.gain)\n      ctrl.start()\n      return ctrl.offset\n    }\n  })\n\n  return node\n}\n\nfunction Osc(context, config) {\n  let node = WaaNode(context, 'OscillatorNode', 'frequency', false, config)\n\n  Object.defineProperty(node, 'frequencyCv', {\n    get() {\n      let ctrl = Const(context, 0)\n      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)\n      ctrl.connect(scaler).connect(node.detune)\n      ctrl.start()\n      return ctrl.offset\n    }\n  })\n\n  return node\n}\n\nfunction Sample(context, config) {\n  return WaaNode(context, 'AudioBufferSourceNode', 'buffer', false, config)\n}\n\nfunction Shaper(context, config) {\n  return WaaNode(context, 'WaveShaperNode', 'curve', true, config)\n}\n\n\n//# sourceURL=webpack://Partch/./src/nodes/nativeNodes.js?");

/***/ }),

/***/ "./src/nodes/noiseNodes.js":
/*!*********************************!*\
  !*** ./src/nodes/noiseNodes.js ***!
  \*********************************/
/*! exports provided: Noise, BrownNoise, PinkNoise, WhiteNoise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Noise\", function() { return Noise; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BrownNoise\", function() { return BrownNoise; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PinkNoise\", function() { return PinkNoise; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WhiteNoise\", function() { return WhiteNoise; });\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\nlet _brownNoiseBuffer\nlet _pinkNoiseBuffer\nlet _whiteNoiseBuffer\n\nfunction getBrownNoiseBuffer(context) {\n  // Adapted from https://github.com/mohayonao/brown-noise-node\n  if (_brownNoiseBuffer) { return _brownNoiseBuffer }\n\n  let noiseData = new Float32Array(context.sampleRate * 5)\n  let lastOut = 0\n  for (let i = 0, imax = noiseData.length; i < imax; i++) {\n    let white = Math.random() * 2 - 1\n\n    noiseData[i] = (lastOut + (0.02 * white)) / 1.02\n    lastOut = noiseData[i]\n    noiseData[i] *= 3.5 // (roughly) compensate for gain\n  }\n\n  let buffer = context.createBuffer(\n    1, noiseData.length, context.sampleRate\n  )\n  buffer.getChannelData(0).set(noiseData)\n  _brownNoiseBuffer = buffer\n  return buffer\n}\n\nfunction getPinkNoiseBuffer(context) {\n  // Adapted from https://github.com/mohayonao/pink-noise-node\n  if (_pinkNoiseBuffer) { return _pinkNoiseBuffer }\n\n  let noiseData = new Float32Array(context.sampleRate * 5)\n  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0\n  for (let i = 0, imax = noiseData.length; i < imax; i++) {\n    let white = Math.random() * 2 - 1\n\n    b0 = 0.99886 * b0 + white * 0.0555179\n    b1 = 0.99332 * b1 + white * 0.0750759\n    b2 = 0.96900 * b2 + white * 0.1538520\n    b3 = 0.86650 * b3 + white * 0.3104856\n    b4 = 0.55000 * b4 + white * 0.5329522\n    b5 = -0.7616 * b5 - white * 0.0168980\n\n    noiseData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362\n    noiseData[i] *= 0.11\n    b6 = white * 0.115926\n  }\n\n  let buffer = context.createBuffer(\n    1, noiseData.length, context.sampleRate\n  )\n  buffer.getChannelData(0).set(noiseData)\n  _pinkNoiseBuffer = buffer\n  return buffer\n}\n\nfunction getWhiteNoiseBuffer(context) {\n  // Adapted from http://noisehack.com/generate-noise-web-audio-api/\n  if (_whiteNoiseBuffer) { return _whiteNoiseBuffer }\n  let bufferSize = 2 * context.sampleRate\n  let buffer = context.createBuffer(1, bufferSize, context.sampleRate)\n  let output = buffer.getChannelData(0)\n  for (let i = 0; i < bufferSize; i++) {\n    output[i] = Math.random() * 2 - 1\n  }\n  _whiteNoiseBuffer = buffer\n  return buffer\n}\n\nfunction getNoiseBuffer(context, color = 'white') {\n  switch (color) {\n    case 'brown': return getBrownNoiseBuffer(context)\n    case 'pink': return getPinkNoiseBuffer(context)\n    default: return getWhiteNoiseBuffer(context)\n  }\n}\n\nfunction Noise(context, config = 'white') {\n  let color = config.color || config\n  let buffer = getNoiseBuffer(context, color)\n  return Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_0__[\"Sample\"])(context, { buffer, loop: true })\n}\n\nfunction BrownNoise(context) {\n  return Noise(context, 'brown')\n}\n\nfunction PinkNoise(context) {\n  return Noise(context, 'pink')\n}\n\nfunction WhiteNoise(context) {\n  return Noise(context, 'white')\n}\n\n\n//# sourceURL=webpack://Partch/./src/nodes/noiseNodes.js?");

/***/ })

/******/ });
});