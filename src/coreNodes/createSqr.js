import { createOsc } from "./createOsc.js"

export function createSqr(context, config) {
  return createOsc(context, config, "square")
}
// TODO Pulse
