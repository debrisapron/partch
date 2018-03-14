import Sequencer from 'um-sequencer'
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
    let nn = config.nn || 69
    let time = config.time || config.t || context.currentTime
    let dur = config.dur || 0.2
    let frequency = twelveTet(nn)
    let voice = Voice(frequency)
    voice.connect(synthOut)
    voice.triggerAttack(time)
    if (dur) {
      voice.triggerRelease(time + dur)
    }
    return voice
  }

  synthOut.sequence = (events, options) => {
    // Convert Partch events to um-sequencer events.
    events = events.map((ev) => {
      return {
        time: ev.time || ev.t,
        callback: (t) => synthOut.play({ ...ev, time: t })
      }
    })
    let sequencer = Sequencer(() => context.currentTime)
    sequencer.play(events, options)
    return synthOut
  }

  synthOut.test = (dur, note) => {
    synthOut.monitor().play({ dur, note })
  }

  return synthOut
}

export default Synth
