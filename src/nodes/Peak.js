import { Filter } from "./Filter.js"

export function Peak(defaults, config) {
  return Filter(defaults, config, "peaking")
}
