import { partchifyNode } from './helpers'
import { Gain } from './nodes/nativeNodes'

function Patch(context, nodes, ...connections) {

  // Clone nodes collection as we will be mutating it.
  nodes = { ...nodes }

  // Connect nodes
  connections.forEach((row) => row
    .split('>')
    .map((pp) => pp.trim())
    .reduce((from, to) => {
      if (from === 'in' && !nodes.in) {
        nodes.in = Gain(context)
      }
      if (to === 'out' && !nodes.out) {
        nodes.out = Gain(context)
      }
      let fromNode = nodes[from]
      let toNode = getNodeFromPath(to)
      fromNode.connect(toNode.input || toNode)

      // We always connect from the root node of the path.
      return to.split('.')[0]
    })
  )

  function getNodeFromPath(path) {
    let pathNodes = path.split('.')
    return pathNodes.reduce((parent, child) => {
      return parent[child] || (parent.nodes && parent.nodes[child])
    }, nodes)
  }

  //// Patch instance methods //////////////////////////////////////////////////

  function start(time = 0) {
    Object.values(nodes).forEach((node) => node.start && node.start(time))
    return patch
  }

  function stop(time = 0) {
    Object.values(nodes).forEach((node) => node.stop && node.stop(time))
    return patch
  }

  function release(time = 0) {
    let stopTimes = Object.values(nodes)
      .map((node) => node.release ? node.release(time) : time)
    let stopTime = Math.max(...stopTimes)
    stop(stopTime)
    return patch
  }

  function connect(destination) {
    return nodes.out.connect(destination)
  }

  let patch = {
    connect, context, nodes, release, start, stop,
    input: nodes.in
  }
  partchifyNode(patch)
  return patch
}

export default Patch
