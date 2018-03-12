import { Gain } from './nativeNodes'

function twelveTet(nn, ref = 440) {
  return nn && Math.pow(2, ((nn - 69) / 12)) * ref
}

function Synth(context, Voice) {
  let synthOut = Gain(context)

  synthOut.play = (note = 69, time = 0) => {
    let frequency = twelveTet(note)
    let voice = Voice(frequency)
    voice.connect(synthOut)
    voice.start(time)
    return voice
  }

  synthOut.test = (dur = 0.2, note) => {
    synthOut.monitor().play(note).releaseAfter(dur)
  }

  return synthOut
}

export default Synth
