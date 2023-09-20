describe("Filter", () => {
  test("can create a BiquadFilterNode", () => {
    let node = P.Filter()
    expect(node.constructor.name).toBe("BiquadFilterNode")
    expect(node.type).toBe("lowpass")
    expect(node.frequency.value).toBe(350)
  })

  test("can create a BiquadFilterNode with a given frequency", () => {
    let node = P.Filter(666)
    expect(node.frequency.value).toBe(666)
    expect(node.freq.value).toBe(666)
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
      expect(node.constructor.name).toBe("BiquadFilterNode")
      expect(node.type).toBe(filterType.toLowerCase())
      expect(node.frequency.value).toBe(666)
      // const wrongType = filterType == "Lowpass" ? "highpass" : "lowpass"
      // expect(() => {
      //   node.type = wrongType
      // }).toThrow()
    })
  })

  test("can set the frequencyCv param", () => {
    let node = P.Filter({ frequencyCv: 0.5 })
    expect(node.frequencyCv.value).toBe(0.5)
    expect(node.freqCv.value).toBe(0.5)
  })
})
