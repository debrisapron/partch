import * as utils from "../utils.js"

function testNode(node, dur = 0.2) {
  // Monitor the node if it's not connected to anything.
  // Then, if the node is a destination send a test sound
  // through it, otherwise just start & stop it after a bit.

  // TODO check if node is ultimately connected to destination...
  node.monitor()
  if (node.numberOfInputs > 0) {
    let src = new OscillatorNode(node.context, {
      type: "sawtooth",
      frequency: 440,
    })
    src.connect(node)
    src.start()
    src.stop(node.context.currentTime + dur * 1000)
  } else {
    node.start()
    node.stop(node.context.currentTime + dur * 1000)
  }
}

function getNativeNodeParams(config, { defaultParam, defaults }) {
  let params = config ?? {}
  const isScalar = !utils.isPlainObject(params)
  if (isScalar) {
    params = { [defaultParam]: config }
  }
  if (defaults) {
    params = { ...defaults, ...params }
  }
  if (params.startTime) {
    delete params.startTime
  }
  return params
}

function setNodeParams(classOptions, node, config) {
  const params = getNativeNodeParams(config, classOptions)
  Object.entries(params).forEach(([key, val]) => {
    const childNode = node.__nodes?.[key]
    if (childNode) {
      childNode.set(val)
      return
    }
    if (utils.isAudioParam(node[key])) {
      node[key].value = val
      return
    }
    node[key] = val
  })
}

export function createCoreNode(options, factoryFn, config) {
  const node = factoryFn(config)

  const enhancements = {
    set(config) {
      setNodeParams(options, node, config)
    },
    // monitor() {
    //   this.connect(this.context.destination)
    //   return this
    // }
    // test(...args) {
    //   testNode(this, ...args)
    // }
  }

  Object.assign(node, enhancements)

  node.set(config)

  return node
}
