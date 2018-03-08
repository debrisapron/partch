# Partch

A lightweight Web Audio API patching library.

## Installation

`yarn add partch` or `npm install partch --save`

## Example

```
import Partch from 'partch'
let P = Partch()

P.Synth((frequency) => P({
  osc: P.Osc({ frequency, type: 'sawtooth' }),
  vcf: P.Filter(20),
  vca: P.Gain(0),
  env: P.Adsr({ attack: 0.01, decay: 0.1, sustain: 0.6, release: 5 })
},
  'osc > vcf > vca > out',
  'env > vcf.frequencyCv',
  'env > vca.gainCv'
)).monitor().play(60).releaseAfter(0.5)
```

## API

### Partch([audioContext])

- `audioContext` - _AudioContext_ - Defaults to a new AudioContext.

Returns a Patch function with a number of attached Node Factory functions.

### Patch(nodes, [...connections])

- `nodes` - _Object_ - An object where the keys are node names and the values are audio nodes.
- `connections` - _Array of String_ - Strings representing connections between nodes.

Connection strings take the form of a list of nodes separated by a `>` character. Each node may be either a node name specified in the `nodes` object, or a dot-separated node path, e.g. `synth.filter.frequencyCv`. When using a node path, any onward connections after the node will be from the __top-level__ node, i.e. the node whose name comes first in the path.

Returns a patch object with the following members:

#### patch.connect(destination)

- `destination` - _AudioDestinationNode | AudioParam_ - The destination to connect to.

Works exactly like the [AudioNode connect method](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect). Returns the destination.

#### patch.input

An alias for `patch.nodes.in`. When connecting from a native Web Audio API node to a patch, this should be the connection destination.

#### patch.monitor()

Connects the patch to the `audioContext.destination`. Returns the patch.

#### patch.nodes

The nodes object used to instantiate the patch, plus the `in` and `out` nodes (if present).

#### patch.release([time])

- `time` - _Integer_ - The audioContext time at which to release. Defaults to immediately.

Triggers the release portion of any envelopes in the patch at `time`, then stops the patch. Returns the patch.

#### patch.releaseAfter(interval)

- `interval` - _Integer_ - The time from now at which to release.

Waits `interval` seconds from now, then calls `release` above. Returns the patch.

#### patch.start([time])

- `time` - _Integer_ - The audioContext time at which to start. Defaults to immediately.

Starts any nodes in the patch which have a `start` method at `time` (this will also trigger the attack portion of any envelopes). Returns the patch.

#### patch.stop([time])

- `time` - _Integer_ - The audioContext time at which to stop. Defaults to immediately.

Stops any nodes in the patch which have a `stop` method at `time` (this will cut off sound immediately without triggering the release portion of any envelopes). Returns the patch.

#### patch.stopAfter(interval)

- `interval` - _Integer_ - The time from now at which to stop.

Waits `interval` seconds from now, then calls `stop` above. Returns the patch.

### TODO Rest of node factories here...
