//// Constants /////////////////////////////////////////////////////////////////

const CV_TO_GAIN_CURVE = Float32Array.from(
  Array(8193).fill(null)
    .map((__, i) => cvToGain(Math.abs(i - 4096) / 4096)
  )
)
const AUDIBLE_RANGE_IN_CENTS = 12000


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
  let signal = Const(audioContext, 0)
  let node = Patch(audioContext, { signal }, 'signal > out')

  function start(time = audioContext.currentTime) {
    signal.start(time)
    signal.offset.linearRampToValueAtTime(level, time + attack)
    if (sustain < 1) {
      signal.offset.linearRampToValueAtTime(
        level * sustain,
        time + attack + decay
      )
    }
    return node
  }

  function _release(time = audioContext.currentTime) {
    let stopTime = time + release
    signal.offset.linearRampToValueAtTime(0, stopTime)
    signal.stop(stopTime)
    return stopTime
  }

  node.start = start
  node.release = _release
  return node
}

function Const(audioContext, config) {
  return WaaNode(audioContext, 'ConstantSourceNode', 'offset', config)
}

function Delay(audioContext, config) {
  return WaaNode(audioContext, 'DelayNode', 'delayTime', config)
}

function Filter(audioContext, config) {
  let node = WaaNode(audioContext, 'BiquadFilterNode', 'frequency', config)

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
  let node = WaaNode(audioContext, 'GainNode', 'gain', config)

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

function Osc(audioContext, config) {
  let node = WaaNode(audioContext, 'OscillatorNode', 'frequency', config)

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

function Shaper(audioContext, config) {
  return WaaNode(audioContext, 'WaveShaperNode', 'curve', config)
}

function Synth(audioContext, Voice) {
  let synth = Patch(audioContext, { out: Gain(audioContext) })

  function play(note = 69, time = 0) {
    let frequency = twelveTet(note)
    let voice = Voice(frequency)
    voice.connect(synth.nodes.out)
    voice.start(time)
    return voice
  }

  synth.play = play
  return synth
}

function WaaNode(audioContext, _constructor, defaultParam, config) {
  let params = config === undefined || isPlainObject(config)
    ? config
    : { [defaultParam]: config }
  return new window[_constructor](audioContext, params)
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

  function stopAfter(interval) {
    let stopTime = interval + audioContext.currentTime
    let timeout = Math.abs((interval * 1000) - 10)
    setTimeout(() => stop(stopTime), timeout)
  }

  function releaseAfter(interval) {
    let releaseTime = interval + audioContext.currentTime
    let timeout = Math.abs((interval * 1000) - 10)
    setTimeout(() => release(releaseTime), timeout)
  }

  function connect(destination) {
    let toNode = destination.input || destination
    nodes.out.connect(toNode)
    return destination
  }

  function monitor() {
    connect(audioContext.destination)
    return patch
  }


  //// Patch API ///////////////////////////////////////////////////////////////

  let patch = {
    connect, monitor, nodes, release, releaseAfter, start, stop, stopAfter,
    input: nodes.in
  }
  return patch
}

//// Top-level API /////////////////////////////////////////////////////////////

function Patcher(audioContext = getDefaultAudioContext()) {
  let _Patch = Patch.bind(null, audioContext)

  _Patch.Adsr = Adsr.bind(null, audioContext)
  _Patch.audioContext = audioContext
  _Patch.Const = Const.bind(null, audioContext)
  _Patch.Delay = Delay.bind(null, audioContext)
  _Patch.Filter = Filter.bind(null, audioContext)
  _Patch.Gain = Gain.bind(null, audioContext)
  _Patch.Osc = Osc.bind(null, audioContext)
  _Patch.Shaper = Shaper.bind(null, audioContext)
  _Patch.Synth = Synth.bind(null, audioContext)

  return _Patch
}

export default Patcher
