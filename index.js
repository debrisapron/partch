//// Constants /////////////////////////////////////////////////////////////////

const CV_TO_GAIN_CURVE = Float32Array.from(
  Array(8193).fill(null)
    .map((__, i) => cvToGain(Math.abs(i - 4096) / 4096)
  )
)
const AUDIBLE_RANGE_IN_CENTS = 12000


//// Globals ///////////////////////////////////////////////////////////////////

let _brownNoiseBuffer
let _pinkNoiseBuffer
let _whiteNoiseBuffer
let _allNodes = []


//// Helpers ///////////////////////////////////////////////////////////////////

function getDefaultAudioContext() {
  return window.__partchAudioContext ||
    (window.__partchAudioContext = new window.AudioContext())
}

function twelveTet(nn, ref = 440) {
  return nn && Math.pow(2, ((nn - 69) / 12)) * ref
}

function isPlainObject(thing) {
  return typeof thing === 'object' && thing.constructor === Object
}

function getNodeFromPath(nodes, path) {
  let pathNodes = path.split('.')
  return pathNodes.reduce((parent, child) => {
    return parent[child] || (parent.nodes && parent.nodes[child])
  }, nodes)
}

function cvToGain(cv) {
  return cv ** 3.321928094887362 // 0 -> 0, 0.5 -> 0.1, 1 -> 1
}

function getNoiseBuffer(audioContext, color = 'white') {
  switch (color) {
    case 'brown': return getBrownNoiseBuffer(audioContext)
    case 'pink': return getPinkNoiseBuffer(audioContext)
    default: return getWhiteNoiseBuffer(audioContext)
  }
}

function getBrownNoiseBuffer(audioContext) {
  // Adapted from https://github.com/mohayonao/brown-noise-node
  if (_brownNoiseBuffer) { return _brownNoiseBuffer }

  let noiseData = new Float32Array(audioContext.sampleRate * 5)
  let lastOut = 0
  for (let i = 0, imax = noiseData.length; i < imax; i++) {
    let white = Math.random() * 2 - 1

    noiseData[i] = (lastOut + (0.02 * white)) / 1.02
    lastOut = noiseData[i]
    noiseData[i] *= 3.5 // (roughly) compensate for gain
  }

  let buffer = audioContext.createBuffer(
    1, noiseData.length, audioContext.sampleRate
  )
  buffer.getChannelData(0).set(noiseData)
  _brownNoiseBuffer = buffer
  return buffer
}

function getPinkNoiseBuffer(audioContext) {
  // Adapted from https://github.com/mohayonao/pink-noise-node
  if (_pinkNoiseBuffer) { return _pinkNoiseBuffer }

  let noiseData = new Float32Array(audioContext.sampleRate * 5)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0, imax = noiseData.length; i < imax; i++) {
    let white = Math.random() * 2 - 1

    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.96900 * b2 + white * 0.1538520
    b3 = 0.86650 * b3 + white * 0.3104856
    b4 = 0.55000 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.0168980

    noiseData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
    noiseData[i] *= 0.11
    b6 = white * 0.115926
  }

  let buffer = audioContext.createBuffer(
    1, noiseData.length, audioContext.sampleRate
  )
  buffer.getChannelData(0).set(noiseData)
  _pinkNoiseBuffer = buffer
  return buffer
}

function getWhiteNoiseBuffer(audioContext) {
  // Adapted from http://noisehack.com/generate-noise-web-audio-api/
  if (_whiteNoiseBuffer) { return _whiteNoiseBuffer }
  let bufferSize = 2 * audioContext.sampleRate
  let buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
  let output = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1
  }
  _whiteNoiseBuffer = buffer
  return buffer
}

function stopAndDisconnectAllNodes() {
  _allNodes.forEach((node) => {
    node.__started && node.stop()
    node.disconnect && node.disconnect()
  })
  _allNodes = []
}

// Takes a sad node and makes it better.
function partchifyNode(audioContext, node) {
  node.__connect = node.connect
  node.__start = node.start
  node.__stop = node.stop
  node.__started = false
  _allNodes.push(node)

  // If node can be connected, make connect understand `node.input` and add
  // monitor function.
  if (node.connect) {
    node.connect = (destination) => {
      node.__connect(destination.input || destination)
      return destination
    }

    // TODO Make `disconnect` understand `node.input`.

    node.monitor = () => {
      node.__connect(audioContext.destination)
      return node
    }
  }

  // If node is a source, make start & stop return the node and add stopAfter.
  if (node.start) {
    node.start = (time) => {
      node.__start(time)
      node.__started = true
      return node
    }

    node.stop = (time) => {
      node.__stop(time)
      return node
    }

    node.stopAfter = (interval) => {
      let stopTime = interval + audioContext.currentTime
      let timeout = Math.abs((interval * 1000) - 10)
      setTimeout(() => node.__stop(stopTime), timeout)
      return node
    }
  }

  // If node has a release function, add releaseAfter.
  if (node.release) {
    node.releaseAfter = (interval) => {
      let releaseTime = interval + audioContext.currentTime
      let timeout = Math.abs((interval * 1000) - 10)
      setTimeout(() => node.release(releaseTime), timeout)
      return node
    }
  }

  // Add a test function. If the node is a destination, test sends a test sound
  // through it, otherwise just starts & stops it.
  if (node.connect) {
    node.test = (dur = 0.2, type) => {
      node.monitor()
      if (node.start) { node.start().stopAfter(dur) }
      if (node.input) {
        let src = type === 'noise'
          ? WhiteNoise(audioContext)
          : Osc(audioContext, { type: 'sawtooth' })
        src.start().stopAfter(dur).connect(node)
      }
    }
  }
}


//// Node factories ////////////////////////////////////////////////////////////

// TODO Make an ADSR which responds naturally to being adjusted while playing.
function Adsr(audioContext, config = 1) {
  let params = isPlainObject(config) ? config : { release: config }
  let {
    attack = 0.01,
    decay = 0,
    sustain = 1,
    release = 1,
    level = 1
  } = params
  let node = Const(audioContext, 0)
  let _start = node.start

  node.start = (time) => {
    time = time || audioContext.currentTime
    _start(time)
    node.offset.linearRampToValueAtTime(level, time + attack)
    if (sustain < 1) {
      node.offset.linearRampToValueAtTime(
        level * sustain,
        time + attack + decay
      )
    }
    return node
  }

  node.release = (time) => {
    time = time || audioContext.currentTime
    let stopTime = time + release
    node.offset.linearRampToValueAtTime(0, stopTime)
    node.stop(stopTime)
    return stopTime
  }

  return node
}

function BrownNoise(audioContext) {
  return Noise(audioContext, 'brown')
}

function Const(audioContext, config) {
  return WaaNode(audioContext, 'ConstantSourceNode', 'offset', false, config)
}

function Delay(audioContext, config) {
  return WaaNode(audioContext, 'DelayNode', 'delayTime', true, config)
}

function Filter(audioContext, config) {
  let node = WaaNode(
    audioContext, 'BiquadFilterNode', 'frequency', true, config
  )

  Object.defineProperty(node, 'frequencyCv', {
    get() {
      let ctrl = Const(audioContext, 0)
      let scaler = Gain(audioContext, AUDIBLE_RANGE_IN_CENTS)
      ctrl.connect(scaler).connect(node.detune)
      ctrl.start()
      return ctrl.offset
    }
  })

  return node
}

function Gain(audioContext, config) {
  let node = WaaNode(audioContext, 'GainNode', 'gain', true, config)

  Object.defineProperty(node, 'gainCv', {
    get() {
      let ctrl = Const(audioContext, 0)
      let shaper = Shaper(audioContext, CV_TO_GAIN_CURVE)
      ctrl.connect(shaper).connect(node.gain)
      ctrl.start()
      return ctrl.offset
    }
  })

  return node
}

function Noise(audioContext, config = 'white') {
  let color = config.color || config
  let buffer = getNoiseBuffer(audioContext, color)
  return Sample(audioContext, { buffer, loop: true })
}

function Osc(audioContext, config) {
  let node = WaaNode(audioContext, 'OscillatorNode', 'frequency', false, config)

  Object.defineProperty(node, 'frequencyCv', {
    get() {
      let ctrl = Const(audioContext, 0)
      let scaler = Gain(audioContext, AUDIBLE_RANGE_IN_CENTS)
      ctrl.connect(scaler).connect(node.detune)
      ctrl.start()
      return ctrl.offset
    }
  })

  return node
}

function PinkNoise(audioContext) {
  return Noise(audioContext, 'pink')
}

function Sample(audioContext, config) {
  return WaaNode(audioContext, 'AudioBufferSourceNode', 'buffer', false, config)
}

function Shaper(audioContext, config) {
  return WaaNode(audioContext, 'WaveShaperNode', 'curve', true, config)
}

function Synth(audioContext, Voice) {
  let synthOut = Gain(audioContext)

  synthOut.play = (note = 69, time = 0) => {
    let frequency = twelveTet(note)
    let voice = Voice(frequency)
    voice.connect(synthOut)
    voice.start(time)
    return voice
  }

  synthOut.test = (dur = 0.2, note) => {
    synthOut.monitor().play(note).releaseAfter(dur)
  }

  return synthOut
}

function WaaNode(audioContext, _constructor, defaultParam, isDest, config) {
  let params = config === undefined || isPlainObject(config)
    ? config
    : { [defaultParam]: config }
  let node = new window[_constructor](audioContext, params)
  if (isDest) { node.input = node }
  partchifyNode(audioContext, node)
  return node
}

function WhiteNoise(audioContext) {
  return Noise(audioContext, 'white')
}


//// Patch factory /////////////////////////////////////////////////////////////

function Patch(audioContext, nodes, ...connections) {

  // Clone nodes collection as we will be mutating it.
  nodes = { ...nodes }

  // Connect nodes
  connections.forEach((row) => row
    .split('>')
    .map((pp) => pp.trim())
    .reduce((from, to) => {
      if (from === 'in' && !nodes.in) {
        nodes.in = Gain(audioContext)
      }
      if (to === 'out' && !nodes.out) {
        nodes.out = Gain(audioContext)
      }
      let fromNode = nodes[from]
      let toNode = getNodeFromPath(nodes, to)
      fromNode.connect(toNode.input || toNode)

      // We always connect from the root node of the path.
      return to.split('.')[0]
    })
  )


  //// Patch instance methods //////////////////////////////////////////////////

  function start(time = 0) {
    Object.values(nodes).forEach((node) => node.start && node.start(time))
    return patch
  }

  function stop(time = 0) {
    Object.values(nodes).forEach((node) => node.stop && node.stop(time))
    return patch
  }

  function release(time = 0) {
    let stopTimes = Object.values(nodes)
      .map((node) => node.release ? node.release(time) : time)
    let stopTime = Math.max(...stopTimes)
    stop(stopTime)
    return patch
  }

  function connect(destination) {
    return nodes.out.connect(destination)
  }


  //// Patch API ///////////////////////////////////////////////////////////////

  let patch = { connect, nodes, release, start, stop, input: nodes.in }
  partchifyNode(audioContext, patch)
  return patch
}

//// Top-level API /////////////////////////////////////////////////////////////

function Patcher(audioContext = getDefaultAudioContext()) {
  let _Patch = Patch.bind(null, audioContext)
  _Patch.audioContext = audioContext
  _Patch.panic = stopAndDisconnectAllNodes
  ;[
    Adsr, BrownNoise, Const, Delay, Filter, Gain, Noise, Osc, PinkNoise, Shaper,
    Synth, WhiteNoise
  ].forEach((f) => {
    _Patch[f.name] = f.bind(null, audioContext)
  })
  return _Patch
}

export default Patcher
