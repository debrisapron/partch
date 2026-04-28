import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"

// TODO tempo automation!
// Ultimately scheduling should be controlled by a squarewave clock
// or a buffer

function durationInSeconds(defaults, node) {
  const { bpm, sig, grid } = defaults.timebase
  const [numerator, denominator] = sig
  const beatLength = 60 / bpm
  const barLength = beatLength * numerator
  const wholeNoteLength = beatLength * denominator
  const tickLength = wholeNoteLength / grid

  const durationObj = utils.pick(
    node.__props ?? {},
    ..."_secs _ticks _beats _bars _notes".split(" ")
  )
  if (Object.keys(durationObj).length === 0) {
    return tickLength
  }

  return Object.entries(durationObj).reduce((d, [k, v]) => {
    switch (k) {
      case "_secs":
        return d + v
      case "_ticks":
        return d + v * tickLength
      case "_beats":
        return d + v * beatLength
      case "_bars":
        return d + v * barLength
      case "_notes":
        return d + v * wholeNoteLength
      default:
        throw new Error(`Unknown duration component "${k}"`)
    }
  }, 0)
}

export function Seq(defaults, config) {
  const node = new GainNode(defaults.context, { gain: 1 })
  const props = utils.forcePlainObject(config, "nodes")
  setNodeProps(defaults, node, utils.withoutKey(props, "nodes"))

  // TODO wire inputs

  node.connect = (...args) =>
    props.nodes.filter((n) => n.connect).map((n) => n.connect(...args))[0]

  node.start = (t = 0) => {
    t = Math.max(t, defaults.context.currentTime)
    props.nodes
      .filter((n) => n.start)
      .reduce((t, n) => {
        n.start(t)
        const stopTime = t + durationInSeconds(defaults, n)
        n.stop(stopTime)
        return stopTime
      }, t)
  }

  // TODO release time
  node.stop = (t = 0) => {
    props.nodes.filter((n) => n.stop).forEach((n) => n.stop(t))
  }

  // TODO detune (i.e. transpose)

  return node
}
