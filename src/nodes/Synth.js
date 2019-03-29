import Sequencer from "um-sequencer";
import { isPlainObject, partchifyNode } from "../helpers";
import { Gain } from "./nativeNodes";

function twelveTet(nn, ref = 440) {
  return nn && Math.pow(2, (nn - 69) / 12) * ref;
}

function Synth(context, Voice) {
  let synthOut = Gain(context);
  let sequencers = [];

  synthOut.play = config => {
    if (!isPlainObject(config)) {
      config = { nn: config || 69 };
    }
    let nn = config.nn || 69;
    let time = config.time || config.t || context.currentTime;
    let dur = config.dur || 0.2;
    let frequency = twelveTet(nn);
    let voiceData = {
      ...config,
      nn,
      time,
      dur,
      frequency
    };
    let voice = Voice(voiceData);
    voice.connect(synthOut);
    voice.triggerAttack(time);
    if (dur) {
      voice.triggerRelease(time + dur);
    }
    return voice;
  };

  synthOut.sequence = (events, options) => {
    // Convert Partch events to um-sequencer events.
    events = events.map(ev => {
      return {
        time: ev.time || ev.t,
        callback: t => synthOut.play({ ...ev, time: t })
      };
    });
    let sequencer = Sequencer(() => context.currentTime);
    sequencer.play(events, options);
    sequencers.push(sequencer);
    return sequencer;
  };

  synthOut.test = (dur, nn) => {
    synthOut.monitor().play({ dur, nn });
  };

  synthOut.stop = () => {
    sequencers.forEach(s => s.stop());
    sequencers = [];
  };

  // Partchify it again as it now has a stop method
  partchifyNode(synthOut);

  return synthOut;
}

export default Synth;
