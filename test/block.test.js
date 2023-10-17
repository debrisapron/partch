describe("Block", () => {
  test("can set duration for a node", () => {
    let b = P.Block({
      node: P.Osc(666),
      secs: 0.1,
    })
    expect(b.frequency.value).toBe(666)
  })

  test("can play for a given number of seconds", async () => {
    let b = P.Block({
      node: P.Osc(665),
      secs: 0.5,
    })
    b.connect(P.context.destination)
    b.start()
    await offlineRender()
    expect(sampsNear(0.4)).not.toBe(0)
    expect(sampsNear(0.6)).toBe(0)
  })
})
