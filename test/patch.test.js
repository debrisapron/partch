describe("Patch", () => {
  test("can connect a source to a destination", () => {
    let s, d
    let p = P({
      source: (s = P.Gain()),
      dest: (d = P.Gain()),
      __: "source > dest",
    })
    expect(p.constructor.name).toBe("GainNode")
    expect(p.__nodes.source).toBe(s)
    expect(p.__nodes.dest).toBe(d)
    expect(s.__connections.length).toBe(1)
    expect(s.__connections[0].destination).toBe(d)
    expect(d.__connections.length).toBe(0)
  })

  test("can connect a source to the output", () => {
    let d = P.Gain()
    let p = P({
      source1: P.Gain(),
      source2: P.Gain(),
      __: ["source1 > out", "source2 > out"],
    })
    const s1 = p.__nodes.source1
    const s2 = p.__nodes.source2
    expect(s1.__connections.length).toBe(0)
    expect(s2.__connections.length).toBe(0)
    p.connect(d)
    expect(s1.__connections.length).toBe(1)
    expect(s2.__connections.length).toBe(1)
    expect(s1.__connections[0].destination).toBe(d)
    expect(s2.__connections[0].destination).toBe(d)
  })

  test("can connect its input to a child node", () => {
    let p = P({
      dest: P.Gain(),
      __: "in > dest",
    })
    expect(p.__connections.length).toBe(1)
    expect(p.__connections[0].destination).toBe(p.__nodes.dest)
  })

  test("can connect its input to a child node AudioParam", () => {
    let p = P({
      dest: P.Gain(),
      __: "in > dest.gain",
    })
    expect(p.__connections.length).toBe(1)
    expect(p.__connections[0].destination).toBe(p.__nodes.dest.gain)
  })

  test("can alias a node", () => {
    let p = P({
      gain: P.Gain(),
      gainFoo: P.Gain(),
      __: ["in > gain > out", "in.foo > gainFoo"],
    })
    expect(p.foo).toBe(p.__nodes.gainFoo)
  })

  test("can alias a node AudioParam", () => {
    let p = P({
      gain: P.Gain(),
      gainFoo: P.Gain(),
      __: ["in > gain > out", "in.foo > gainFoo.gain"],
    })
    expect(p.foo).toBe(p.__nodes.gainFoo.gain)
  })

  // test('should convert an array of nodes to a Parallel node', () => {
  //   let p = P({
  //     dest: [P.Gain(), P.Gain()]
  //   }, 'in > dest > out')
  //   expect(p.nodes.dest.nodes[0]).to.exist
  //   expect(p.nodes.dest.nodes[1]).to.exist
  // })
})
