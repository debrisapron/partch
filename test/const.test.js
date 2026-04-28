import test from "node:test"
import * as assert from "node:assert/strict"

test("can create a ConstantSourceNode", () => {
  const node = P.Const()
  assert.equal(node.constructor.name, "ConstantSourceNode")
  assert.equal(node.offset.value, 1)
})

test("can create a ConstantSourceNode with a given offset", () => {
  const node = P.Const(9000)
  assert.equal(node.offset.value, 9000)
})
