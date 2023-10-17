import * as utils from "../utils"
import { setNodeProps } from "../helpers"

export function Const(defaults, config) {
  const params = utils.forcePlainObject(config, "offset")
  const node = new ConstantSourceNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
