import { Filter } from "../webAudio/Filter.js"

export function Peak(defaults, config) {
  return Filter(defaults, config, "peaking")
}
