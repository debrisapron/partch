import { expect, describe, test, beforeAll } from "bun:test"
import * as nodeWebAudioApi from "node-web-audio-api"

function buggedSubclassOf(className) {
  // NOTE This stupid dance is to make sure the subclass
  // has the same name property as the superclass
  const o = {
    [className]: class extends nodeWebAudioApi[className] {
      __connections = []
      connect(destination, outputIndex = 0, inputIndex = 0) {
        this.__connections.push({ destination, outputIndex, inputIndex })
        return super.connect(destination, outputIndex, inputIndex)
      }
    },
  }
  return o[className]
}

function getBuggedWebAudioApi() {
  const buggedConstructors = {}
  Object.keys(nodeWebAudioApi).forEach((name) => {
    if (name.endsWith("Node")) {
      buggedConstructors[name] = buggedSubclassOf(name)
    }
  })
  return { ...nodeWebAudioApi, ...buggedConstructors }
}

beforeAll(async () => {
  const buggedWebAudioApi = getBuggedWebAudioApi()
  Object.assign(globalThis, buggedWebAudioApi, { describe, expect, test })
  const { partch } = await import("../src/index.js")
  const P = partch()
  globalThis.P = P
})
