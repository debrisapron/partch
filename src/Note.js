import * as utils from "./utils.js"
import { Block } from "./Block.js"

const NOTE_CLASS = "C#D#EF#G#A#B".split("")
const MIDDLE_C = 60
const MIDDLE_A = 69

// TODO Tunings
function pitchInCents(defaults, pitch) {
  let nn = MIDDLE_C

  if (typeof pitch === "string") {
    let i = 0
    const chars = pitch
      .trim()
      .split("")
      .filter((s) => s)
    const note_class = NOTE_CLASS.indexOf(chars[i])
    if (note_class === -1) {
      throw new Error("Could not parse note pitch")
    }
    nn += note_class
    i++
    if (chars[i] === "#") {
      nn++
      i++
    } else if (chars[i] === "b") {
      nn--
      i++
    }
    const rest = chars.slice(i).join("")
    if (utils.isNumeric(rest)) {
      const offset = parseInt(rest) * 12
      nn += offset
    }
  } else if (typeof pitch === "number") {
    nn = pitch
  }

  const cents = (nn - MIDDLE_A) * 100
  return cents
}

// TODO Bend
export function Note(defaults, config) {
  const params = { ...utils.forcePlainObject(config, "node") }
  const node = params.node
  if (!node.detune) {
    throw new Error("Cannot create a note from a node without a detune param")
  }
  const pitch = params.pitch ?? 69
  delete params.pitch
  const constNode = new ConstantSourceNode(defaults.context, { offset: 0 })
  constNode.start()
  constNode.connect(node.detune)
  constNode.offset.value = pitchInCents(defaults, pitch)
  return Block(defaults, params)
}
