// Circular references FTW
import { Osc } from './nodes/nativeNodes'
import { WhiteNoise } from './nodes/noiseNodes'

let _allNodes = []

export function isPlainObject(thing) {
  return typeof thing === 'object' && thing.constructor === Object
}

export function stopAndDisconnectAllNodes() {
  _allNodes.forEach((node) => {
    node.__started && node.stop()
    node.disconnect && node.disconnect()
  })
  _allNodes = []
}

export function testNode(node, dur = 0.2, type) {
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
  node.__connect = node.connect
  node.__start = node.start
  node.__stop = node.stop
  node.__started = false
  _allNodes.push(node)

  // If node can be connected, make connect understand `node.input` and add
  // monitor function.
  if (node.connect) {
    node.connect = (destination) => {
      node.__connect(destination.input || destination)
      return destination
    }

    // TODO Make `disconnect` understand `node.input`.

    node.monitor = () => {
      node.__connect(node.context.destination)
      return node
    }
  }

  // If node is a source, make start & stop return the node and add stopAfter.
  if (node.start) {
    node.start = (time) => {
      node.__start(time)
      node.__started = true
      return node
    }

    node.stop = (time) => {
      node.__stop(time)
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

  // Add a test function. If the node is a destination, test sends a test sound
  // through it, otherwise just starts & stops it.
  if (node.connect) {
    node.test = (...args) => testNode(node, ...args)
  }
}
