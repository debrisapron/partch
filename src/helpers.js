import * as utils from "./utils.js"

export function defineAudioParam(node, name, factory) {
  let audioParam
  Object.defineProperty(node, name, {
    get() {
      return (audioParam ??= factory(node))
    },
  })
}

function setNodeParam(node, key, val) {
  const childNode = node.__nodes?.[key]
  if (childNode) {
    setNodeParams(childNode, val)
  } else if (utils.isAudioParam(node[key])) {
    node[key].value = val
  } else {
    node[key] = val
  }
}

export function setNodeParams(node, params) {
  Object.entries(params).forEach(([key, val]) => {
    setNodeParam(node, key, val)
  })
}
