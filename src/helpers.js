import loadAudio from 'audio-loader'
// Circular references FTW
import { Saw } from './nodes/nativeNodes'
import { WhiteNoise } from './nodes/noiseNodes'

let _allNodes = []
let _audioFileCache = {}

export function isPlainObject(thing) {
  return typeof thing === 'object' && thing.constructor === Object
}

export function resetContext(context) {
  context.__nodes.forEach((node) => {
    if (node.stop && !node.__stopped) { node.stop() }
    if (node.disconnect) { node.disconnect() }
  })
  context.__nodes = []
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
export function partchifyNode(node) {
  node.__partchNode = true
  node.context.__nodes.push(node)

  // If node can be connected, make connect understand `node.input` and add
  // monitor & test methods.
  if (node.connect) {
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

  // If node is a source, patch stop to register its stoppedness.
  if (node.stop) {
    node.__stop = node.stop
    node.__stopped = false

    node.stop = (time) => {
      node.__stop(time)
      node.__stopped = true
    }
  }
}

export function loadAudioFile(context, url) {
  if (_audioFileCache[url]) { return Promise.resolve(_audioFileCache[url]) }
  let promiseOfBuffer = loadAudio(url, { context })
  promiseOfBuffer.then((buffer) => _audioFileCache[url] = buffer)
  _audioFileCache[url] = promiseOfBuffer
  return promiseOfBuffer
}
