import * as utils from "../utils.js"
import { createCoreNode } from "./_shared.js"

function parseSegment(seg) {
  const [value, duration] = utils.split(seg, "/").map((s) => parseFloatOr(s, 0))
  return { value, duration }
}

// TODO exponential
// TODO absolute time (@ symbol)
function triggerShape(node, shape, time) {
  const segments = utils
    .split(shape, " ")
    .map((seg) => (utils.isString(seg) ? parseSegment(seg) : seg))
  segments.forEach(({ value, duration }, i) => {
    if (duration === 0) {
      // If this segment is instant & so was the previous one,
      // space them out one tick apart (making a step sequencer)
      if (i > 0) {
        const prevDur = segments[i - 1].duration
        if (prevDur === 0) {
          time += 1
        }
      }
      node.offset.setValueAtTime(value, time)
      return
    }
    time += duration
    node.offset.linearRampToValueAtTime(value, time)
  })
}

function trigger(node, config, shapeIds, time) {
  node.start(time)
  utils.split(shapeIds, ",").forEach((shapeId) => {
    const shape = config[shapeId]
    if (shape) {
      triggerShape(node, shape, time)
    }
  })
}

function customize(node, config) {
  node.trigger = (shapeIds, time) => trigger(node, config, shapeIds, time)
  node.begin = (time) => node.trigger("attack,att", time)
  node.end = (time) => node.trigger("release,rel", time)
  return node
}

const CREATION_OPTIONS = {
  defaultParam: "attack",
  // defaults: { gain: 1 },
}

export function createAuto(context, config) {
  return createCoreNode(
    CREATION_OPTIONS,
    () => customize(new ConstantSourceNode(context), config),
    config
  )
}
