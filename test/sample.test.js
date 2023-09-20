describe("Sample", () => {
  test("can create an AudioBufferSourceNode", () => {
    let buffer = P.context.createBuffer(1, 22050, 22050)
    let node = P.Sample(buffer)
    expect(node.constructor.name).toBe("AudioBufferSourceNode")
    expect(node.buffer).toBe(buffer)
  })
})
