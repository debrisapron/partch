# Partch

<a href="https://en.wikipedia.org/wiki/Harry_Partch">
  <img alt="Image of Harry Partch with his instruments" src="https://32minutes.files.wordpress.com/2016/10/partch.jpeg" width="500" />
</a>

A lightweight Web Audio API patching library.

Please note: this is UNDER CONSTRUCTION & should not be considered stable.

## Example

First

```js
let P = Partch()
```

then

```js
P.Synth((freq) => P({
  saw: P.Saw(freq),
  sqr: P.Sqr(freq / 3.99),
  vcf: P.Lpf(20),
  vca: P.Gain(0),
  env: P.Adsr({ a: 0.01, d: 0.1, s: 0.6, r: 1 })
},
  'saw > vcf > vca > out',
  'sqr > vcf',
  'env > vcf.frequencyCv',
  'env > vca.gainCv'
)).monitor().sequence([
  { t: 0/8, nn: 69 },
  { t: 1/8, nn: 72 },
  { t: 2/8, nn: 76 },
  { t: 3/8, nn: 81 },
  { t: 4/8, nn: 76 },
  { t: 5/8, nn: 72 }
], { loopLength: 6/8, tempo: 190 })
```

## Introduction

Partch is a library designed to simplify the creation of new instruments and FX with the Web Audio API. It has a number of elements which all work together for a pleasurable patching experience.

- A terse syntax for creating native Web Audio API nodes, with sane defaults.
- A handful of additional nodes that fill in notable gaps in the Web Audio API.
- Useful additions and tweaks to the API of created nodes.
- A Patch function for wiring nodes together into patches.
- A Synth function for creating polyphonic synthesizers from individual voice functions.

## Installation

First `yarn add partch` or `npm install partch --save`.

Then, if you're using a bundler such as webpack, simply `import Partch from 'partch'`.

Alternatively load it directly in the browser with the script tag `<script src="path/to/partch.js"></script>`.

## API

### Partch([context])

- `context` - _AudioContext_ - Defaults to a new AudioContext.

Returns a Patch function (henceforth abbreviated as `P`) with a number of attached Node Factory functions. Note that the nodes returned by all these node factories are patched to provide an API which slightly extends the standard functionality of Web Audio API nodes, this Node API is described after the node factories.

### P(nodes, [...connections])

- `nodes` - _Object_ - An object where the keys are node names and the values are audio nodes.
- `connections` - _Array of String_ - Strings representing connections between nodes.

Returns a patch node which implements the standard Node API plus a `nodes` attribute which is simply the passed in `node` argument.

#### Connection Strings

Connection strings take the form of a list of nodes separated by a `>` character. Each node may be either a node name specified in the `nodes` object, or a dot-separated node path, e.g. `synth.filter.frequencyCv`. When using a node path, any onward connections after the node will be from the __top-level__ node, i.e. the node whose name comes first in the path.

### P.Adsr([config])

- `config` - _Object | Number_ - Either the release time or the following config object:
  - `attack` _or_ `a` - _Number_ - The attack time in seconds. Defaults to 0.01.
  - `decay` _or_ `d` - _Number_ - The decay time in seconds. Defaults to 0.
  - `sustain` _or_ `s` - _Number_ - The sustain level. Defaults to 1.
  - `release` _or_ `r` - _Number_ - The release time in seconds. Defaults to 1.
  - `level` - _Number_ - The envelope maximum value (i.e. sustain is multiplied by this). Defaults to 1.

Returns an ASDR envelope node which can be used to control parameters of other nodes. Note that the rise and fall slopes are linear, so if you want exponential slopes, e.g. for controlling filter cutoff, you should connect the signal to one of the provided CV inputs.

### P.Const([config])

- `config` - _Object | Number_ - Either the offset or the following config object:
  - `offset` - _Number_ - The constant output level. Defaults to 1.

Returns a Web Audio API [ConstantSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/ConstantSourceNode).

### P.context

The AudioContext with which the Patch function was instantiated.

### P.Delay([config])

- `config` - _Object | Number_ - Either the delay time or the following config object:
  - `delayTime` - _Number_ - The delay time in seconds. Defaults to 1.

Returns a Web Audio API [DelayNode](https://developer.mozilla.org/en-US/docs/Web/API/DelayNode).

### P.Filter([config])

- `config` - _Object | Number_ - Either the frequency or the following config object:
  - `frequency` - _Number_ - The filter frequency in Hz. Defaults to 350.
  - `frequencyCv` - _Number_ The scaled amount to add to the frequency. Defaults to 0.
  - `Q` - _Number_ - The [Q](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/Q) factor. Roughly equivalent to resonance. Defaults to 1.
  - `detune` - _Number_ - The offset to add to the frequency, in cents. Defaults to 0.
  - `type` - _String_ - The filter [type](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type). One of `lowpass`, `highpass`, `bandpass`, `lowshelf`, `highshelf`, `peaking`, `notch` or `allpass`. Defaults to lowpass.

Returns a Web Audio API [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode). The node has an additional AudioParam, `frequencyCv`, which is scaled to make a 0-1 input signal cover the whole audible frequency range.

#### P.Apf([config])
#### P.Bpf([config])
#### P.HighShelf([config])
#### P.Hpf([config])
#### P.LowShelf([config])
#### P.Lpf([config])
#### P.Notch([config])
#### P.Peak([config])

Aliases for the Filter node with different filter types.

### P.Freeverb([config])

- `config` - _Object | Number_ - Either the wet level or the following config object:
  - `wet` - _Number_ - The wet signal gain. Defaults to 0.
  - `dry` - _Number_ - The dry signal gain. Defaults to 1.
  - `roomSize` - _Number_ - A number from 0-1 representing the size of the reverb space. Defaults to 0.8.
  - `dampening` - _Number_ - A frequency in Hz which corresponds to the amount of "ringing". Defaults to 3000.

Returns a reverb node based on the Freeverb algorithm (imported from https://github.com/mmckegg/freeverb).

### P.Gain([config])

- `config` - _Object | Number_ - Either the gain or the following config object:
  - `gain` - _Number_ - The amount of gain. Defaults to 1.
  - `gainCv` - _Number_ The scaled amount to add to the gain. Defaults to 0.

Returns a Web Audio API [GainNode](https://developer.mozilla.org/en-US/docs/Web/API/GainNode). The node has an additional AudioParam, `gainCv`, which is scaled to produce an exponential volume curve that sounds more natural to the human ear than the linear slope produced by automating the gain level. Specifically, a `gainCv` of 0.5 maps to an additional gain of 0.1.

### P.load(url)

- `url` - _String_ - Url to load.

A helper function to load an audio buffer from a URL. Returns a promise which will either resolve to an `AudioBuffer`, or throw an error.

### P.Noise([config])

- `config` - _Object | String_ - Either the noise color or the following config object:
  - `color` - _String_ - The type of noise. One of `brown`, `pink` or `white`. Defaults to `white`.

Returns a Sample node that plays the specified type of noise.

#### P.BrownNoise()
#### P.PinkNoise()
#### P.WhiteNoise()

Aliases for the Noise node with different color settings.

### P.Osc([config])

- `config` - _Object | Number_ - Either the frequency or the following config object:
  - `frequency` - _Number_ - The oscillator frequency in Hz. Defaults to 440.
  - `frequencyCv` - _Number_ The scaled amount to add to the frequency. Defaults to 0.
  - `detune` - _Number_ - The offset to add to the frequency, in cents. Defaults to 0.
  - `type` - _String_ - The oscillator waveform. One of `sine`, `square`, `sawtooth` or `triangle`. Defaults to `sine`.

Returns a Web Audio API [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode). The node has an additional AudioParam, `frequencyCv`, which is scaled to make a 0-1 input signal cover the whole audible frequency range.

#### P.Saw([config])
#### P.Sin([config])
#### P.Sqr([config])
#### P.Tri([config])

Aliases for the Osc node with different waveform types.

### P.Over([config])

- `config` - _Number_ - Either the drive amount or the following config object:
  - `drive` - _Number_ - Gain applied before waveshaping. Defaults to 1.
  - `shape` - _Number_ - Number from 0-1 representing the how much the waveshape distorts the signal. Defaults to 0.725.
  - `algo` - _Number_ - Number from 0-5 specifying which shaping algorithm to use. Default is 0.
  - `makeup` - _Number_ - Gain applied after waveshaping. Defaults to 1.

Returns a custom Overdrive node adapted from [Tuna.js](https://github.com/Theodeus/tuna/wiki).

### P.Sample([config])

- `config` - _Object | AudioBuffer_ - Either the buffer or the following config object:
  - `buffer` - _AudioBuffer_ - The [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) to play.
  - `detune` - _Number_ - The factor to adjust the frequency, in cents. Defaults to 0.
  - `loop` - _Boolean_ - Whether or not to loop the sample. Defaults to false.
  - `loopStart` - _Number_ - Start of the loop in seconds. Defaults to 0.
  - `loopEnd` - _Number_ - End of the loop in seconds. Defaults to 0.
  - `playbackRate` - _Number_ - The rate at which to play the sample where 1 is its natural rate. Defaults to 1.

Returns a Web Audio API [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode). ~~The node has an additional AudioParam, `playbackRateCv`, which is scaled to make a 0-1 input signal cover the whole audible frequency range~~.

### P.Shaper([config])

- `config` - _Object | Float32Array_ - Either the curve or the following config object:
  - `curve` - _Float32Array_ - The shaping [curve](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode/curve).
  - `oversample` - _String_ - The [oversample](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode/oversample) setting. One of `none`, `2x` or `4x`.

Returns a Web Audio API [WaveShaperNode](https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode).

### P.Synth(Voice)

- `Voice` - _Function_ - A factory function which will construct the synth voice. Should take one parameter, the frequency in Hz of the note to be played.

Returns a node which can create new voices with the passed-in factory function and connect them to its output. In addition to the standard node methods it implements the `play` and `sequence` method.

#### synth.play(options)
- `options` - _Object_
  - `nn` - _Number_ - The MIDI note number to play. Defaults to 69 (middle A).
  - `time` _or_ `t` - _Number_ - The AudioContext time at which to play the note. Defaults to immediately.
  - `dur` - _Number_ - The length of time in seconds to play the note for. If falsey, note will not be released. Defaults to 0.2.

Calls the voice function with the passed in MIDI note number converted to a frequency. Returns the new voice node.

#### synth.sequence(events, [options])

- `events` - _Array_ - An array of sequencer event objects.
- `options` - _Object_
  - `loopLength` - _Number_ - The time at which to loop the sequence, in Whole Notes.
  - `tempo` - _Number_ - The tempo in bpm. Defaults to 120.

This is a simple wrapper around the functionality of [um-sequencer](https://github.com/debrisapron/um-sequencer). Each sequencer event object can contain the same keys as the `synth.play` options object, but here the `time` attribute is the _musical_ time in Whole Notes from the start of the sequence. If looping is required, the loopLength option must be set.

Returns a sequencer object with `stop` and `changeTempo(tempo)` methods (see the um-sequencer docs for more information).

### Node API

On top of the standard Web Audio API [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) interface, Partch makes some enhancements. Firstly, it patches `connect` and `disconnect` so that they can handle nodes which have an `input` property. Secondly, it adds the following members:

#### node.input

On a native Web Audio API this is just an alias for the node itself. On a patch node this is an alias for `patch.nodes.in`. When connecting from a native Web Audio API node to a patch, this should be the connection destination.

#### node.monitor()

Connects the patch to the `context.destination`. Returns the node.

#### node.test([dur], [type])

- `dur` - _Number_ - The duration of the test in seconds. Defaults to 0.2.
- `type` - _String | Number_ - The type of test sound to use or the note to play. If the former, one of `bleep` or `noise`. Defaults to `bleep`.

This is a function for quickly testing a node. Firstly it monitors the node. Then, for nodes without an input, it will simply stop it after the given duration. For nodes with a `play` method it will play for the given duration, with the type param specifying the note. For nodes with an input, it will create a sound source of the type indicated, stop the source after the given duration, and stop the node 10 seconds after.

#### node.triggerAttack([time])

- `time` - _Number_ - The AudioContext time at which to trigger attack. Defaults to immediately.

If the node is an envelope, or a patch containing an envelope, triggers the attack portion of the envelope(s) at `time`. Returns the node.

#### node.triggerRelease([time])

- `time` - _Number_ - The AudioContext time at which to trigger release. Defaults to immediately.

If the node is an envelope, or a patch containing an envelope, triggers the release portion of the envelope(s) at `time` and then stops the node. Returns the node.

## Cookbook

The philosophy of Partch is to give you a small number of fundamental building blocks while making it as easy as possible to build your own high-level abstractions from those blocks. In that spirit, components such as phasers, chorus effects, analogue-style delays, autopanners and so on are not included. Instead, here are some example patches for you to copy and paste, in the hope that you will modify them to your own taste, creating effects and instruments that are entirely unique to you.

### Simple delay

```js
P({
  dry: P.Gain(1),
  wet: P.Gain(0.5),
  delay: P.Delay(0.5),
  feedback: P.Gain(0.5)
},
  'in > dry > out',
  'in > delay > wet > out',
  'delay > feedback > delay'
).test()
```

### Tape-style delay

```js
P({
  dry: P.Gain(1),
  wet: P.Gain(0.5),
  delay: P.Delay(0.5),
  feedback: P.Gain(0.4),
  od: P.Over({ drive: 0.5, shape: 0.7, makeup: 0.7 }),
  highCut: P.Lpf(6000),
  lowCut: P.Hpf(60),
  wow: P.Sin(0.1),
  wowLevel: P.Gain(0.005),
  flutter: P.Sin(5.3),
  flutterLevel: P.Gain(0.00015)
},
  'in > dry > out',
  'in > od > highCut > lowCut > delay > wet > out',
  'delay > feedback > od',
  'wow > wowLevel > delay.delayTime',
  'flutter > flutterLevel > delay.delayTime'
).test()
```

### Flanger
```js
P({
  dry: P.Gain(1),
  wet: P.Gain(1),
  dryDelay: P.Delay(0.02),
  wetDelay: P.Delay(0.02),
  depth: P.Gain(0.02),
  feedback: P.Gain(-0.5),
  lfo: P.Sin(0.1)
},
  'in > dryDelay > dry > out',
  'in > wetDelay > wet > out',
  'wetDelay > feedback > wetDelay',
  'lfo > depth > wetDelay.delayTime'
).test(5, 'noise')
```

### Drumbeat
```js
let [kick, snare] = await Promise.all([
  P.load('assets/audio/kick.wav'),
  P.load('assets/audio/snare.wav')
])
// This is just an example! Do not use JS clocks for music!
// Google "A Tale Of Two Clocks" to learn about sequencing with the Web Audio API.
let i1 = setInterval(() => P.Sample(kick).monitor(), 500)
let i2 = setInterval(() => P.Sample(snare).monitor(), 1000)
setTimeout(() => {
  clearInterval(i1)
  clearInterval(i2)
}, 4010)
```
