import * as utils from "../utils"
import { setNodeProps } from "../helpers"

export function Delay(defaults, config) {
  const params = utils.forcePlainObject(config, "delayTime")
  const node = new DelayNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
