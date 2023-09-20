import { createFilter } from "./createFilter.js"

export function createLowShelf(context, config) {
  return createFilter(context, config, "lowshelf")
}
