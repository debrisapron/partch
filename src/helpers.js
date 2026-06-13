import * as utils from "./utils.js"

export function defineAudioParam(node, name, factory) {
  let audioParam
  Object.defineProperty(node, name, {
    get() {
      return (audioParam ??= factory(node))
    },
  })
}

const NOTE_CLASS = "C#D#EF#G#A#B".split("")
const MIDDLE_C = 60
const MIDDLE_A = 69

// TODO Tunings
function pitchInCents(_, pitch) {
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

function setNodePitch(defaults, node, pitch) {
  if (!node.detune) {
    throw new Error("Cannot set pitch on a node without a detune param")
  }
  node.detune.value = pitchInCents(defaults, pitch)
}

export function setNodeProps(defaults, node, props) {
  node.__defaults = defaults
  node.__props = props
  Object.entries(props)
    .filter(([k]) => !k.startsWith("_"))
    .forEach(([key, val]) => {
      const childNode = node.__nodes?.[key]
      if (childNode) {
        setNodeProps(defaults, childNode, val)
      } else if (utils.isAudioParam(node[key])) {
        node[key].value = val
      } else {
        node[key] = val
      }
    })
  if (props._props) {
    setNodeProps(defaults, node, props._props)
  }
  if (props._pitch) {
    setNodePitch(defaults, node, props._pitch)
  }
}

// NOTE Mutates defaultValues!
export function getPropsFromConfig(config, defaultProp, defaultValues) {
  const configObj = utils.forcePlainObject(config, defaultProp)
  return utils.assignDeepInPlace(defaultValues, configObj)
}
