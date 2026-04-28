import test from "node:test"
import * as assert from "node:assert/strict"

test("can create a DelayNode", () => {
  let node = P.Delay()
  assert.equal(node.constructor.name, "DelayNode")
  assert.equal(node.delayTime.value, 0)
  // node-web-audio-api doesn't expose maxDelayTime?
})

test("can create a DelayNode with a given delayTime", () => {
  let node = P.Delay(1)
  assert.equal(node.delayTime.value, 1)
})
