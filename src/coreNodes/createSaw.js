import { createOsc } from "./createOsc.js"

export function createSaw(context, config) {
  return createOsc(context, config, "sawtooth")
}
