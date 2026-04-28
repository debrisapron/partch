import { Filter } from "../webAudio/Filter.js"

export function Bpf(defaults, config) {
  return Filter(defaults, config, "bandpass")
}
