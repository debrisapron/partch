describe("Oscillator", () => {
  test("can create an OscillatorNode", () => {
    let node = P.Osc()
    expect(node.constructor.name).toBe("OscillatorNode")
    expect(node.type).toBe("sine")
    expect(node.frequency.value).toBe(440)
  })

  test("can create an OscillatorNode with a given frequency", () => {
    let node = P.Osc(666)
    expect(node.frequency.value).toBe(666)
  })

  Object.entries({
    Sawtooth: "Saw",
    Sine: "Sin",
    Square: "Sqr",
    Triangle: "Tri",
  }).forEach(([oscType, fname]) => {
    test(`can create a ${oscType} OscillatorNode`, () => {
      let node = P[fname](666)
      expect(node.constructor.name).toBe("OscillatorNode")
      expect(node.type).toBe(oscType.toLowerCase())
      expect(node.frequency.value).toBe(666)
      // const wrongType = oscType == "Sine" ? "sawtooth" : "sine"
      // expect(() => {
      //   node.type = wrongType
      // }).toThrow()
    })
  })

  test("can set the frequencyCv param", () => {
    let node = P.Osc({ frequencyCv: 0.5 })
    expect(node.frequencyCv.value).toBe(0.5)
  })

  test("can set the octave param", () => {
    let node = P.Osc({ octave: 1 })
    expect(node.octave).toBe(1)
    node.octave = 2
    expect(node.octave).toBe(2)
  })
})
