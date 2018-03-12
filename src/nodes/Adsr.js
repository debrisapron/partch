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

  node.triggerAttack = (time) => {
    time = time || context.currentTime
    node.offset.linearRampToValueAtTime(level, time + attack)
    if (sustain < 1) {
      node.offset.linearRampToValueAtTime(
        level * sustain,
        time + attack + decay
      )
    }
    return node
  }

  node.triggerRelease = (time) => {
    let currTime = context.currentTime
    time = time || currTime
    let wait = Math.max(0, (time - currTime) - 0.01)
    let stopTime = time + release
    setTimeout(() => {
      node.offset.linearRampToValueAtTime(0, stopTime)
      node.stop(stopTime)
    }, wait * 1000)
    return stopTime
  }

  return node
}

export default Adsr
