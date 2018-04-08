import Patch from './Patch'
import { stopAllNodes, loadAudioFile } from './helpers'
import Adsr from './Adsr'
import * as multiNodes from './multiNodes'
import * as nativeNodes from './nativeNodes'
import * as noiseNodes from './noiseNodes'
import Over from './Over'
import Synth from './Synth'
import * as thirdPartyNodes from './thirdPartyNodes'

function getDefaultAudioContext() {
  return window.__partchAudioContext ||
    (window.__partchAudioContext = new window.AudioContext())
}

function Partch(context = getDefaultAudioContext()) {
  let _Patch = Patch.bind(null, context)
  _Patch.context = context
  _Patch.panic = stopAllNodes
  _Patch.load = (url) => loadAudioFile(context, url)
  ;[Adsr, Over, Synth]
    .concat(Object.values(multiNodes))
    .concat(Object.values(nativeNodes))
    .concat(Object.values(noiseNodes))
    .concat(Object.values(thirdPartyNodes))
    .forEach((f) => _Patch[f.name] = f.bind(null, context))
  return _Patch
}

export default Partch
