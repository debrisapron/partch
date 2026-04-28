import { Osc } from "../webAudio/Osc.js"

export function Sin(defaults, config) {
  return Osc(defaults, config, "sine")
}
