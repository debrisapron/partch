import { Filter } from "./Filter.js"

export function Hpf(defaults, config) {
  return Filter(defaults, config, "highpass")
}
