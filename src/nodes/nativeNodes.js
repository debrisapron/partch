import { isPlainObject, partchifyNode } from '../helpers'

const CV_TO_GAIN_CURVE = Float32Array.from(
  Array(8193).fill(null)
    .map((__, i) => cvToGain(Math.abs(i - 4096) / 4096)
  )
)
const AUDIBLE_RANGE_IN_CENTS = 12000

function cvToGain(cv) {
  return cv ** 3.321928094887362 // 0 -> 0, 0.5 -> 0.1, 1 -> 1
}

function WaaNode(context, _constructor, defaultParam, isDest, config) {
  let params = config === undefined || isPlainObject(config)
    ? config
    : { [defaultParam]: config }
  let node = new window[_constructor](context, params)
  if (isDest) { node.input = node }
  partchifyNode(node)
  if (node.start) { node.start(context.currentTime) }
  return node
}

function OscillatorNode(context, type, config) {
  let params = isPlainObject(config) ? config : { frequency: config || 440 }
  params = { type, ...params }
  let node = WaaNode(context, 'OscillatorNode', 'frequency', false, params)
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

  if (params.frequencyCv) {
    node.frequencyCv.value = params.frequencyCv
  }

  return node
}

function FilterNode(context, type, config) {
  let params = isPlainObject(config) ? config : { frequency: config || 350 }
  params = { type, ...params }
  let node = WaaNode(
    context, 'BiquadFilterNode', 'frequency', true, params
  )
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

  if (params.frequencyCv) {
    node.frequencyCv.value = params.frequencyCv
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
  return WaaNode(context, 'ConstantSourceNode', 'offset', false, config)
}

export function Delay(context, config) {
  let params = isPlainObject(config) ? config : { delayTime: config || 0 }
  params = { delayTime: 0, maxDelayTime: 1, ...params }
  if (params.delayTime > params.maxDelayTime) {
    params.maxDelayTime = params.delayTime
  }
  return WaaNode(context, 'DelayNode', 'delayTime', true, params)
}

export function Filter(context, config) {
  return FilterNode(context, undefined, config)
}

export function Gain(context, config) {
  let node = WaaNode(context, 'GainNode', 'gain', true, config)
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
  return OscillatorNode(context, undefined, config)
}

export function Peak(context, config) {
  return FilterNode(context, 'peaking', config)
}

export function Sample(context, config) {
  return WaaNode(context, 'AudioBufferSourceNode', 'buffer', false, config)
}

export function Shaper(context, config) {
  return WaaNode(context, 'WaveShaperNode', 'curve', true, config)
}

export function Saw(context, config) {
  return OscillatorNode(context, 'sawtooth', config)
}

export function Sin(context, config) {
  return OscillatorNode(context, 'sine', config)
}

export function Sqr(context, config) {
  return OscillatorNode(context, 'square', config)
}

export function Tri(context, config) {
  return OscillatorNode(context, 'triangle', config)
}
