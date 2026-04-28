import test from "node:test"
import * as assert from "node:assert/strict"

test("can create an AudioBufferSourceNode", () => {
  let buffer = P.context.createBuffer(1, 22050, 22050)
  let node = P.Sample(buffer)
  assert.equal(node.constructor.name, "AudioBufferSourceNode")
  assert.equal(node.buffer, buffer)
})
