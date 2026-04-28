import test from "node:test"
import * as assert from "node:assert/strict"

test("can connect a source to a destination", () => {
  const s = P.Gain()
  const d = P.Gain()
  const p = P({
    source: s,
    dest: d,
    __: "source > dest",
  })
  assert.equal(p.constructor.name, "GainNode")
  assert.equal(p.__nodes.source, s)
  assert.equal(p.__nodes.dest, d)
  assert.equal(s.__connections.length, 1)
  assert.equal(s.__connections[0].destination, d)
  assert.equal(d.__connections.length, 0)
})

test("can connect a source to the output", () => {
  let d = P.Gain()
  let p = P({
    source1: P.Gain(),
    source2: P.Gain(),
    __: ["source1 > out", "source2 > out"],
  })
  const s1 = p.__nodes.source1
  const s2 = p.__nodes.source2
  assert.equal(s1.__connections.length, 0)
  assert.equal(s2.__connections.length, 0)
  p.connect(d)
  assert.equal(s1.__connections.length, 1)
  assert.equal(s2.__connections.length, 1)
  assert.equal(s1.__connections[0].destination, d)
  assert.equal(s2.__connections[0].destination, d)
})

test("can connect its input to a child node", () => {
  let p = P({
    dest: P.Gain(),
    __: "in > dest",
  })
  assert.equal(p.__connections.length, 1)
  assert.equal(p.__connections[0].destination, p.__nodes.dest)
})

test("can connect its input to a child node AudioParam", () => {
  let p = P({
    dest: P.Gain(),
    __: "in > dest.gain",
  })
  assert.equal(p.__connections.length, 1)
  assert.equal(p.__connections[0].destination, p.__nodes.dest.gain)
})

test("can alias a node", () => {
  let p = P({
    gain: P.Gain(),
    gainFoo: P.Gain(),
    __: ["in > gain > out", "in.foo > gainFoo"],
  })
  assert.equal(p.foo, p.__nodes.gainFoo)
})

test("can alias a node AudioParam", () => {
  let p = P({
    gain: P.Gain(),
    gainFoo: P.Gain(),
    __: ["in > gain > out", "in.foo > gainFoo.gain"],
  })
  assert.equal(p.foo, p.__nodes.gainFoo.gain)
})

test.skip("should convert an array of nodes to a Parallel node", () => {
  let p = P({
    dest: [P.Gain(), P.Gain()],
    __: "in > dest > out",
  })
  assert.ok(p.nodes.dest.nodes[0])
  assert.ok(p.nodes.dest.nodes[1])
})
