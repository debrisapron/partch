import * as utils from "../utils"
import { setNodeParams } from "../helpers"

// NOTE
// Currently updating the waveshaper curve in node-web-audio-api
// throws "InvalidStateError - cannot assign curve twice"
// TODO Check if this happens in browser
export function Shaper(defaults, config) {
  const params = utils.forcePlainObject(config, "curve")
  const node = new WaveShaperNode(defaults.context)
  node.__defaults = defaults
  node.__config = config
  setNodeParams(node, params)
  return node
}
