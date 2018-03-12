import { isPlainObject } from '../helpers'
import { Const } from './nativeNodes'

// TODO Make an ADSR which responds naturally to being adjusted while playing.
function Adsr(context, config = 1) {
  let params = isPlainObject(config) ? config : { release: config }
  let {
    attack = 0.01,
    decay = 0,
    sustain = 1,
    release = 1,
    level = 1
  } = params
  let node = Const(context, 0)
  let _start = node.start

  node.start = (time) => {
    time = time || context.currentTime
    _start(time)
    node.offset.linearRampToValueAtTime(level, time + attack)
    if (sustain < 1) {
      node.offset.linearRampToValueAtTime(
        level * sustain,
        time + attack + decay
      )
    }
    return node
  }

  node.release = (time) => {
    time = time || context.currentTime
    let stopTime = time + release
    node.offset.linearRampToValueAtTime(0, stopTime)
    node.stop(stopTime)
    return stopTime
  }

  return node
}

export default Adsr
