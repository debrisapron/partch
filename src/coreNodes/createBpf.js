import { createFilter } from "./createFilter.js"

export function createBpf(context, config) {
  return createFilter(context, config, "bandpass")
}
