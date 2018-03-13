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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\nfunction Patch(context, nodes, ...connections) {\n\n  // Clone nodes collection as we will be mutating it.\n  nodes = { ...nodes }\n\n  // Connect nodes\n  connections.forEach((row) => row\n    .split('>')\n    .map((pp) => pp.trim())\n    .reduce((from, to) => {\n      if (from === 'in' && !nodes.in) {\n        nodes.in = Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Gain\"])(context)\n      }\n      if (to === 'out' && !nodes.out) {\n        nodes.out = Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Gain\"])(context)\n      }\n      let fromNode = nodes[from]\n      let toNode = getNodeFromPath(to)\n      fromNode.connect(toNode.input || toNode)\n\n      // We always connect from the root node of the path.\n      return to.split('.')[0]\n    })\n  )\n\n  function getNodeFromPath(path) {\n    let pathNodes = path.split('.')\n    return pathNodes.reduce((parent, child) => {\n      return parent[child] || (parent.nodes && parent.nodes[child])\n    }, nodes)\n  }\n\n  //// Patch instance methods //////////////////////////////////////////////////\n\n  function connect(...args) {\n    return nodes.out.connect(...args)\n  }\n\n  function disconnect(...args) {\n    return nodes.out.disconnect(...args)\n  }\n\n  function stop(time) {\n    let currTime = context.currentTime\n    time = time || currTime\n    Object.values(nodes).forEach((node) => node.stop && node.stop(time))\n    setTimeout(\n      () => nodes.out.disconnect(),\n      (time - currTime) * 1000\n    )\n    return patch\n  }\n\n  function triggerAttack(time) {\n    Object.values(nodes).forEach((node) => {\n      node.triggerAttack && node.triggerAttack(time)\n    })\n    return patch\n  }\n\n  function triggerRelease(time) {\n    time = time || context.currentTime\n    let stopTimes = Object.values(nodes)\n      .map((node) => node.triggerRelease ? node.triggerRelease(time) : time)\n    let stopTime = Math.max(...stopTimes)\n    // TODO Instead of waiting an arbitrarily long time, we should wait until\n    // the patch is no longer making sound for a while, *then* stop it. Also it\n    // should be possible to override this behaviour.\n    stop(stopTime + 30)\n    return patch\n  }\n\n  let patch = {\n    connect, disconnect, context, nodes, stop, triggerAttack, triggerRelease,\n    input: nodes.in\n  }\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"partchifyNode\"])(patch)\n  return patch\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Patch);\n\n\n//# sourceURL=webpack://Partch/./src/Patch.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: isPlainObject, resetContext, testNode, partchifyNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isPlainObject\", function() { return isPlainObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resetContext\", function() { return resetContext; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"testNode\", function() { return testNode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"partchifyNode\", function() { return partchifyNode; });\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n/* harmony import */ var _nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes/noiseNodes */ \"./src/nodes/noiseNodes.js\");\n// Circular references FTW\n\n\n\nlet _allNodes = []\n\nfunction isPlainObject(thing) {\n  return typeof thing === 'object' && thing.constructor === Object\n}\n\nfunction resetContext(context) {\n  context.__nodes.forEach((node) => {\n    if (node.stop && !node.__stopped) { node.stop() }\n    if (node.disconnect) { node.disconnect() }\n  })\n  context.__nodes = []\n}\n\nfunction testNode(node, dur = 0.2, type = 'bleep') {\n  // Monitor the node, and if the node is a destination, send a test sound\n  // through it, otherwise just stop it after a bit.\n  if (node.input) {\n    let src = type === 'noise' ? Object(_nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_1__[\"WhiteNoise\"])(node.context) : Object(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_0__[\"Saw\"])(node.context)\n    src.connect(node)\n    setTimeout(src.stop, dur * 1000)\n    setTimeout(node.stop, 10000)\n  } else {\n    setTimeout(node.stop, dur * 1000)\n  }\n  node.monitor()\n}\n\n// Takes a sad node and makes it better.\nfunction partchifyNode(node) {\n  node.__partchNode = true\n  node.context.__nodes.push(node)\n\n  // If node can be connected, make connect understand `node.input` and add\n  // monitor & test methods.\n  if (node.connect) {\n    node.__connect = node.connect\n    node.__disconnect = node.disconnect\n    node.__connections = []\n\n    node.connect = (destination) => {\n      node.__connect(destination.input || destination)\n      node.__connections.push(destination)\n      return destination\n    }\n\n    node.disconnect = (outputOrDestination, output, input) => {\n      if (!outputOrDestination) {\n        node.__disconnect()\n        node.__connections = []\n      } else if (!isNaN(outputOrDestination)) {\n        node.__disconnect(outputOrDestination)\n        // TODO Handle multiple outputs.\n      } else {\n        let destination = outputOrDestination\n        node.__disconnect(destination.input || destination, output, input)\n        node.__connections = node.__connections.filter((conn) => {\n          return conn !== destination\n        })\n      }\n      return node\n    }\n\n    node.monitor = () => {\n      node.__connect(node.context.destination)\n      return node\n    }\n\n    node.test = (...args) => testNode(node, ...args)\n  }\n\n  // If node is a source, patch stop to register its stoppedness.\n  if (node.stop) {\n    node.__stop = node.stop\n    node.__stopped = false\n\n    node.stop = (time) => {\n      node.__stop(time)\n      node.__stopped = true\n    }\n  }\n}\n\n\n//# sourceURL=webpack://Partch/./src/helpers.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Patch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Patch */ \"./src/Patch.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nodes_Adsr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nodes/Adsr */ \"./src/nodes/Adsr.js\");\n/* harmony import */ var _nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodes/nativeNodes */ \"./src/nodes/nativeNodes.js\");\n/* harmony import */ var _nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nodes/noiseNodes */ \"./src/nodes/noiseNodes.js\");\n/* harmony import */ var _nodes_Synth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nodes/Synth */ \"./src/nodes/Synth.js\");\n\n\n\n\n\n\n\nfunction getDefaultAudioContext() {\n  return window.__partchAudioContext ||\n    (window.__partchAudioContext = new window.AudioContext())\n}\n\nfunction Partch(context = getDefaultAudioContext()) {\n  context.__nodes = []\n  let _Patch = _Patch__WEBPACK_IMPORTED_MODULE_0__[\"default\"].bind(null, context)\n  _Patch.context = context\n  _Patch.panic = () => Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"resetContext\"])(context)\n  Object.values(_nodes_nativeNodes__WEBPACK_IMPORTED_MODULE_3__)\n    .concat(Object.values(_nodes_noiseNodes__WEBPACK_IMPORTED_MODULE_4__))\n    .concat(_nodes_Adsr__WEBPACK_IMPORTED_MODULE_2__[\"default\"], _nodes_Synth__WEBPACK_IMPORTED_MODULE_5__[\"default\"])\n    .forEach((f) => _Patch[f.name] = f.bind(null, context))\n  return _Patch\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Partch);\n\n\n//# sourceURL=webpack://Partch/./src/index.js?");

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

/***/ "./src/nodes/Synth.js":
/*!****************************!*\
  !*** ./src/nodes/Synth.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n/* harmony import */ var _nativeNodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nativeNodes */ \"./src/nodes/nativeNodes.js\");\n\n\n\nfunction twelveTet(nn, ref = 440) {\n  return nn && Math.pow(2, ((nn - 69) / 12)) * ref\n}\n\nfunction Synth(context, Voice) {\n  let synthOut = Object(_nativeNodes__WEBPACK_IMPORTED_MODULE_1__[\"Gain\"])(context)\n\n  synthOut.play = (config) => {\n    if (!Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config)) {\n      config = { nn: config || 69 }\n    }\n    let { nn = 69, time = context.currentTime, dur = 0.2 } = config\n    let frequency = twelveTet(nn)\n    let voice = Voice(frequency)\n    voice.connect(synthOut)\n    voice.triggerAttack(time)\n    if (dur) {\n      voice.triggerRelease(time + dur)\n    }\n    return voice\n  }\n\n  synthOut.test = (dur, note) => {\n    synthOut.monitor().play({ dur, note })\n  }\n\n  return synthOut\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Synth);\n\n\n//# sourceURL=webpack://Partch/./src/nodes/Synth.js?");

/***/ }),

/***/ "./src/nodes/nativeNodes.js":
/*!**********************************!*\
  !*** ./src/nodes/nativeNodes.js ***!
  \**********************************/
/*! exports provided: Apf, Bpf, Const, Delay, Filter, Gain, HighShelf, Hpf, LowShelf, Lpf, Notch, Osc, Peak, Sample, Shaper, Saw, Sin, Sqr, Tri */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Apf\", function() { return Apf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Bpf\", function() { return Bpf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Const\", function() { return Const; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Delay\", function() { return Delay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Filter\", function() { return Filter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Gain\", function() { return Gain; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HighShelf\", function() { return HighShelf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Hpf\", function() { return Hpf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LowShelf\", function() { return LowShelf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Lpf\", function() { return Lpf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Notch\", function() { return Notch; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Osc\", function() { return Osc; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Peak\", function() { return Peak; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sample\", function() { return Sample; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Shaper\", function() { return Shaper; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Saw\", function() { return Saw; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sin\", function() { return Sin; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Sqr\", function() { return Sqr; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Tri\", function() { return Tri; });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ \"./src/helpers.js\");\n\n\nconst CV_TO_GAIN_CURVE = Float32Array.from(\n  Array(8193).fill(null)\n    .map((__, i) => cvToGain(Math.abs(i - 4096) / 4096)\n  )\n)\nconst AUDIBLE_RANGE_IN_CENTS = 12000\n\nfunction cvToGain(cv) {\n  return cv ** 3.321928094887362 // 0 -> 0, 0.5 -> 0.1, 1 -> 1\n}\n\nfunction WaaNode(context, _constructor, defaultParam, isDest, config) {\n  let params = config === undefined || Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config)\n    ? config\n    : { [defaultParam]: config }\n  let node = new window[_constructor](context, params)\n  if (isDest) { node.input = node }\n  Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"partchifyNode\"])(node)\n  if (node.start) { node.start(context.currentTime) }\n  return node\n}\n\nfunction OscillatorNode(context, type, config) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { frequency: config || 440 }\n  params = { type, ...params }\n  let node = WaaNode(context, 'OscillatorNode', 'frequency', false, params)\n  let frequencyCv\n\n  Object.defineProperty(node, 'frequencyCv', {\n    get() {\n      if (frequencyCv) { return frequencyCv }\n      let ctrl = Const(context, 0)\n      frequencyCv = ctrl.offset\n      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)\n      ctrl.connect(scaler).connect(node.detune)\n      return frequencyCv\n    }\n  })\n\n  if (params.frequencyCv) {\n    node.frequencyCv.value = params.frequencyCv\n  }\n\n  return node\n}\n\nfunction FilterNode(context, type, config) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { frequency: config || 350 }\n  params = { type, ...params }\n  let node = WaaNode(\n    context, 'BiquadFilterNode', 'frequency', true, params\n  )\n  let frequencyCv\n\n  Object.defineProperty(node, 'frequencyCv', {\n    get() {\n      if (frequencyCv) { return frequencyCv }\n      let ctrl = Const(context, 0)\n      frequencyCv = ctrl.offset\n      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)\n      ctrl.connect(scaler).connect(node.detune)\n      return frequencyCv\n    }\n  })\n\n  if (params.frequencyCv) {\n    node.frequencyCv.value = params.frequencyCv\n  }\n\n  return node\n}\n\nfunction Apf(context, config) {\n  return FilterNode(context, 'allpass', config)\n}\n\nfunction Bpf(context, config) {\n  return FilterNode(context, 'bandpass', config)\n}\n\nfunction Const(context, config) {\n  return WaaNode(context, 'ConstantSourceNode', 'offset', false, config)\n}\n\nfunction Delay(context, config) {\n  let params = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isPlainObject\"])(config) ? config : { delayTime: config || 0 }\n  params = { delayTime: 0, maxDelayTime: 1, ...params }\n  if (params.delayTime > params.maxDelayTime) {\n    params.maxDelayTime = params.delayTime\n  }\n  return WaaNode(context, 'DelayNode', 'delayTime', true, params)\n}\n\nfunction Filter(context, config) {\n  return FilterNode(context, undefined, config)\n}\n\nfunction Gain(context, config) {\n  let node = WaaNode(context, 'GainNode', 'gain', true, config)\n  let gainCv\n\n  Object.defineProperty(node, 'gainCv', {\n    get() {\n      if (gainCv) { return gainCv }\n      let ctrl = Const(context, 0)\n      gainCv = ctrl.offset\n      let shaper = Shaper(context, CV_TO_GAIN_CURVE)\n      ctrl.connect(shaper).connect(node.gain)\n      return gainCv\n    }\n  })\n\n  if (config.gainCv) {\n    node.gainCv.value = config.gainCv\n  }\n\n  return node\n}\n\nfunction HighShelf(context, config) {\n  return FilterNode(context, 'highshelf', config)\n}\n\nfunction Hpf(context, config) {\n  return FilterNode(context, 'highpass', config)\n}\n\nfunction LowShelf(context, config) {\n  return FilterNode(context, 'lowshelf', config)\n}\n\nfunction Lpf(context, config) {\n  return FilterNode(context, 'lowpass', config)\n}\n\nfunction Notch(context, config) {\n  return FilterNode(context, 'notch', config)\n}\n\nfunction Osc(context, config) {\n  return OscillatorNode(context, undefined, config)\n}\n\nfunction Peak(context, config) {\n  return FilterNode(context, 'peaking', config)\n}\n\nfunction Sample(context, config) {\n  return WaaNode(context, 'AudioBufferSourceNode', 'buffer', false, config)\n}\n\nfunction Shaper(context, config) {\n  return WaaNode(context, 'WaveShaperNode', 'curve', true, config)\n}\n\nfunction Saw(context, config) {\n  return OscillatorNode(context, 'sawtooth', config)\n}\n\nfunction Sin(context, config) {\n  return OscillatorNode(context, 'sine', config)\n}\n\nfunction Sqr(context, config) {\n  return OscillatorNode(context, 'square', config)\n}\n\nfunction Tri(context, config) {\n  return OscillatorNode(context, 'triangle', config)\n}\n\n\n//# sourceURL=webpack://Partch/./src/nodes/nativeNodes.js?");

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