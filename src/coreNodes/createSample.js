import { createCoreNode } from "./_shared.js"

// TODO Add a "file" prop & create it default if arg is a string
const CREATION_OPTIONS = { defaultParam: "buffer" }

export function createSample(context, config) {
  return createCoreNode(
    CREATION_OPTIONS,
    () => new AudioBufferSourceNode(context),
    config
  )
}
