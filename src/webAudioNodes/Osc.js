import * as utils from "../utils"
import { setNodeParams, defineAudioParam } from "../helpers"
import { Const } from "./Const.js"
import { Gain } from "./Gain.js"

const AUDIBLE_RANGE_IN_CENTS = 12000

function createOctave(node) {
  const constNode = Const(node.__defaults, 0)
  constNode.connect(node.detune)
  return constNode
}

function createFrequencyCv(node) {
  const constNode = Const(node.__defaults, 0)
  const gainNode = Gain(node.__defaults, AUDIBLE_RANGE_IN_CENTS)
  constNode.connect(gainNode).connect(node.detune)
  constNode.start()
  return constNode.offset
}

function customize(node) {
  let octaveNode
  let octave = 0

  defineAudioParam(node, "frequencyCv", createFrequencyCv)

  Object.defineProperties(node, {
    freq: {
      get() {
        return this.frequency
      },
    },
    freqCv: {
      get() {
        return this.frequencyCv
      },
    },
    octave: {
      get() {
        return octave
      },
      set(value) {
        octaveNode ??= createOctave(node)
        octave = value
        octaveNode.offset.value = octave * 1200
      },
    },
  })

  return node
}

export function Osc(defaults, config, oscType) {
  const params = { ...utils.forcePlainObject(config, "frequency") }
  oscType = oscType || params.type || "sine"
  delete params.type
  const node = customize(
    new OscillatorNode(defaults.context, { type: oscType })
  )
  node.__defaults = defaults
  node.__config = config
  setNodeParams(node, params)
  return node
}
