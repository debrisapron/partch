import { assignDeepInPlace } from "./utils.js"
import { Patch } from "./Patch.js"

//// Nodes ////

import { Vol } from "./nodes/Vol.js"
import { Apf } from "./nodes/Apf.js"
import { Auto } from "./nodes/Auto.js"
import { Bpf } from "./nodes/Bpf.js"
import { Const } from "./nodes/Const.js"
import { Delay } from "./nodes/Delay.js"
import { Exp } from "./nodes/Exp.js"
import { Filter } from "./nodes/Filter.js"
import { Gain } from "./nodes/Gain.js"
import { HighShelf } from "./nodes/HighShelf.js"
import { Hpf } from "./nodes/Hpf.js"
import { LowShelf } from "./nodes/LowShelf.js"
import { Lpf } from "./nodes/Lpf.js"
import { Notch } from "./nodes/Notch.js"
import { Osc } from "./nodes/Osc.js"
import { Peak } from "./nodes/Peak.js"
import { Sample } from "./nodes/Sample.js"
import { Saw } from "./nodes/Saw.js"
import { Shaper } from "./nodes/Shaper.js"
import { Sin } from "./nodes/Sin.js"
import { Sqr } from "./nodes/Sqr.js"
import { Tri } from "./nodes/Tri.js"

const nodeFns = {
  Vol,
  Apf,
  Auto,
  Bpf,
  Const,
  Delay,
  Exp,
  Filter,
  Gain,
  HighShelf,
  Hpf,
  LowShelf,
  Lpf,
  Notch,
  Osc,
  Peak,
  Sample,
  Saw,
  Shaper,
  Sin,
  Sqr,
  Tri,
}

function getDefaults(options) {
  const defaults = assignDeepInPlace(
    {
      timebase: {
        bpm: 120,
        sig: [4, 4],
        grid: 16,
      },
      // TODO default octave, tuning
    },
    options
  )
  defaults.context ??= new AudioContext()
  return defaults
}

export function partch(options = {}) {
  const defaults = getDefaults(options)

  const withDefaults = (fn) => (config) => fn(defaults, config)

  const P = withDefaults(Patch)
  P.defaults = defaults
  P.context = defaults.context
  Object.entries(nodeFns).map(([name, fn]) => {
    P[name] = withDefaults(fn)
  })

  return P
}
