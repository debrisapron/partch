import * as utils from "../utils.js"
import { createCoreNode } from "./_shared.js"

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
    return srcNode
  }

  const destNode = resolveChild(node, dest)
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

function customize(node, graph) {
  const wires = graph.__
  node.__nodes = utils.withoutKey(graph, "__")
  const outputs = wireGraph(node, wires)
  node.connect = (...args) => connectOutputs(outputs, ...args)
  return node
}

export function createPatch(context, graph) {
  return createCoreNode({}, () => customize(new GainNode(context), graph), null)
}
