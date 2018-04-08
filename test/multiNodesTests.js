describe('Multi nodes', () => {

  describe('Parallel', () => {

    it('can wire up parallel nodes from an array', () => {
      let n = P.Parallel([ P.Gain(), P.Gain() ])
      expect(n.nodes[0]).toBeTruthy()
      expect(n.nodes[1]).toBeTruthy()
      expect(n.nodes.in).toBeTruthy()
      expect(n.nodes.out).toBeTruthy()
      expect(n.nodes.in.__connections.length).toEqual(2)
      expect(n.nodes.in.__connections[0]).toEqual(n.nodes[0])
      expect(n.nodes.in.__connections[1]).toEqual(n.nodes[1])
      expect(n.nodes[0].__connections.length).toEqual(1)
      expect(n.nodes[0].__connections[0]).toEqual(n.nodes.out)
      expect(n.nodes[1].__connections.length).toEqual(1)
      expect(n.nodes[1].__connections[0]).toEqual(n.nodes.out)
    })

    it('can create parallel nodes from a callback & a count', () => {
      let n = P.Parallel(() => P.Gain(), 2)
      expect(n.nodes[0]).toBeTruthy()
      expect(n.nodes[1]).toBeTruthy()
      expect(n.nodes.in).toBeTruthy()
      expect(n.nodes.out).toBeTruthy()
      expect(n.nodes.in.__connections.length).toEqual(2)
      expect(n.nodes.in.__connections[0]).toEqual(n.nodes[0])
      expect(n.nodes.in.__connections[1]).toEqual(n.nodes[1])
      expect(n.nodes[0].__connections.length).toEqual(1)
      expect(n.nodes[0].__connections[0]).toEqual(n.nodes.out)
      expect(n.nodes[1].__connections.length).toEqual(1)
      expect(n.nodes[1].__connections[0]).toEqual(n.nodes.out)
    })
  })
})
