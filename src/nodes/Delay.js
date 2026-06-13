import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"

export function Delay(defaults, config) {
  const params = utils.forcePlainObject(config, "delayTime")
  const node = new DelayNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
