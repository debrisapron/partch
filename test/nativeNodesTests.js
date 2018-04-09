describe('Native nodes', () => {

  describe('Constant', () => {

    it('can create a ConstantSourceNode', () => {
      let node = P.Const()
      expect(node).to.be.instanceof(ConstantSourceNode)
      expect(node.offset.value).to.equal(1)
    })

    it('can create a ConstantSourceNode with a given offset', () => {
      let node = P.Const(9000)
      expect(node.offset.value).to.equal(9000)
    })
  })

  describe('Delay', () => {

    it('can create a DelayNode', () => {
      let node = P.Delay()
      expect(node).to.be.instanceof(DelayNode)
      expect(node.delayTime.value).to.equal(0)
      expect(node.delayTime.maxValue).to.equal(1)
    })

    it('can create a DelayNode with a given delayTime', () => {
      let node = P.Delay(2)
      expect(node.delayTime.value).to.equal(2)
      expect(node.delayTime.maxValue).to.equal(2)
    })
  })

  describe('Filter', () => {

    it('can create a BiquadFilterNode', () => {
      let node = P.Filter()
      expect(node).to.be.instanceof(BiquadFilterNode)
      expect(node.type).to.equal('lowpass')
      expect(node.frequency.value).to.equal(350)
    })

    it('can create a BiquadFilterNode with a given frequency', () => {
      let node = P.Filter(666)
      expect(node.frequency.value).to.equal(666)
    })

    it('can create a highpass BiquadFilterNode', () => {
      let node = P.Hpf(666)
      expect(node).to.be.instanceof(BiquadFilterNode)
      expect(node.type).to.equal('highpass')
      expect(node.frequency.value).to.equal(666)
    })

    it('can set the frequencyCv param', () => {
      let node = P.Filter({ frequencyCv: 0.5 })
      expect(node.frequencyCv.value).to.equal(0.5)
    })
  })

  describe('Gain', () => {

    it('can create a GainNode', () => {
      let node = P.Gain()
      expect(node).to.be.instanceof(GainNode)
      expect(node.gain.value).to.equal(1)
    })

    it('can create a GainNode with a given gain', () => {
      let node = P.Gain(2)
      expect(node.gain.value).to.equal(2)
    })

    it('can set the gainCv param', () => {
      let node = P.Gain({ gainCv: 0.5 })
      expect(node.gainCv.value).to.equal(0.5)
    })
  })

  describe('Oscillator', () => {

    it('can create an OscillatorNode', () => {
      let node = P.Osc()
      expect(node).to.be.instanceof(OscillatorNode)
      expect(node.type).to.equal('sine')
      expect(node.frequency.value).to.equal(440)
    })

    it('can create an OscillatorNode with a given frequency', () => {
      let node = P.Osc(666)
      expect(node.frequency.value).to.equal(666)
    })

    it('can create a sawtooth OscillatorNode', () => {
      let node = P.Saw(666)
      expect(node).to.be.instanceof(OscillatorNode)
      expect(node.type).to.equal('sawtooth')
      expect(node.frequency.value).to.equal(666)
    })

    it('can set the frequencyCv param', () => {
      let node = P.Osc({ frequencyCv: 0.5 })
      expect(node.frequencyCv.value).to.equal(0.5)
    })
  })

  it('can create an AudioBufferSourceNode', () => {
    let buffer = P.context.createBuffer(1, 22050, 22050)
    let node = P.Sample(buffer)
    expect(node).to.be.instanceof(AudioBufferSourceNode)
    expect(node.buffer).to.equal(buffer)
  })

  it('can create a WaveShaperNode', () => {
    let curve = Float32Array.from([0, 0, 0])
    let node = P.Shaper(curve)
    expect(node).to.be.instanceof(WaveShaperNode)
    expect(node.curve).to.deep.equal(curve)
  })
})
