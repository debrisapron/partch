import { createCoreNode } from "./_shared.js"

// TODO handle delayTime greater than maxDelayTime
const CREATION_OPTIONS = {
  defaultParam: "delayTime",
  defaults: { delayTime: 0, maxDelayTime: 1 },
}

export function createDelay(context, config) {
  return createCoreNode(CREATION_OPTIONS, () => new DelayNode(context), config)
}
