import { Filter } from "../webAudio/Filter.js"

export function Notch(defaults, config) {
  return Filter(defaults, config, "notch")
}
