describe("Constant", () => {
  test("can create a ConstantSourceNode", () => {
    const node = P.Const()
    expect(node.constructor.name).toBe("ConstantSourceNode")
    expect(node.offset.value).toBe(1)
  })

  test("can create a ConstantSourceNode with a given offset", () => {
    const node = P.Const(9000)
    expect(node.offset.value).toBe(9000)
  })
})
