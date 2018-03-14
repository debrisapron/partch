import Patch from './Patch'
import { stopAllNodes, loadAudioFile } from './helpers'
import Adsr from './nodes/Adsr'
import * as nativeNodes from './nodes/nativeNodes'
import * as noiseNodes from './nodes/noiseNodes'
import Over from './nodes/Over'
import Synth from './nodes/Synth'

function getDefaultAudioContext() {
  return window.__partchAudioContext ||
    (window.__partchAudioContext = new window.AudioContext())
}

function Partch(context = getDefaultAudioContext()) {
  let _Patch = Patch.bind(null, context)
  _Patch.context = context
  _Patch.panic = stopAllNodes
  _Patch.load = (url) => loadAudioFile(context, url)
  Object.values(nativeNodes)
    .concat(Object.values(noiseNodes))
    .concat(Adsr, Over, Synth)
    .forEach((f) => _Patch[f.name] = f.bind(null, context))
  return _Patch
}

export default Partch
