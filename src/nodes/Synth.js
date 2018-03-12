import { isPlainObject } from '../helpers'
import { Gain } from './nativeNodes'

function twelveTet(nn, ref = 440) {
  return nn && Math.pow(2, ((nn - 69) / 12)) * ref
}

function Synth(context, Voice) {
  let synthOut = Gain(context)

  synthOut.play = (config) => {
    if (!isPlainObject(config)) {
      config = { nn: config || 69 }
    }
    let { nn = 69, time = context.currentTime, dur = 0.2 } = config
    let frequency = twelveTet(nn)
    let voice = Voice(frequency)
    voice.connect(synthOut)
    voice.triggerAttack(time)
    if (dur) {
      voice.triggerRelease(time + dur)
    }
    return voice
  }

  synthOut.test = (dur, note) => {
    synthOut.monitor().play({ dur, note })
  }

  return synthOut
}

export default Synth
