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

  function connect(...args) {
    return nodes.out.connect(...args)
  }

  function disconnect(...args) {
    return nodes.out.disconnect(...args)
  }

  function stop(time) {
    let currTime = context.currentTime
    time = time || currTime
    Object.values(nodes).forEach((node) => node.stop && node.stop(time))
    setTimeout(
      () => nodes.out.disconnect(),
      (time - currTime) * 1000
    )
    return patch
  }

  function triggerAttack(time) {
    Object.values(nodes).forEach((node) => {
      node.triggerAttack && node.triggerAttack(time)
    })
    return patch
  }

  function triggerRelease(time) {
    time = time || context.currentTime
    let stopTimes = Object.values(nodes)
      .map((node) => node.triggerRelease ? node.triggerRelease(time) : time)
    let stopTime = Math.max(...stopTimes)
    // TODO This causes any non-envelope tails (e.g. delay) to be truncated at
    // stopTime. Smart solution is an analyzer that listens to signal and waits
    // for n seconds of silence, but could be resource-intensive. Could also
    // allow keepAlive setting which simply keeps all nodes with delays in
    // around for n seconds.
    stop(stopTime)
    return stopTime
  }

  let patch = {
    connect, disconnect, context, nodes, stop, triggerAttack, triggerRelease,
    input: nodes.in
  }
  partchifyNode(patch)
  return patch
}

export default Patch
