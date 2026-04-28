import test from "node:test"
import * as assert from "node:assert/strict"

test("can create a BiquadFilterNode", () => {
  let node = P.Filter()
  assert.equal(node.constructor.name, "BiquadFilterNode")
  assert.equal(node.type, "lowpass")
  assert.equal(node.frequency.value, 350)
})

test("can create a BiquadFilterNode with a given frequency", () => {
  let node = P.Filter(666)
  assert.equal(node.frequency.value, 666)
  // assert.equal(node.freq.value, 666)
})

Object.entries({
  Allpass: "Apf",
  Bandpass: "Bpf",
  Highshelf: "HighShelf",
  Highpass: "Hpf",
  Lowshelf: "LowShelf",
  Lowpass: "Lpf",
  Notch: "Notch",
  Peaking: "Peak",
}).forEach(([filterType, fname]) => {
  test(`can create a ${filterType} BiquadFilterNode`, () => {
    let node = P[fname](666)
    assert.equal(node.constructor.name, "BiquadFilterNode")
    assert.equal(node.type, filterType.toLowerCase())
    assert.equal(node.frequency.value, 666)
    // const wrongType = filterType == "Lowpass" ? "highpass" : "lowpass"
    // expect(() => {
    //   node.type = wrongType
    // }).toThrow()
  })
})

test.skip("can set the frequencyCv param", () => {
  let node = P.Filter({ frequencyCv: 0.5 })
  assert.equal(node.frequencyCv.value, 0.5)
  assert.equal(node.freqCv.value, 0.5)
})
