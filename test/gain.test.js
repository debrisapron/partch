describe("Gain", () => {
  test("can create a GainNode", () => {
    let node = P.Gain()
    expect(node.constructor.name).toBe("GainNode")
    expect(node.gain.value).toBe(1)
  })

  test("can create a GainNode with a given gain", () => {
    let node = P.Gain(2)
    expect(node.gain.value).toBe(2)
  })

  test("can set the gainCv param", () => {
    let node = P.Gain({ gainCv: 0.5 })
    expect(node.gainCv.value).toBe(0.5)
  })
})
