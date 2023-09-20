import { createCoreNode } from "./_shared.js"

// NOTE
// Currently changing the waveshaper curve in node-web-audio-api
// throws "InvalidStateError - cannot assign curve twice"
// TODO Check if this happens in browser
const CREATION_OPTIONS = {
  defaultParam: "curve",
}

export function createShaper(context, config) {
  return createCoreNode(
    CREATION_OPTIONS,
    () => new WaveShaperNode(context),
    config
  )
}
