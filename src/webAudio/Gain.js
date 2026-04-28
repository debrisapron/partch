import * as utils from "../utils"
import { setNodeProps } from "../helpers"

export function Gain(defaults, config) {
  const params = utils.forcePlainObject(config, "gain")
  const node = new GainNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
