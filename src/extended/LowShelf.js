import { Filter } from "../webAudio/Filter.js"

export function LowShelf(defaults, config) {
  return Filter(defaults, config, "lowshelf")
}
