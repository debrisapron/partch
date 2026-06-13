import test from "node:test"
import * as assert from "node:assert/strict"

test("can create a GainNode", () => {
  let node = P.Gain()
  assert.equal(node.constructor.name, "GainNode")
  assert.equal(node.gain.value, 1)
})

test("can create a GainNode with a given gain", () => {
  let node = P.Gain(2)
  assert.equal(node.gain.value, 2)
})
