import * as utils from "../utils.js"
import { setNodeProps } from "../helpers"

export function Filter(defaults, config, filterType) {
  const params = { ...utils.forcePlainObject(config, "frequency") }
  filterType = filterType || params.type || "lowpass"
  delete params.type
  const node = new BiquadFilterNode(defaults.context, { type: filterType })
  setNodeProps(defaults, node, params)
  return node
}
