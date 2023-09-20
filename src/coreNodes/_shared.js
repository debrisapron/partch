import * as utils from "../utils.js"

// TODO Refactor, very confusing! Two different recursion paths!
// Recursively searches the prototype chain for the given prop.
// Returns the prop descriptor if found, undefined if not.
function getPropDescr(obj, prop) {
  if (!obj) {
    return
  }
  const [propHead, ...propTail] = prop.split(".")
  if (propTail.length > 0) {
    return getPropDescr(obj[propHead], propTail.join("."))
  }
  const objDescr = Object.getOwnPropertyDescriptor(obj, prop)
  if (objDescr) {
    return objDescr
  }
  const proto = Object.getPrototypeOf(obj)
  if (proto) {
    return getPropDescr(proto, prop)
  }
}

// Returns a new params object with any aliases replaced by their target names
function normalizeParamNames(params, aliases) {
  const obj = {}
  Object.keys(params).forEach((key) => {
    const normKey = aliases[key] || key
    obj[normKey] = params[key]
  })
  return obj
}

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

function getNativeNodeParams(config, { aliases, defaultParam, defaults }) {
  let params = config ?? {}
  const isScalar = !utils.isPlainObject(params)
  if (isScalar) {
    params = { [defaultParam]: config }
  }
  if (aliases) {
    params = normalizeParamNames(params, aliases)
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

// TODO Refactor this, too complicated
export function addAlias(node, alias, targetNode, target) {
  const descr = getPropDescr(targetNode, target)
  const aliasDescr = {}
  if (descr.get) {
    aliasDescr.get = function () {
      return this[target]
    }
  }
  if (descr.set) {
    aliasDescr.set = function (value) {
      this[target] = value
    }
  }
  if (!(descr.get || descr.set)) {
    aliasDescr.value = descr.value
  }
  Object.defineProperty(node, alias, aliasDescr)
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

  const { aliases } = options
  if (aliases) {
    Object.entries(aliases).forEach(([alias, target]) =>
      addAlias(node, alias, node, target)
    )
  }

  node.set(config)

  return node
}
