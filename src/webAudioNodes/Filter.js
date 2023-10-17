import * as utils from "../utils.js"
import { setNodeProps, defineAudioParam } from "../helpers"
import { Const } from "./Const.js"
import { Gain } from "./Gain.js"

const AUDIBLE_RANGE_IN_CENTS = 12000

function createFrequencyCv(node) {
  const constNode = Const(node.__defaults, 0)
  const gainNode = Gain(node.__defaults, AUDIBLE_RANGE_IN_CENTS)
  constNode.connect(gainNode).connect(node.detune)
  constNode.start()
  return constNode.offset
}

function customize(node) {
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
  })

  return node
}

export function Filter(defaults, config, filterType) {
  const params = { ...utils.forcePlainObject(config, "frequency") }
  filterType = filterType || params.type || "lowpass"
  delete params.type

  const node = customize(
    new BiquadFilterNode(defaults.context, { type: filterType })
  )
  setNodeProps(defaults, node, params)
  return node
}
