import { Filter } from "./Filter.js"

export function Bpf(defaults, config) {
  return Filter(defaults, config, "bandpass")
}
