import * as utils from "../utils"
import { setNodeParams, defineAudioParam } from "../helpers"
import { Const } from "./Const.js"
import { Shaper } from "./Shaper.js"

function upTo(length) {
  return Array(length)
    .fill()
    .map((__, i) => i)
}

function cvToGain(cv) {
  return cv ** 3.321928094887362 // 0 -> 0, 0.5 -> 0.1, 1 -> 1
}

const CV_TO_GAIN_CURVE = Float32Array.from(
  upTo(8193).map((i) => cvToGain(Math.abs(i - 4096) / 4096))
)

function createGainCv(node) {
  const constNode = Const(node.__defaults, 0)
  const shaperNode = Shaper(node.__defaults, CV_TO_GAIN_CURVE)
  constNode.connect(shaperNode).connect(node.gain)
  constNode.start()
  return constNode.offset
}

function customize(node) {
  defineAudioParam(node, "gainCv", createGainCv)
  return node
}

export function Gain(defaults, config) {
  const params = utils.forcePlainObject(config, "gain")
  const node = customize(new GainNode(defaults.context))
  node.__defaults = defaults
  node.__config = config
  setNodeParams(node, params)
  return node
}
