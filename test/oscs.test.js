import test from "node:test"
import * as assert from "node:assert/strict"

test("can create an OscillatorNode", () => {
  const node = P.Osc()
  assert.equal(node.constructor.name, "OscillatorNode")
  assert.equal(node.type, "sine")
  assert.equal(node.frequency.value, 440)
})

test("can create an OscillatorNode with a given frequency", () => {
  let node = P.Osc(666)
  assert.equal(node.frequency.value, 666)
})

Object.entries({
  Sawtooth: "Saw",
  Sine: "Sin",
  Square: "Sqr",
  Triangle: "Tri",
}).forEach(([oscType, fname]) => {
  test(`can create a ${oscType} OscillatorNode`, () => {
    let node = P[fname](666)
    assert.equal(node.constructor.name, "OscillatorNode")
    assert.equal(node.type, oscType.toLowerCase())
    assert.equal(node.frequency.value, 666)
    // const wrongType = oscType == "Sine" ? "sawtooth" : "sine"
    // expect(() => {
    //   node.type = wrongType
    // }).toThrow()
  })
})

test.skip("can set the frequencyCv param", () => {
  let node = P.Osc({ frequencyCv: 0.5 })
  assert.equal(node.frequencyCv.value, 0.5)
})

test("can set the octave param", () => {
  let node = P.Osc({ octave: 1 })
  assert.equal(node.octave, 1)
  node.octave = 2
  assert.equal(node.octave, 2)
})
