import { Osc } from "./Osc.js"

export function Saw(defaults, config) {
  return Osc(defaults, config, "sawtooth")
}
