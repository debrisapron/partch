import { createCoreNode } from "./_shared.js"

const CREATION_OPTIONS = { defaultParam: "offset" }

export function createConst(context, config) {
  return createCoreNode(
    CREATION_OPTIONS,
    () => new ConstantSourceNode(context),
    config
  )
}
