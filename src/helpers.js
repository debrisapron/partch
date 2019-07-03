import loadAudio from 'audio-loader'
// Circular references FTW
import { Saw } from './nativeNodes'
import { WhiteNoise } from './noiseNodes'

let _playingNodes = new Map()
let _audioFileCache = {}

function normalizeAliases(params, aliases) {
  let obj = {}
  Object.keys(params).forEach((key) => {
    let normKey = aliases[key] || key
    obj[normKey] = params[key]
  })
  return obj
}

function setNodeParams(node, config) {
  let params = getNodeParams({ ...node.__partchMeta, config })
  Object.keys(params).forEach((key) => {
    let val = params[key]
    if (node.nodes && node.nodes[key]) {
      setNodeParams(node.nodes[key], val)
      return
    }
    let attr = node[key]
    if (attr instanceof AudioParam) {
      attr.value = val
      return
    }
    node[key] = val
  })
}

export function isPlainObject(thing) {
  return typeof thing === 'object' && thing.constructor === Object
}

export function upTo(length) {
  return Array(length).fill().map((__, i) => i)
}

export function stopAllNodes() {
  // TODO Should also disconnect everything. Poss way to do this: use a master
  // node instead of context.destination & disconnect that.
  Array.from(_playingNodes).forEach(([node]) => node.stop())
}

export function testNode(node, dur = 0.2, type = 'bleep') {
  // Monitor the node, and if the node is a destination, send a test sound
  // through it, otherwise just stop it after a bit.
  if (node.input) {
    let src = type === 'noise' ? WhiteNoise(node.context) : Saw(node.context)
    src.connect(node)
    setTimeout(src.stop, dur * 1000)
    setTimeout(node.stop, 10000)
  } else {
    setTimeout(node.stop, dur * 1000)
  }
  node.monitor()
}

// Takes a sad node and makes it better.
export function partchifyNode(node, meta = {}) {
  node.__partchMeta = meta

  // If node can be connected, make connect understand `node.input` and add
  // monitor & test methods.
  if (node.connect && !node.__connectPatched) {
    node.__connectPatched = true
    node.__connect = node.connect
    node.__disconnect = node.disconnect
    node.__connections = []

    node.connect = (destination) => {
      node.__connect(destination.input || destination)
      node.__connections.push(destination)
      return destination
    }

    node.disconnect = (outputOrDestination, output, input) => {
      if (!outputOrDestination) {
        node.__disconnect()
        node.__connections = []
      } else if (!isNaN(outputOrDestination)) {
        node.__disconnect(outputOrDestination)
        // TODO Handle multiple outputs.
      } else {
        let destination = outputOrDestination
        node.__disconnect(destination.input || destination, output, input)
        node.__connections = node.__connections.filter((conn) => {
          return conn !== destination
        })
      }
      return node
    }

    node.monitor = () => {
      node.__connect(node.context.destination)
      return node
    }

    node.test = (...args) => testNode(node, ...args)
  }

  // If node is a source, patch stop to record its stopped / not stopped status.
  if (node.stop && !node.__stopPatched) {
    node.__stopPatched = true
    node.__stop = node.stop
    _playingNodes.set(node, true)

    node.stop = (time) => {
      node.__stop(time)
      _playingNodes.delete(node)
    }
  }

  node.set = (config) => {
    setNodeParams(node, config)
    return node
  }
}

export function loadAudioFile(context, url) {
  if (_audioFileCache[url]) { return Promise.resolve(_audioFileCache[url]) }
  let promiseOfBuffer = loadAudio(url, { context })
  promiseOfBuffer.then((buffer) => _audioFileCache[url] = buffer)
  _audioFileCache[url] = promiseOfBuffer
  return promiseOfBuffer
}

export function getNodeParams({ aliases, config, defaultParam, defaults }) {
  let params = config === undefined || isPlainObject(config)
    ? ({...config} || {})
    : { [defaultParam]: config }
  if (aliases) {
    params = normalizeAliases(params, aliases)
  }
  if (defaults) {
    params = { ...defaults, ...params }
  }
  if (params.startTime) {
    delete params.startTime
  }
  return params
}

export function PartchNode({
  aliases, config, context, createNode, defaultParam, defaults, isDest
}) {
  let params = getNodeParams({ aliases, config, defaultParam, defaults })
  let node = createNode(context, params)
  if (isDest) { node.input = node }
  partchifyNode(node, { aliases, defaultParam })
  if (node.start) {
    node.start((config && config.startTime) || context.currentTime)
  }
  return node
}
