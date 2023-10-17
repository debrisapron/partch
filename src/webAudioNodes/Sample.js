import * as utils from "../utils"
import { setNodeParams } from "../helpers"

// TODO Add a "file" prop & create it default if arg is a string
export function Sample(defaults, config) {
  const params = utils.forcePlainObject(config, "buffer")
  const node = new AudioBufferSourceNode(defaults.context)
  node.__defaults = defaults
  node.__config = config
  setNodeParams(node, params)
  return node
}
