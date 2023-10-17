import { expect, describe, test, beforeAll, beforeEach } from "bun:test"
import * as nodeWebAudioApi from "node-web-audio-api"
import { getBuggedWaaConstructors } from "./getBuggedWaaConstructors.js"

beforeAll(async () => {
  const buggedConstructors = getBuggedWaaConstructors(nodeWebAudioApi)
  Object.assign(globalThis, nodeWebAudioApi, buggedConstructors, {
    describe,
    expect,
    test,
  })
  const { partch } = await import("../../src/index.js")
  globalThis.partch = partch
  globalThis.offlineRender = async () => {
    globalThis.__buffer = await globalThis.P.context.startRendering()
    return globalThis.__buffer
  }
  globalThis.sampsNear = (t) => {
    const sampStart = t * 44100 - 10
    return (
      globalThis.__buffer
        .getChannelData(0)
        .slice(sampStart, sampStart + 20)
        .reduce((a, b) => a + b) / 20
    )
  }
})

beforeEach(() => {
  const context = new nodeWebAudioApi.OfflineAudioContext({
    numberOfChannels: 1,
    length: 44100,
    sampleRate: 44100,
  })
  globalThis.P = partch({ context })
})
