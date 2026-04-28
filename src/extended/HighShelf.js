import { Filter } from "../webAudio/Filter.js"

export function HighShelf(defaults, config) {
  return Filter(defaults, config, "highshelf")
}
