import { createOsc } from "./createOsc.js"

export function createTri(context, config) {
  return createOsc(context, config, "triangle")
}
