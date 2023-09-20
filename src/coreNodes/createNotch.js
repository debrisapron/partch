import { createFilter } from "./createFilter.js"

export function createNotch(context, config) {
  return createFilter(context, config, "notch")
}
