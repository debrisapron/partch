test("can create a WaveShaperNode", () => {
  let curve = Float32Array.from([0, 0, 0])
  let node = P.Shaper(curve)
  expect(node.constructor.name).toBe("WaveShaperNode")
  expect(node.curve).toEqual(curve)
})
