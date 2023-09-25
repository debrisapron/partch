import { expect, describe, test, beforeAll } from "bun:test"
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
  const P = partch()
  globalThis.P = P
})
