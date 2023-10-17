import * as utils from "./utils.js"

export function defineAudioParam(node, name, factory) {
  let audioParam
  Object.defineProperty(node, name, {
    get() {
      return (audioParam ??= factory(node))
    },
  })
}

export function setNodeProps(defaults, node, props) {
  node.__defaults = defaults
  node.__props = props
  Object.entries(props)
    .filter((s) => !s.startsWith("_"))
    .forEach(([key, val]) => {
      const childNode = node.__nodes?.[key]
      if (childNode) {
        setNodeProps(defaults, childNode, val)
      } else if (utils.isAudioParam(node[key])) {
        node[key].value = val
      } else {
        node[key] = val
      }
    })
  if (props._props) {
    setNodeProps(defaults, node, props._props)
  }
}
