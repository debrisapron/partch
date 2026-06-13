import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"

export function Const(defaults, config) {
  const params = utils.forcePlainObject(config, "offset")
  const node = new ConstantSourceNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
