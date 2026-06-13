import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"

// NOTE
// Currently updating the waveshaper curve in node-web-audio-api
// throws "InvalidStateError - cannot assign curve twice"
// TODO Check if this happens in browser
export function Shaper(defaults, config) {
  const params = utils.forcePlainObject(config, "curve")
  const node = new WaveShaperNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
