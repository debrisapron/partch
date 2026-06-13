# Partch — CLAUDE.md

## Project overview

Partch is a lightweight Web Audio API patching library. It provides a terse syntax for creating native Web Audio API nodes with sane defaults, a `Patch` function for wiring nodes together via a declarative connection string syntax, and a small set of higher-level nodes that fill gaps in the native Web Audio API.

## Branch context

The current branch (`next`) is a ground-up rewrite of the library. The `master` branch on GitHub is the production version. Several features from master have not yet been reimplemented in `next`; see **Pending features** below. The README documents the intended end-state of the library (mostly) rather than the current state of `next`. Where they differ, trust the source code.

## Running tests

```
bun test
```

`bunfig.toml` configures bun to preload `test/__setup.js` before running tests. Tests use `node:test` and `node:assert/strict` (Node.js built-in test runner). There is no `test` entry in `package.json` scripts.

## Architecture

```
src/
  index.js        # partch() factory — wires everything together
  Patch.js        # P() function — creates patch nodes
  helpers.js      # setNodeProps, defineAudioParam, pitch utilities
  utils.js        # general-purpose utility functions
  nodes/          # individual node factory functions
    Vol.js        # perceptual volume node (Gain + Const + Exp at 5/3)
    Auto.js       # automation/envelope node (ConstantSourceNode with shape triggers)
    Exp.js        # WaveShaperNode power curve with configurable exponent
    Const.js, Delay.js, Filter.js, Gain.js, Osc.js, Sample.js, Shaper.js
    Apf.js, Bpf.js, HighShelf.js, Hpf.js, LowShelf.js, Lpf.js, Notch.js, Peak.js
    Saw.js, Sin.js, Sqr.js, Tri.js
```

All relative imports use explicit `.js` extensions (ES module requirement).

## API (next branch)

### Factory function

```js
import { partch } from "./src/index.js"
const P = partch({ context })   // context is optional; defaults to new AudioContext()
```

`P` is the Patch function with node factories attached as properties. `P.context` and `P.defaults` are also exposed.

### Creating a patch

```js
const patch = P({
  nodeA: P.Gain(0.5),
  nodeB: P.Lpf(800),
  __: ["in > nodeA > nodeB > out", "in.cv > nodeB.frequency"],
})
```

- All keys not starting with `_` are child nodes, stored on `patch.__nodes`.
- `__` is the wire string (or array of wire strings).
- Keys starting with `_` (except `__`) are props to apply to the patch itself via `setNodeProps`.

### Wire string syntax

`"src > dest"` — chained or single connections. Separating tokens with `>` forms a chain; all pairs are wired in sequence.

Special tokens:
- `in` — the patch itself as audio input (adds dest to `patch.__inputs`)
- `out` — marks src as a patch output (adds src to `patch.__outputs`)
- `in.name` — creates a named alias: `patch.name` → the resolved dest node/AudioParam
- Dot paths resolve child nodes or AudioParams: `nodeA.gain`, `nodeA.frequency`

`patch.connect(dest)` connects all `__outputs` to `dest`. `patch.numberOfInputs` / `patch.numberOfOutputs` are computed from `__inputs` / `__outputs`.

### Node factory pattern

Every node factory follows the same signature:

```js
function NodeName(defaults, config) { ... }
```

`partch()` pre-binds `defaults` so that `P.NodeName(config)` works. Config is usually either a shorthand scalar or a plain object:

```js
P.Gain(2)           // gain = 2
P.Gain({ gain: 2 }) // same
```

### setNodeProps

`setNodeProps(defaults, node, props)` is the core property-setting function:

- Keys not starting with `_`: set `AudioParam.value` or `node[key]` directly. If the key matches a child node name (`node.__nodes[key]`), recurse into it.
- `_pitch`: sets `node.detune.value` in cents (accepts MIDI note number or note string like `"C#4"`).
- `_props`: recurse to apply nested props.
- `_follow`: flag on Osc nodes; when true the node's detune follows the patch-level detune ConstantSourceNode (enables patch-level pitch control).

### Patch methods

- `patch.start(t)` — starts all child nodes that have a `start` method
- `patch.stop(t)` — stops all children, honouring `__release` flag for ordering (release nodes stop first, then the rest stop at the latest release end time)
- `patch.set(config)` — calls `setNodeProps` to update params
- `patch.monitor()` — connects to `context.destination`, returns patch
- `patch.test([dur])` — sends a test sawtooth through nodes with inputs, or starts/stops source nodes
- `patch.detune` — lazy AudioParam: a ConstantSourceNode whose output is connected to the detune of all child nodes that have `_follow: true`

## Pending features

These exist in master or the README but are not yet in `next`:

| Feature | Notes |
|---|---|
| `gainCv` AudioParam on `Gain` | |
| `frequencyCv` AudioParam on `Filter`/`Osc` | Skipped tests in `filters.test.js`, `oscs.test.js` |
| `Parallel` (array of nodes auto-wrapped) | Skipped test in `patch.test.js` |
| `octave` property on `Osc` | Stored on node but does not yet affect frequency |
| `Adsr` node | `Auto` is a lower-level primitive; `Adsr` will be built on top |
| `Synth` (polyphonic voice manager) | Not yet started |
| `Over` (overdrive) | Not yet started |
| `Noise` / `WhiteNoise` / `PinkNoise` / `BrownNoise` | Not yet started |
| `Freeverb` | Not yet started |
| `P.load(url)` | Audio buffer loader, not yet implemented |
| `triggerAttack` / `triggerRelease` | Referenced in README, not yet on Patch |

## Implementation notes

- **WaveShaperNode caveat**: In `node-web-audio-api`, assigning the `curve` property twice throws `InvalidStateError - cannot assign curve twice`. This is noted in `Shaper.js` with a TODO to check if it also happens in browsers.
- **Auto node shape format**: Trigger shapes are space-separated segments of `value/duration` (e.g. `"0/0 1/0.01 0.8/0.1"`). A duration of 0 means an instant step; two consecutive instant steps are spaced one tick apart.
- **Exp node**: `P.Exp(exponent)` creates a WaveShaperNode applying `cv^exponent` to a 0-1 input. Default exponent is 1 (linear). `Amp` uses `Exp(5/3)` for Stevens' power law perceptual loudness scaling (cv=0.5 → ~0.316 gain / -10 dB ≈ half as loud).- **Test setup monkey-patching**: `test/__setup.js` subclasses all `*Node` constructors from `node-web-audio-api` to record `__connections` arrays, enabling connection-graph assertions in tests.

## Code style

Prettier is configured (`.prettierrc`): 2-space indent, no semicolons, double quotes, ES5 trailing commas.
