describe("Auto", () => {
  test("can automate a value", async () => {
    const node = P.Auto("1/2") // 0-1 in 2 seconds
    expect(node.offset.value).toBe(0)
    node.start()
    await offlineRender()
    expect(node.offset.value).toBeCloseTo(0.5)
  })
})
