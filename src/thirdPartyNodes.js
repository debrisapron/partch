import _Freeverb from 'freeverb'
import { PartchNode } from './helpers'

export function Freeverb(context, config) {
  return PartchNode({
    config, context,
    createNode: (context, params) => {
      let node = _Freeverb(context)
      node.wet.value = params.wet
      node.dry.value = params.dry
      node.roomSize = params.roomSize
      node.dampening = params.dampening
      return node
    },
    defaultParam: 'wet',
    defaults: { wet: 0, dry: 1, roomSize: 0.8, dampening: 3000 },
    isDest: true
  })
}
