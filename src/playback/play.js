import * as utils from "../utils.js"

// TODO tempo automation!
// Ultimately scheduling should be controlled by a squarewave clock

function durationInSeconds(defaults, durationObj) {
  const noTimebase = !(defaults.timebase)
  const noDurParams = Object.keys(durationObj).length === 0
  if (noTimebase || noDurParams) {
    return null
  }

  const { bpm, sig, grid } = defaults.timebase
  const [numerator, denominator] = sig
  const beatLength = 60 / bpm
  const wholeNoteLength = beatLength * denominator
  const tickLength = wholeNoteLength / grid
  const barLength = beatLength * numerator

  return Object.entries(durationObj).reduce((d, [k, v]) => {
    switch (k) {
      case "secs":
        return d + v
      case "ticks":
        return d + v * tickLength
      case "beats":
        return d + v * beatLength
      case "bars":
        return d + v * barLength
      case "notes":
        return d + v * wholeNoteLength
      default:
        throw new Error(`Unknown duration component "${k}"`)
    }
  }, 0)
}

export function play(node, t = 0) {
  if (!(node.start && node.stop)) {
    throw new Error(
      "Cannot play a node without start and stop methods"
    )
  }
  const durationObj = utils.pick(node.__config ?? {}, ..."secs ticks beats bars notes".split(" "))
  const duration = durationInSeconds(node.__defaults ?? {}, durationObj)
  const currTime = node.context.currentTime
  const startTime = t > currTime ? t : currTime
  node.start(startTime)
  node.stop(startTime + duration)
  return node
}
