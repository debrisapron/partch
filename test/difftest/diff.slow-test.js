import test from "node:test"
// import * as assert from "node:assert/strict"

test("basic delay", async () => {
  // const context = new nodeWebAudioApi.OfflineAudioContext({
  //   numberOfChannels: 1,
  //   length: 44100,
  //   sampleRate: 44100,
  // })
  // const patch = P(
  //   {
  //     dry: P.Gain(1),
  //     wet: P.Gain(0.5),
  //     delay: P.Delay(0.5),
  //     feedback: P.Gain(0.5),
  //   },
  //   "in > dry > out",
  //   "in > delay > wet > out",
  //   "delay > feedback > delay"
  // )
  // patch.test()
  // console.log(patch)

  P({
    osc: P.Sin(),
    __: "osc > out",
  }).test()

  // const osc = new nodeWebAudioApi.OscillatorNode(context)
  // osc.connect(context.destination)
  // osc.start()

  await new Promise((resolve) => setTimeout(resolve, 4000))
})
