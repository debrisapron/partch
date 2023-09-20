import * as utils from "../utils.js"
import { createCoreNode } from "./_shared.js"
import { createConst } from "./createConst.js"
import { createGain } from "./createGain.js"

const AUDIBLE_RANGE_IN_CENTS = 12000

const CREATION_OPTIONS = {
  defaultParam: "frequency",
  // defaults: { type: "lowpass", frequency: 350 },
  aliases: {
    freq: "frequency",
    freqCv: "frequencyCv",
  },
}

function createFrequencyCv(node) {
  const constNode = createConst(node.context, 0)
  const gainNode = createGain(node.context, AUDIBLE_RANGE_IN_CENTS)
  constNode.connect(gainNode).connect(node.detune)
  constNode.start()
  return constNode.offset
}

function defineFrequencyCv(node) {
  let audioParam
  Object.defineProperty(node, "frequencyCv", {
    get() {
      return (audioParam ??= createFrequencyCv(node))
    },
  })
  return node
}

export function createFilter(context, config, filterType) {
  config = { ...utils.forcePlainObject(config, "frequency") }
  filterType = filterType || config.type || "lowpass"
  delete config.type

  return createCoreNode(
    CREATION_OPTIONS,
    () =>
      defineFrequencyCv(new BiquadFilterNode(context, { type: filterType })),
    config
  )
}
