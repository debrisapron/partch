import { createOsc } from "./createOsc.js"

export function createSin(context, config) {
  return createOsc(context, config, "sine")
}
