import * as utils from "../utils"
import { setNodeParams } from "../helpers"

export function Delay(defaults, config) {
  const params = utils.forcePlainObject(config, "delayTime")
  const node = new DelayNode(defaults.context)
  node.__defaults = defaults
  node.__config = config
  setNodeParams(node, params)
  return node
}
