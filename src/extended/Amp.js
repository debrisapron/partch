import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"
import { Const } from "../webAudio/Const.js"
import { Gain } from "../webAudio/Gain.js"
import { Exp } from "./Exp.js"

export function Amp(defaults, config) {
  const props = utils.forcePlainObject(config, "level")
  const node = Gain(defaults, { gain: 0 })
  const exp = Exp(defaults)
  const level = Const(defaults, { offset: 0 })
  level.connect(exp).connect(node.gain)
  node.level = level.offset
  setNodeProps(defaults, node, props)
  level.start()
  return node
}
