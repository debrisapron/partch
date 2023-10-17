import * as nodeWebAudioApi from "node-web-audio-api"
export * from "./src/index.js"

// Install Web Audio API globally
// TODO: Put inside a namespace to be safer, e.g. __WebAudio__
Object.assign(globalThis, nodeWebAudioApi)
