import * as utils from "./utils.js"
import { setNodeProps, defineAudioParam } from "./helpers.js"

// function testNode(node, dur = 0.2) {
//   // Monitor the node if it's not connected to anything.
//   // Then, if the node is a destination send a test sound
//   // through it, otherwise just start & stop it after a bit.

//   // TODO Only monitor if node not connected to anything
//   node.monitor()
//   if (node.numberOfInputs > 0) {
//     let src = new OscillatorNode(node.context, {
//       type: "sawtooth",
//       frequency: 440,
//     })
//     src.connect(node)
//     src.start()
//     src.stop(node.context.currentTime + dur)
//   } else {
//     node.start()
//     node.stop(node.context.currentTime + dur)
//   }
// }

function createDetune(node) {
  const constNode = new ConstantSourceNode(node.context, { offset: 0 })
  Object.values(node.__nodes).forEach((child) => {
    if (child.detune && child.__params._follow) {
      // TODO follow amount
      constNode.connect(child.detune)
    }
  })
  constNode.start()
  return constNode.offset
}

// A child may be a node itself (in __nodes) or an AudioParam
function resolveChild(node, path) {
  if (!Array.isArray(path)) {
    path = path.split(".")
  }
  const [root, ...restOfPath] = path

  // Look in __nodes then node itself
  const child =
    node.__nodes?.[root] ?? (utils.isAudioParam(node[root]) && node[root])
  if (!child || restOfPath.length === 0) {
    return child
  }
  return resolveChild(child, restOfPath)
}

function addNamedInput(node, name, dest) {
  if (name.includes(".")) {
    throw new Error(`Invalid input name "${name}"`)
  }
  Object.defineProperty(node, name, {
    value: resolveChild(node, dest),
    writable: false,
  })
}

// NOTE This must be run **before** monkeypatching connect!
// TODO Too complicated, figure out a way to make it clearer
function wireSrcToDest(node, src, dest) {
  if (src.startsWith("in.")) {
    addNamedInput(node, src.slice(3), dest)
    return
  }

  const srcIsInput = src === "in"
  const destIsOutput = dest === "out"
  if (srcIsInput && destIsOutput) {
    throw new Error("Cannot connect patch input directly to patch output")
  }

  const srcNode = srcIsInput ? node : resolveChild(node, src)
  if (destIsOutput) {
    node.__outputs.push(srcNode)
    return
  }

  const destNode = resolveChild(node, dest)
  if (srcIsInput) {
    node.__inputs.push(destNode)
  }

  srcNode.connect(destNode)
}

// TODO Unknown inputs = aliases
function wireGraph(node, wires) {
  // TODO default connections
  const outputs = []
  utils.forceArr(wires).forEach((wire) =>
    wire
      .split(">")
      .map((pp) => pp.trim())
      .reduce((src, dest) => {
        // TODO in only valid at start
        // TODO out only valid at end
        // TODO throw error if from has a dot AND is not first
        // TODO throw error if to has a dot AND is not last
        const output = wireSrcToDest(node, src, dest)
        if (output) {
          outputs.push(output)
        }
        return dest
      })
  )
  return outputs
}

// TODO allow child path as outputIndex
// TODO allow child path as inputIndex
function connectOutputs(outputs, ...connectArgs) {
  return outputs.map((output) => output.connect(...connectArgs))[0]
}

export function Patch(defaults, config) {
  const node = new GainNode(defaults.context, { gain: 1 })

  const props = utils.filterObj(config, (k) => k.startsWith("_") && k !== "__")
  setNodeProps(defaults, node, props)
  node.__nodes = utils.filterObj(config, (k) => !k.startsWith("_"))
  node.__inputs = []
  node.__outputs = []
  const wires = config.__
  wireGraph(node, wires)

  Object.defineProperties(node, {
    numberOfInputs: {
      get: () => (node.__inputs.length > 0 ? 1 : 0),
    },
    numberOfOutputs: {
      get: () => (node.__outputs.length > 0 ? 1 : 0),
    },
  })

  node.connect = (...args) => connectOutputs(node.__outputs, ...args)

  node.__release = true
  node.start = (t) => {
    Object.values(node.__nodes)
      .filter((ch) => ch.start)
      .forEach((child) => {
        child.start(t)
      })
  }
  node.stop = (t = 0) => {
    let stopTime = t
    Object.values(node.__nodes)
      .filter((ch) => ch.__release)
      .forEach((ch) => {
        stopTime = Math.max(ch.stop(t), stopTime)
      })
    Object.values(node.__nodes)
      .filter((ch) => ch.stop && !ch.__release)
      .forEach((child) => {
        child.stop(stopTime)
      })
    return stopTime
  }
  // node.set = (config) => setNodeProps(node, config)
  // node.monitor = () => {
  //   node.connect(node.context.destination)
  //   return node
  // }
  // node.test = (...args) => {
  //   testNode(node, ...args)
  // }

  defineAudioParam(node, "detune", createDetune)

  return node
}
