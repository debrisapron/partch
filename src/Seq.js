import * as utils from "./utils.js"
import { Block } from "./Block.js"
import { Note } from "./Note.js"
import { Patch } from "./Patch.js"

function start(patch, t) {
  Object.values(patch.__nodes).reduce((t, node) => {
    node.start(t)
    return t + node.duration
  }, t)
}

function blockify(defaults, obj) {
  return obj.pitch ? Note(defaults, obj) : Block(defaults, obj)
}

export function Seq(defaults, config) {
  const params = utils.forcePlainObject(config, "blocks")
  const nodes = params.blocks.map((b) => blockify(defaults, b))
  const patchConfig = Object.fromEntries(
    nodes.map((node, i) => [`node${i}`, node])
  )
  // TODO wire inputs
  const wires = nodes
    .map((n, i) => n.connect && `node${i} > out`)
    .filter((x) => x)
  patchConfig.__ = wires
  const patch = Patch(defaults, patchConfig)
  patch.start = (t = 0) => start(patch, t)
  return patch
}
