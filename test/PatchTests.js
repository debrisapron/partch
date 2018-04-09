describe('Patch', () => {

  it('can connect a source to a destination', () => {
    let p = P({
      source: P.Gain(),
      dest: P.Gain()
    }, 'source > dest')
    expect(p.nodes.source).to.exist
    expect(p.nodes.dest).to.exist
    expect(p.nodes.source.__connections.length).to.equal(1)
    expect(p.nodes.source.__connections[0]).to.equal(p.nodes.dest)
    expect(p.nodes.dest.__connections.length).to.equal(0)
  })

  it('can connect a source to its output', () => {
    let p = P({
      source: P.Gain()
    }, 'source > out')
    expect(p.nodes.out).to.exist
    expect(p.nodes.source.__connections.length).to.equal(1)
    expect(p.nodes.source.__connections[0]).to.equal(p.nodes.out)
  })

  it('can connect its input to a dest', () => {
    let p = P({
      dest: P.Gain()
    }, 'in > dest')
    expect(p.nodes.in).to.exist
    expect(p.nodes.in.__connections.length).to.equal(1)
    expect(p.nodes.in.__connections[0]).to.equal(p.nodes.dest)
  })

  it('can connect to a named input', () => {
    let p = P({
      dest: P.Gain()
    }, 'in > dest.gain')
    expect(p.nodes.in).to.exist
    expect(p.nodes.in.__connections.length).to.equal(1)
    expect(p.nodes.in.__connections[0]).to.equal(p.nodes.dest.gain)
  })

  it('should convert an array of nodes to a Parallel node', () => {
    let p = P({
      dest: [P.Gain(), P.Gain()]
    }, 'in > dest > out')
    expect(p.nodes.dest.nodes[0]).to.exist
    expect(p.nodes.dest.nodes[1]).to.exist
  })
})
