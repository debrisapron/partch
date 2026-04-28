import { assignDeep } from "./utils.js"
import * as webAudioNodes from "./webAudio/index.js"
import * as extendedNodes from "./extended/index.js"
import { Patch } from "./Patch.js"
import { Auto } from "./Auto.js"
import { Seq } from "./playback/Seq.js"

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
  Object.entries({ ...webAudioNodes, ...extendedNodes, Auto, Seq }).map(
    ([name, fn]) => {
      P[name] = withDefaults(fn)
    }
  )

  return P
}
