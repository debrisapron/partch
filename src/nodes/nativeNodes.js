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
  return node
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
  let node = WaaNode(
    context, 'BiquadFilterNode', 'frequency', true, config
  )

  Object.defineProperty(node, 'frequencyCv', {
    get() {
      let ctrl = Const(context, 0)
      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)
      ctrl.connect(scaler).connect(node.detune)
      ctrl.start()
      return ctrl.offset
    }
  })

  return node
}

export function Gain(context, config) {
  let node = WaaNode(context, 'GainNode', 'gain', true, config)

  Object.defineProperty(node, 'gainCv', {
    get() {
      let ctrl = Const(context, 0)
      let shaper = Shaper(context, CV_TO_GAIN_CURVE)
      ctrl.connect(shaper).connect(node.gain)
      ctrl.start()
      return ctrl.offset
    }
  })

  return node
}

export function Osc(context, config) {
  let node = WaaNode(context, 'OscillatorNode', 'frequency', false, config)

  Object.defineProperty(node, 'frequencyCv', {
    get() {
      let ctrl = Const(context, 0)
      let scaler = Gain(context, AUDIBLE_RANGE_IN_CENTS)
      ctrl.connect(scaler).connect(node.detune)
      ctrl.start()
      return ctrl.offset
    }
  })

  return node
}

export function Sample(context, config) {
  return WaaNode(context, 'AudioBufferSourceNode', 'buffer', false, config)
}

export function Shaper(context, config) {
  return WaaNode(context, 'WaveShaperNode', 'curve', true, config)
}
