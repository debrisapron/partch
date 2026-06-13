import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"

export function Gain(defaults, config) {
  const params = utils.forcePlainObject(config, "gain")
  const node = new GainNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
