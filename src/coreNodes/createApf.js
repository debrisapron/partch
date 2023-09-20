import { createFilter } from "./createFilter.js"

export function createApf(context, config) {
  return createFilter(context, config, "allpass")
}
