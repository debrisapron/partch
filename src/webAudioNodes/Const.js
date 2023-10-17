import * as utils from "../utils"
import { setNodeParams } from "../helpers"

export function Const(defaults, config) {
  const params = utils.forcePlainObject(config, "offset")
  const node = new ConstantSourceNode(defaults.context)
  node.__defaults = defaults
  node.__config = config
  setNodeParams(node, params)
  return node
}
