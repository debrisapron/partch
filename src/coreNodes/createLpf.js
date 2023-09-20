import { createFilter } from "./createFilter.js"

export function createLpf(context, config) {
  return createFilter(context, config, "lowpass")
}
