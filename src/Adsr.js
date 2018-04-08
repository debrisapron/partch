import { PartchNode } from './helpers'

// TODO Make an ADSR which responds naturally to being adjusted while playing.
function _Adsr(context, params) {
  let node = new window.ConstantSourceNode(context, { offset: 0 })
  let { attack, decay, sustain, release, level } = params

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

function Adsr(context, config) {
  return PartchNode({
    config, context,
    aliases: { a: 'attack', d: 'decay', s: 'sustain', r: 'release' },
    createNode: _Adsr,
    defaultParam: 'release',
    defaults: { attack: 0.01, decay: 0, sustain: 1, release: 1, level: 1 }
  })
}

export default Adsr
