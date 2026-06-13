import { setNodeProps, getPropsFromConfig } from "../helpers.js"
import { Const } from "./Const.js"
import { Gain } from "./Gain.js"
import { Exp } from "./Exp.js"

export function Vol(defaults, config) {
  const props = getPropsFromConfig(config, "level", { level: 1 })
  const node = Gain(defaults, { gain: 0 })
  const exp = Exp(defaults, 5 / 3)
  const level = Const(defaults, { offset: 0 })
  level.connect(exp).connect(node.gain)
  node.level = level.offset
  setNodeProps(defaults, node, props)
  level.start()
  return node
}
