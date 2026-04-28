import { Filter } from "../webAudio/Filter.js"

export function Hpf(defaults, config) {
  return Filter(defaults, config, "highpass")
}
