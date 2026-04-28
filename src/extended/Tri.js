import { Osc } from "../webAudio/Osc.js"

export function Tri(defaults, config) {
  return Osc(defaults, config, "triangle")
}
