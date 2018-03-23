describe('Patch', () => {

  it('can connect a source to a destination', () => {
    let patch = P({
      source: MockSource(),
      dest: MockDest()
    }, 'source > dest')
    expect(patch.nodes.source).toBeTruthy()
    expect(patch.nodes.dest).toBeTruthy()
    expect(patch.nodes.source.__connections.length).toEqual(1)
    expect(patch.nodes.source.__connections[0]).toEqual('INPUT')
    expect(patch.nodes.dest.__connections.length).toEqual(0)
  })

  it('can connect a source to its output', () => {
    let patch = P({
      source: MockSource()
    }, 'source > out')
    expect(patch.nodes.out).toBeTruthy()
    expect(patch.nodes.source.__connections.length).toEqual(1)
    expect(patch.nodes.source.__connections[0]).toEqual(patch.nodes.out)
  })
})

function MockSource() {
  return {
    __connections: [],
    __startedAt: null,
    __stoppedAt: null,
    connect(dest) {
      this.__connections.push(dest)
    },
    start(t) {
      this.__startedAt = t
    },
    stop(t) {
      this.__stoppedAt = t
    }
  }
}

function MockDest() {
  return {
    __connections: [],
    connect(dest) {
      this.__connections.push(dest)
    },
    input: 'INPUT'
  }
}
