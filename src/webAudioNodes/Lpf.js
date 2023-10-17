import { Filter } from "./Filter.js"

export function Lpf(defaults, config) {
  return Filter(defaults, config, "lowpass")
}
