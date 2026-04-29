// TODO: Rename to Log because that's what it is
// Alternatively Curve? For a node that can do different curves?
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

export function Exp(defaults) {
  return Shaper(defaults, CV_TO_GAIN_CURVE)
}
