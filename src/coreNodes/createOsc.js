import * as utils from "../utils.js"
import { createCoreNode } from "./_shared.js"
import { createConst } from "./createConst.js"
import { createGain } from "./createGain.js"

const AUDIBLE_RANGE_IN_CENTS = 12000

const CREATION_OPTIONS = {
  defaultParam: "frequency",
}

function createOctave(node) {
  const constNode = createConst(node.context, 0)
  constNode.connect(node.detune)
  return constNode
}

function createFrequencyCv(node) {
  const constNode = createConst(node.context, 0)
  const gainNode = createGain(node.context, AUDIBLE_RANGE_IN_CENTS)
  constNode.connect(gainNode).connect(node.detune)
  constNode.start()
  return constNode.offset
}

function customize(node) {
  let frequencyCvAudioParam
  let octaveNode
  let octave = 0

  const frequencyCvGetter = function () {
    return (frequencyCvAudioParam ??= createFrequencyCv(node))
  }

  Object.defineProperties(node, {
    freq: {
      get() {
        return this.frequency
      },
    },
    frequencyCv: { get: frequencyCvGetter },
    freqCv: { get: frequencyCvGetter },
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

export function createOsc(context, config, oscType) {
  config = { ...utils.forcePlainObject(config, "frequency") }
  oscType = oscType || config.type || "sine"
  delete config.type

  return createCoreNode(
    CREATION_OPTIONS,
    () => customize(new OscillatorNode(context, { type: oscType })),
    config
  )
}
