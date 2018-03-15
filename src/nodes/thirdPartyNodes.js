import _Freeverb from 'freeverb'
import { isPlainObject, partchifyNode } from '../helpers'

export function Freeverb(context, config) {
  let node = _Freeverb(context)
  let params = isPlainObject(config) ? config : { wet: config }
  node.wet.level = params.wet || 0
  node.dry.level = params.dry == null ? 1 : params.dry
  node.roomSize = params.roomSize || 0.8
  node.dampening = params.dampening || 3000
  partchifyNode(node)
  return node
}
