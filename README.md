# Partch

A lightweight Web Audio API patching library.

## Installation

`yarn add partch` or `npm install partch --save`

## Example

First

```js
import Partch from 'partch'
let P = Partch()
```

then

```js
P.Synth((frequency) => P({
  osc: P.Osc({ frequency, type: 'sawtooth' }),
  vcf: P.Filter(20),
  vca: P.Gain(0),
  env: P.Adsr({ attack: 0.01, decay: 0.1, sustain: 0.6, release: 1 })
},
  'osc > vcf > vca > out',
  'env > vcf.frequencyCv',
  'env > vca.gainCv'
)).monitor().play(60).releaseAfter(0.5)
```

## Guide

TODO.

## API

### Partch([audioContext])

- `audioContext` - _AudioContext_ - Defaults to a new AudioContext.

Returns a Patch function (henceforth abbreviated as `P`) with a number of attached Node Factory functions.

### P(nodes, [...connections])

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

### P.Adsr([config])

TODO.

### P.audioContext

TODO.

### P.Const([config])

TODO.

### P.Delay([config])

TODO.

### P.Filter([config])

TODO.

### P.Gain([config])

TODO.

### P.Osc([config])

TODO.

### P.Shaper([config])

TODO.

### P.Synth(Voice)

TODO.

## Cookbook

The philosophy of Partch is to give you a small number of fundamental building blocks while making it as easy as possible to build your own high-level abstractions from those blocks. In that spirit, components such as phasers, chorus effects, analogue-style delays, autopanners and so on are not included. Instead, here are some example patches for you to copy and paste, in the hope that you will modify them to your own taste, creating effects and instruments that are entirely unique to you.

### Simple delay

```js
P({
  dry: P.Gain(),
  wet: P.Gain(0.5),
  delay: P.Delay(0.5),
  feedback: P.Gain(0.5)
},
  'in > dry > out',
  'in > delay > wet > out',
  'delay > feedback > delay'
).test()
```

### Analogue-style delay

```js
P({
  dry: P.Gain(),
  wet: P.Gain(0.5),
  delay: P.Delay(0.5),
  feedback: P.Gain(0.5),
  highCut: P.Filter(5000),
  lowCut: P.Filter({ type: 'highpass', frequency: 80 }),
  wow: P.Osc(0.1),
  wowLevel: P.Gain(0.002),
  flutter: P.Osc(5.3),
  flutterLevel: P.Gain(0.0001)
},
  'in > dry > out',
  'in > highCut > lowCut > delay > wet > out',
  'delay > feedback > highCut',
  'wow > wowLevel > delay.delayTime',
  'flutter > flutterLevel > delay.delayTime'
).test()
```

### Flanger
```js
P({
  dry: P.Gain(),
  wet: P.Gain(),
  dryDelay: P.Delay(0.02),
  wetDelay: P.Delay(0.02),
  depth: P.Gain(0.02),
  feedback: P.Gain(0.5),
  lfo: P.Osc(0.1)
},
  'in > dryDelay > dry > out',
  'in > wetDelay > wet > out',
  'wetDelay > feedback > wetDelay',
  'lfo > depth > wetDelay.delayTime'
).test(5, 'noise')
```
