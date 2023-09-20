import { createFilter } from "./createFilter.js"

export function createHighShelf(context, config) {
  return createFilter(context, config, "highshelf")
}
