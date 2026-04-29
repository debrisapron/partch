import { Filter } from "./Filter.js"

export function Apf(defaults, config) {
  return Filter(defaults, config, "allpass")
}
