import * as coreNodes from "./coreNodes/index.js"

export function partch({ context = new AudioContext() } = {}) {
  const withContext = (fn) => (config) => fn(context, config)

  const P = withContext(coreNodes.createPatch)
  P.context = context
  Object.entries(coreNodes).map(([name, fn]) => {
    // Remove "create" from start of name
    P[name.slice(6)] = withContext(fn)
  })

  // _Patch.panic = stopAllNodes
  // _Patch.load = (url) => loadAudioFile(ctx, url)
  return P
}
