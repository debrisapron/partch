import * as utils from "./utils.js"

// TODO tempo automation!
// Ultimately scheduling should be controlled by a squarewave clock

function durationInSeconds(defaults, duration) {
  const { bpm, sig, grid } = defaults.timebase
  const [numerator, denominator] = sig
  const beatLength = 60 / bpm
  const wholeNoteLength = beatLength * denominator

  return Object.entries(duration).reduce((d, [k, v]) => {
    switch (k) {
      case "secs":
        return d + v
      case "ticks":
        const tickLength = wholeNoteLength / grid
        return d + v * tickLength
      case "beats":
        return d + v * beatLength
      case "bars":
        const barLength = beatLength * numerator
        return d + v * barLength
      case "notes":
        return d + v * wholeNoteLength
      default:
        throw new Error(`Unknown duration component "${k}"`)
    }
  }, 0)
}

export function Block(defaults, config) {
  const params = { ...utils.forcePlainObject(config, "node") }
  const node = params.node
  if (!node) {
    throw new Error("Cannot create a Block without passing a node")
  }
  if (!(node.start && node.stop)) {
    throw new Error(
      "Cannot create a Block from a node without start and stop methods"
    )
  }
  delete params.node
  const durationObj = Object.keys(params).length === 0 ? { ticks: 1 } : params
  const duration = durationInSeconds(defaults, durationObj)
  const _start = node.start.bind(node)
  node.start = (t = 0) => {
    const currTime = node.context.currentTime
    const startTime = t > currTime ? t : currTime
    _start(startTime)
    node.stop(startTime + duration)
  }
  node.duration = duration
  return node
}
