import * as utils from "../utils.js"
import { Shaper } from "./Shaper.js"

function makeCurve(exponent) {
  return Float32Array.from(
    Array(8193)
      .fill()
      .map((__, i) => (Math.abs(i - 4096) / 4096) ** exponent)
  )
}

export function Exp(defaults, config) {
  const { exponent = 1 } = utils.forcePlainObject(config, "exponent")
  return Shaper(defaults, makeCurve(exponent))
}
