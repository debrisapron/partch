describe("Delay", () => {
  test("can create a DelayNode", () => {
    let node = P.Delay()
    expect(node.constructor.name).toBe("DelayNode")
    expect(node.delayTime.value).toBe(0)
    // node-web-audio-api doesn't expose maxDelayTime?
  })

  test("can create a DelayNode with a given delayTime", () => {
    let node = P.Delay(1)
    expect(node.delayTime.value).toBe(1)
  })
})
