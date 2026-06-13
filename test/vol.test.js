import test from "node:test"
import * as assert from "node:assert/strict"

test("can create a Vol node", () => {
  let node = P.Vol()
  assert.equal(node.constructor.name, "GainNode")
  assert.equal(node.gain.value, 0)
  assert.equal(node.level.value, 1)
})

test("can create a Vol node with a given level", () => {
  let node = P.Vol(0.5)
  assert.equal(node.level.value, 0.5)
})
