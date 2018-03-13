describe('Native nodes', () => {

  it('can create a ConstantSourceNode', () => {
    let node = P.Const(9000)
    expect(node).toEqual(jasmine.any(ConstantSourceNode))
    expect(node.offset.value).toEqual(9000)
  })

  it('can create a DelayNode', () => {
    let node = P.Delay(2)
    expect(node).toEqual(jasmine.any(DelayNode))
    expect(node.delayTime.value).toEqual(2)
  })

  describe('Filter', () => {

    it('can create a lowpass BiquadFilterNode', () => {
      let node = P.Filter(666)
      expect(node).toEqual(jasmine.any(BiquadFilterNode))
      expect(node.type).toEqual('lowpass')
      expect(node.frequency.value).toEqual(666)
    })

    it('can create a highpass BiquadFilterNode', () => {
      let node = P.Hpf(666)
      expect(node).toEqual(jasmine.any(BiquadFilterNode))
      expect(node.type).toEqual('highpass')
      expect(node.frequency.value).toEqual(666)
    })

    it('can set the frequencyCv param', () => {
      let node = P.Filter({ frequencyCv: 0.5 })
      expect(node.frequencyCv.value).toEqual(0.5)
    })
  })

  describe('Gain', () => {
    
    it('can create a GainNode', () => {
      let node = P.Gain(2)
      expect(node).toEqual(jasmine.any(GainNode))
      expect(node.gain.value).toEqual(2)
    })

    it('can set the gainCv param', () => {
      let node = P.Gain({ gainCv: 0.5 })
      expect(node.gainCv.value).toEqual(0.5)
    })
  })

  describe('Oscillator', () => {

    it('can create a sine OscillatorNode', () => {
      let node = P.Osc(666)
      expect(node).toEqual(jasmine.any(OscillatorNode))
      expect(node.type).toEqual('sine')
      expect(node.frequency.value).toEqual(666)
    })

    it('can create a sawtooth OscillatorNode', () => {
      let node = P.Saw(666)
      expect(node).toEqual(jasmine.any(OscillatorNode))
      expect(node.type).toEqual('sawtooth')
      expect(node.frequency.value).toEqual(666)
    })

    it('can set the frequencyCv param', () => {
      let node = P.Osc({ frequencyCv: 0.5 })
      expect(node.frequencyCv.value).toEqual(0.5)
    })
  })

  it('can create an AudioBufferSourceNode', () => {
    let buffer = P.context.createBuffer(1, 22050, 22050)
    let node = P.Sample(buffer)
    expect(node).toEqual(jasmine.any(AudioBufferSourceNode))
    expect(node.buffer).toEqual(buffer)
  })

  it('can create a WaveShaperNode', () => {
    let curve = Float32Array.from([0, 0, 0])
    let node = P.Shaper(curve)
    expect(node).toEqual(jasmine.any(WaveShaperNode))
    expect(node.curve).toEqual(curve)
  })
})
