// Circular references FTW
import { Osc } from './nodes/nativeNodes'
import { WhiteNoise } from './nodes/noiseNodes'

let _allNodes = []

export function isPlainObject(thing) {
  return typeof thing === 'object' && thing.constructor === Object
}

export function resetContext(context) {
  context.__nodes.forEach((node) => {
    if (node.__started && !node.__stopped) { node.stop() }
    if (node.disconnect) { node.disconnect() }
  })
  context.__nodes = []
}

export function testNode(node, dur = 0.2, type) {
  // If the node is a destination, test sends a test sound through it, otherwise
  // just starts & stops it.
  node.monitor()
  if (node.start) { node.start().stopAfter(dur) }
  if (node.input) {
    let src = type === 'noise'
      ? WhiteNoise(node.context)
      : Osc(node.context, { type: 'sawtooth' })
    src.start().stopAfter(dur).connect(node)
  }
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

  // If node is a source, make start & stop return the node and add stopAfter.
  if (node.start) {
    node.__start = node.start
    node.__stop = node.stop
    node.__started = false
    node.__stopped = false

    node.start = (time) => {
      node.__start(time)
      node.__started = true
      return node
    }

    node.stop = (time) => {
      node.__stop(time)
      node.__stopped = true
      return node
    }

    node.stopAfter = (interval) => {
      let stopTime = interval + node.context.currentTime
      let timeout = Math.abs((interval * 1000) - 10)
      setTimeout(() => node.__stop(stopTime), timeout)
      return node
    }
  }

  // If node has a release function, add releaseAfter.
  if (node.release) {
    node.releaseAfter = (interval) => {
      let releaseTime = interval + node.context.currentTime
      let timeout = Math.abs((interval * 1000) - 10)
      setTimeout(() => node.release(releaseTime), timeout)
      return node
    }
  }
}
