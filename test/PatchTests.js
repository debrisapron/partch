describe('Patch', () => {

  it('can connect a source to a destination', () => {
    let p = P({
      source: P.Gain(),
      dest: P.Gain()
    }, 'source > dest')
    expect(p.nodes.source).toBeTruthy()
    expect(p.nodes.dest).toBeTruthy()
    expect(p.nodes.source.__connections.length).toEqual(1)
    expect(p.nodes.source.__connections[0]).toEqual(p.nodes.dest)
    expect(p.nodes.dest.__connections.length).toEqual(0)
  })

  it('can connect a source to its output', () => {
    let p = P({
      source: P.Gain()
    }, 'source > out')
    expect(p.nodes.out).toBeTruthy()
    expect(p.nodes.source.__connections.length).toEqual(1)
    expect(p.nodes.source.__connections[0]).toEqual(p.nodes.out)
  })

  it('can connect its input to a dest', () => {
    let p = P({
      dest: P.Gain()
    }, 'in > dest')
    expect(p.nodes.in).toBeTruthy()
    expect(p.nodes.in.__connections.length).toEqual(1)
    expect(p.nodes.in.__connections[0]).toEqual(p.nodes.dest)
  })

  it('can connect to a named input', () => {
    let p = P({
      dest: P.Gain()
    }, 'in > dest.gain')
    expect(p.nodes.in).toBeTruthy()
    expect(p.nodes.in.__connections.length).toEqual(1)
    expect(p.nodes.in.__connections[0]).toEqual(p.nodes.dest.gain)
  })
})
