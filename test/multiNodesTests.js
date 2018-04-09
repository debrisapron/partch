describe('Multi nodes', () => {

  describe('Parallel', () => {

    it('can wire up parallel nodes from an array', () => {
      let n = P.Parallel([ P.Gain(), P.Gain() ])
      expect(n.nodes[0]).to.exist
      expect(n.nodes[1]).to.exist
      expect(n.nodes.in).to.exist
      expect(n.nodes.out).to.exist
      expect(n.nodes.in.__connections.length).to.equal(2)
      expect(n.nodes.in.__connections[0]).to.equal(n.nodes[0])
      expect(n.nodes.in.__connections[1]).to.equal(n.nodes[1])
      expect(n.nodes[0].__connections.length).to.equal(1)
      expect(n.nodes[0].__connections[0]).to.equal(n.nodes.out)
      expect(n.nodes[1].__connections.length).to.equal(1)
      expect(n.nodes[1].__connections[0]).to.equal(n.nodes.out)
    })

    it('can create parallel nodes from a callback & a count', () => {
      let n = P.Parallel(() => P.Gain(), 2)
      expect(n.nodes[0]).to.exist
      expect(n.nodes[1]).to.exist
      expect(n.nodes.in).to.exist
      expect(n.nodes.out).to.exist
      expect(n.nodes.in.__connections.length).to.equal(2)
      expect(n.nodes.in.__connections[0]).to.equal(n.nodes[0])
      expect(n.nodes.in.__connections[1]).to.equal(n.nodes[1])
      expect(n.nodes[0].__connections.length).to.equal(1)
      expect(n.nodes[0].__connections[0]).to.equal(n.nodes.out)
      expect(n.nodes[1].__connections.length).to.equal(1)
      expect(n.nodes[1].__connections[0]).to.equal(n.nodes.out)
    })
  })
})
