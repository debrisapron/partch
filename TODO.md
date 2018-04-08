Next

- Switch from Jasmine to Mocha
- Get rid of out node on patch - connect can just patch all output nodes to destination
- If only one node connected from patch input, make that the input node
- Don't add stop and start to patches that don't need them
- Pass params to synth voices
- More recipes
  - Drum machine
  - Organ

Then

- More tests
- Refactor to avoid double-wrapping in partchifyNode
- Investigate dead air from 3 osc synth
- Accept note names e.g. C#4
- Proper webpack server setup
- Offset node
- Simple functions in connection strings: * / + -

Then

- Ability to assign sources directly to audio params e.g. P.Osc({ frequencyCv: P.Osc(20) })
- Error messages
- Profiling
- Persistent nodes for synth voices (e.g. shared LFOs)
- Expose synth voice audioParams (use a proxy?)
- Different keepAlive settings: 0 (default), n (seconds), smart (looks for delay nodes, uses analyzer to wait for silence)
- More recipes
- More tests
- Write more in-depth guide
- playbackRateCv
- Param aliases
- Tuning base & tuning function, on library setup & per call
- More nodes:
  - FmSample using waveshaper as sample storage
  - Moog filter
  - Dynamics
  - Pulse osc with pw https://github.com/pendragon-andyh/WebAudio-PulseOscillator
  - TriSaw osc with shape
  - Supersaw osc https://noisehack.com/how-to-build-supersaw-synth-web-audio-api/
  - Granular sample node
  - FFT sample node!?!?!?
  - Bitcrusher (from Tuna)
  - Freeverb
  - Panner (from WAA, need to understand how it works first :/)
  - Pitch shift
  - Amp follower
  - Pitch follower!?!?!?
