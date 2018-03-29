import { PartchNode } from '../helpers'

const CV_TO_GAIN_CURVE = Float32Array.from(
  Array(8193).fill(null)
    .map((__, i) => cvToGain(Math.abs(i - 4096) / 4096)
  )
)
const AUDIBLE_RANGE_IN_CENTS = 12000

function cvToGain(cv) {
  return cv ** 3.321928094887362 // 0 -> 0, 0.5 -> 0.1, 1 -> 1
}

function WaaNode(options) {
  return PartchNode(Object.assign({
    createNode: (context, params) => {
      return new window[options.nodeConstructor](context, params)
    }
  }, options))
}

function OscNode(context, type, config) {
  let node = WaaNode({
    config, context,
    nodeConstructor: 'OscillatorNode',
    defaultParam: 'frequency',
    defaults: { type }
  })
  let frequencyCv
  let octave = 0
  let octaveConst

  Object.defineProperty(node, 'frequencyCv', {
    get() {
      if (frequencyCv) { return frequencyCv }
      let ctrl = Const(context, 0)
      frequencyCv = ctrl.offset
      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)
      ctrl.connect(scaler).connect(node.detune)
      return frequencyCv
    }
  })

  Object.defineProperty(node, 'octave', {
    get() {
      return octave
    },
    set(value) {
      octave = value
      if (!octaveConst) {
        octaveConst = Const(context)
        octaveConst.connect(node.detune)
      }
      octaveConst.set(octave * 1200)
    }
  })

  if (config) {
    if (config.frequencyCv) { node.frequencyCv.value = config.frequencyCv }
    if (config.octave) { node.octave = config.octave }
  }

  return node
}

function FilterNode(context, type, config) {
  let node = WaaNode({
    config, context,
    nodeConstructor: 'BiquadFilterNode',
    defaultParam: 'frequency',
    defaults: { type },
    isDest: true
  })
  let frequencyCv

  Object.defineProperty(node, 'frequencyCv', {
    get() {
      if (frequencyCv) { return frequencyCv }
      let ctrl = Const(context, 0)
      frequencyCv = ctrl.offset
      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)
      ctrl.connect(scaler).connect(node.detune)
      return frequencyCv
    }
  })

  if (config && config.frequencyCv) {
    node.frequencyCv.value = config.frequencyCv
  }

  return node
}

export function Apf(context, config) {
  return FilterNode(context, 'allpass', config)
}

export function Bpf(context, config) {
  return FilterNode(context, 'bandpass', config)
}

export function Const(context, config) {
  return WaaNode({
    config, context,
    nodeConstructor: 'ConstantSourceNode',
    defaultParam: 'offset'
  })
}

export function Delay(context, config) {
  return PartchNode({
    config, context,
    createNode: (context, params) => {
      if (params.delayTime > params.maxDelayTime) {
        params.maxDelayTime = params.delayTime
      }
      return new window.DelayNode(context, params)
    },
    defaultParam: 'delayTime',
    defaults: { delayTime: 0, maxDelayTime: 1 },
    isDest: true
  })
}

export function Filter(context, config) {
  return FilterNode(context, undefined, config)
}

export function Gain(context, config) {
  let node = WaaNode({
    config, context,
    nodeConstructor: 'GainNode',
    defaultParam: 'gain',
    isDest: true
  })
  let gainCv

  Object.defineProperty(node, 'gainCv', {
    get() {
      if (gainCv) { return gainCv }
      let ctrl = Const(context, 0)
      gainCv = ctrl.offset
      let shaper = Shaper(context, CV_TO_GAIN_CURVE)
      ctrl.connect(shaper).connect(node.gain)
      return gainCv
    }
  })

  if (config && config.gainCv) {
    node.gainCv.value = config.gainCv
  }

  return node
}

export function HighShelf(context, config) {
  return FilterNode(context, 'highshelf', config)
}

export function Hpf(context, config) {
  return FilterNode(context, 'highpass', config)
}

export function LowShelf(context, config) {
  return FilterNode(context, 'lowshelf', config)
}

export function Lpf(context, config) {
  return FilterNode(context, 'lowpass', config)
}

export function Notch(context, config) {
  return FilterNode(context, 'notch', config)
}

export function Osc(context, config) {
  return OscNode(context, undefined, config)
}

export function Peak(context, config) {
  return FilterNode(context, 'peaking', config)
}

export function Sample(context, config) {
  return WaaNode({
    config, context,
    nodeConstructor: 'AudioBufferSourceNode',
    defaultParam: 'buffer'
  })
}

export function Shaper(context, config) {
  return WaaNode({
    config, context,
    nodeConstructor: 'WaveShaperNode',
    defaultParam: 'curve',
    isDest: true
  })
}

export function Saw(context, config) {
  return OscNode(context, 'sawtooth', config)
}

export function Sin(context, config) {
  return OscNode(context, 'sine', config)
}

export function Sqr(context, config) {
  return OscNode(context, 'square', config)
}

export function Tri(context, config) {
  return OscNode(context, 'triangle', config)
}
