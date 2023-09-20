import { createCoreNode } from "./_shared.js"
import { createConst } from "./createConst.js"
import { createShaper } from "./createShaper.js"

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

const CREATION_OPTIONS = {
  defaultParam: "gain",
  // defaults: { gain: 1 },
}

function createGainCv(node) {
  const constNode = createConst(node.context, 0)
  const shaperNode = createShaper(node.context, CV_TO_GAIN_CURVE)
  constNode.connect(shaperNode).connect(node.gain)
  return constNode.offset
}

function customize(node) {
  let audioParam
  Object.defineProperty(node, "gainCv", {
    get() {
      return (audioParam ??= createGainCv(node))
    },
  })
  return node
}

export function createGain(context, config) {
  return createCoreNode(
    CREATION_OPTIONS,
    () => customize(new GainNode(context)),
    config
  )
}
