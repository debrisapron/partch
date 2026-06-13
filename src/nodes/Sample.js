import * as utils from "../utils.js"
import { setNodeProps } from "../helpers.js"

// TODO Add a "file" prop & create it default if arg is a string
export function Sample(defaults, config) {
  const params = utils.forcePlainObject(config, "buffer")
  const node = new AudioBufferSourceNode(defaults.context)
  setNodeProps(defaults, node, params)
  return node
}
