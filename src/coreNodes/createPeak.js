import { createFilter } from "./createFilter.js"

export function createPeak(context, config) {
  return createFilter(context, config, "peaking")
}
