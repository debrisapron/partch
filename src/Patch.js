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
    // TODO Instead of waiting an arbitrarily long time, we should wait until
    // the patch is no longer making sound for a while, *then* stop it. Also it
    // should be possible to override this behaviour.
    stop(stopTime + 30)
    return patch
  }

  let patch = {
    connect, disconnect, context, nodes, stop, triggerAttack, triggerRelease,
    input: nodes.in
  }
  partchifyNode(patch)
  return patch
}

export default Patch
