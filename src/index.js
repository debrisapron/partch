import { assignDeep } from "./utils.js"
import * as webAudioNodes from "./webAudioNodes/index.js"
import { Patch } from "./Patch.js"
import { Auto } from "./Auto.js"
import { Block } from "./Block.js"
import { Note } from "./Note.js"
import { Seq } from "./Seq.js"

function getDefaults(options) {
  const defaults = assignDeep(
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
  Object.entries({ ...webAudioNodes, Auto, Block, Note, Seq }).map(
    ([name, fn]) => {
      P[name] = withDefaults(fn)
    }
  )

  return P
}
