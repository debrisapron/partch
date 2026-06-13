import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"

export function Osc(defaults, config, oscType) {
  const props = { ...utils.forcePlainObject(config, "frequency") }
  oscType = oscType || props.type || "sine"
  delete props.type
  props._follow ??= true
  const node = new OscillatorNode(defaults.context, { type: oscType })
  setNodeProps(defaults, node, props)
  return node
}
