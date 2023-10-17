import { partch } from "./native.js"
import * as utils from "./src/utils.js"

const P = partch({
  timebase: {
    bpm: 80,
  },
})

const Moog = (_props) =>
  P({
    _props,
    osc1: P.Saw(f),
    osc2: P.Saw(f * 1.01),
    osc3: P.Sqr(f / 2),
    // filter: P.Lpf(1000),
    filter: P.Lpf(60),
    filterFb: P.Gain(0.5),
    fbDel: P.Delay(0),
    filterEnv: P.Auto({ att: "0.7/0.1 0.3/0.2", rel: "0/1" }),
    amp: P.Gain(0),
    ampEnv: P.Auto({ att: "1/0.01", rel: "0/1.5" }),
    __: [
      "osc1 > filter",
      "osc2 > filter",
      "osc3 > filter",
      "filter > amp > out",
      "filter > filterFb > fbDel > filter",
      "filterEnv > filter.frequencyCv",
      "ampEnv > amp.gainCv",
    ],
  })

const THEME = `
  1/4 A E F# D > D < A B G
  1/8 E > C 1/4 < A F
  1/8 D Bb 1/4 G Eb
  1/8 G# E A F`

let oct = 0
let len = 1 / 4
const blocks = THEME.split(/\s/)
  .map((s) => {
    s = s.trim()
    if (!s) return
    if (utils.isNumeric(s)) {
      const [a, b] = s.split("/")
      len = parseInt(a) / parseInt(b)
    } else if (s === ">") {
      oct++
    } else if (s === "<") {
      oct--
    } else {
      return { _pitch: `${s}${oct}`, _notes: len }
    }
  })
  .filter((x) => x)

console.log(blocks.map((b) => b.pitch))
P.Seq(blocks.map((b) => Moog(b)))

// P({
//   m1: Moog(440),
//   m2: Moog(523),
//   m3: Moog(659),
//   __: ["m1 > out", "m2 > out", "m3 > out"],
// }).test()

// const block = (transposition, ...offsets) =>
//     ...offsets.map((offset, i) => {
//       let isOdd = i % 2;
//       let transOffset = i * -6;
//       if (isOdd) transOffset = transOffset - 1;
//       let trans = firstTrans + transOffset + 3;
//       return um.offset(offset, um.tran(trans, THEME));
//     })

// P.Seq([
//     block( 0, 0),
//     block( 1, 0),
//     block( 2, 0, 1/8),
//     block( 3, 0, 1/8),
//     block( 4, 0, 1/8, -1/8),
//     block( 5, 0, 1/8, -1/8),
//     block( 6, 0, 1/8, -1/8, 1/4),
//     block( 7, 0, 1/8, -1/8, 1/4),
//     block( 8, 0, 1/8, -1/8, 1/4, -1/4),
//     block( 9, 0, 1/8, -1/8, 1/4, -1/4),
//     block(10, 0, 1/8, -1/8, 1/4, -1/4, 3/8),
//     block(11, 0, 1/8, -1/8, 1/4, -1/4, 3/8),
//     block(12, 0),
//     block(13, 0, 1/16),
//     block(14, 0, 1/16, -1/16),
//     block(15, 0, 1/16, -1/16, 1/8),
//     block(16, 0, 1/16, -1/16, 1/8, -1/8),
//     block(17, 0, 1/16, -1/16, 1/8, -1/8, 3/16),
//     block(18, 0, 1/16, -1/16, 1/8, -1/8, 3/16, -3/16),
//     block(19, 0, 1/16, -1/16, 1/8, -1/8, 3/16, -3/16, 1/4),
//     block(20, 0, 1/16, -1/16, 1/8, -1/8, 3/16, -3/16, 1/4, -1/4),
//     block(21, 0, 1/16, -1/16, 1/8, -1/8, 3/16, -3/16, 1/4, -1/4, 5/16),
//     block(22, 0, 1/16, -1/16, 1/8, -1/8, 3/16, -3/16, 1/4, -1/4, 5/16, -5/16),
//     block(23, 0, 1/16, -1/16, 1/8, -1/8, 3/16, -3/16, 1/4, -1/4, 5/16, -5/16, 3/8),
// ]).test()
