import * as utils from "./utils.js"

function parseSegment(seg) {
  const [value, duration] = utils
    .split(seg, "/")
    .map((s) => utils.parseFloatOr(s, 0))
  return { value, duration }
}

// TODO exponential (e.g. 1/.1/.01 where middle is time to halfway value)
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
  return time
}

function trigger(node, config, shapeId, t) {
  let time = t ?? node.context.currentTime
  const shape = config[shapeId]
  if (shape) {
    time = triggerShape(node, shape, time)
  }
  return time
}

function customize(node, params) {
  // TODO this should happen in base
  params = utils.forcePlainObject(params, "attack")

  node.offset.value = 0
  node.__start = node.start
  node.__stop = node.stop
  node.__release = true
  node.trigger = (shapeId, t) => trigger(node, params, shapeId, t)
  node.start = (t) => {
    node.__start(t)
    node.trigger(params.att ? "att" : "attack", t)
  }
  // TODO Replace this with emitting an event
  node.stop = (t) => {
    const endTime = node.trigger(params.rel ? "rel" : "release", t)
    node.__stop(endTime)
    return endTime
  }
  return node
}

// TODO replace with automation based on a buffer, as it can much more easily
// react to tempo changes
export function Auto(defaults, config) {
  const params = utils.forcePlainObject(config, "attack")
  const node = customize(new ConstantSourceNode(defaults.context), params)
  node.__defaults = defaults
  return node
}
