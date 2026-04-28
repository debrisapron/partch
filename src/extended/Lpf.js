import { Filter } from "../webAudio/Filter.js"

export function Lpf(defaults, config) {
  return Filter(defaults, config, "lowpass")
}
