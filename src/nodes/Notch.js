import { Filter } from "./Filter.js"

export function Notch(defaults, config) {
  return Filter(defaults, config, "notch")
}
