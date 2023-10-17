describe("Seq", () => {
  test("can play one block after another", async () => {
    let seq = P.Seq({
      blocks: [
        { node: P.Osc(220), ticks: 1 },
        { node: P.Osc(440), ticks: 1 },
      ],
    })
    seq.monitor()
    seq.start()
    // await offlineRender()
    // expect(sampsNear(0.2)).not.toBe(0)
    // expect(sampsNear(0.3)).toBe(0)
  })
})
