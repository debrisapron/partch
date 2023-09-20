import { createFilter } from "./createFilter.js"

export function createHpf(context, config) {
  return createFilter(context, config, "highpass")
}
