import { partch } from "../../src/index.js"

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
  Object.assign(globalThis, {
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
