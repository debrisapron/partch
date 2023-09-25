import { partch } from "../../src/index.js"
import { getBuggedWaaConstructors } from "./getBuggedWaaConstructors.js"

const BUGS = {
  AudioBufferSourceNode,
  BiquadFilterNode,
  ConstantSourceNode,
  DelayNode,
  GainNode,
  OscillatorNode,
  WaveShaperNode,
}

function _expect(thing) {
  return {
    toBe(value) {
      return chai.expect(thing).equal(value)
    },
    toEqual(value) {
      return chai.expect(thing).eql(value)
    },
  }
}

async function main() {
  mocha.setup("bdd")
  const buggedConstructors = getBuggedWaaConstructors(BUGS)
  Object.assign(globalThis, buggedConstructors, {
    P: partch(),
    expect: _expect,
    test: it,
  })

  const testPromises = "const delay filters gain oscs patch sample shaper"
    .split(" ")
    .map((t) => import(`../${t}.test.js`))
  await Promise.all(testPromises)

  mocha.run()
}

main()
