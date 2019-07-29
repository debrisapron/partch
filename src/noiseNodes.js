import { Sample } from './nativeNodes'

let _brownNoiseBuffer
let _pinkNoiseBuffer
let _whiteNoiseBuffer

function getBrownNoiseBuffer(context) {
  // Adapted from https://github.com/mohayonao/brown-noise-node
  if (_brownNoiseBuffer) { return _brownNoiseBuffer }

  let noiseData = new Float32Array(context.sampleRate * 5)
  let lastOut = 0
  for (let i = 0, imax = noiseData.length; i < imax; i++) {
    let white = Math.random() * 2 - 1

    noiseData[i] = (lastOut + (0.02 * white)) / 1.02
    lastOut = noiseData[i]
    noiseData[i] *= 3.5 // (roughly) compensate for gain
  }

  let buffer = context.createBuffer(
    1, noiseData.length, context.sampleRate
  )
  buffer.getChannelData(0).set(noiseData)
  _brownNoiseBuffer = buffer
  return buffer
}

function getPinkNoiseBuffer(context) {
  // Adapted from https://github.com/mohayonao/pink-noise-node
  if (_pinkNoiseBuffer) { return _pinkNoiseBuffer }

  let noiseData = new Float32Array(context.sampleRate * 5)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0, imax = noiseData.length; i < imax; i++) {
    let white = Math.random() * 2 - 1

    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.96900 * b2 + white * 0.1538520
    b3 = 0.86650 * b3 + white * 0.3104856
    b4 = 0.55000 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.0168980

    noiseData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
    noiseData[i] *= 0.11
    b6 = white * 0.115926
  }

  let buffer = context.createBuffer(
    1, noiseData.length, context.sampleRate
  )
  buffer.getChannelData(0).set(noiseData)
  _pinkNoiseBuffer = buffer
  return buffer
}

function getWhiteNoiseBuffer(context) {
  // Adapted from http://noisehack.com/generate-noise-web-audio-api/
  if (_whiteNoiseBuffer) { return _whiteNoiseBuffer }
  let bufferSize = 2 * context.sampleRate
  let buffer = context.createBuffer(1, bufferSize, context.sampleRate)
  let output = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1
  }
  _whiteNoiseBuffer = buffer
  return buffer
}

function getNoiseBuffer(context, color = 'white') {
  switch (color) {
    case 'brown': return getBrownNoiseBuffer(context)
    case 'pink': return getPinkNoiseBuffer(context)
    default: return getWhiteNoiseBuffer(context)
  }
}

export function Noise(context, config = {}) {
  config = typeof config === 'string'
    ? { color: config }
    : { color: 'white', ...config }
  let color = delete config.color
  let buffer = getNoiseBuffer(context, color)
  return Sample(context, { ...config, buffer, loop: true })
}

export function BrownNoise(context, config) {
  return Noise(context, {...config, color: 'brown' })
}

export function PinkNoise(context, config) {
  return Noise(context, {...config, color: 'pink' })
}

export function WhiteNoise(context, config) {
  return Noise(context, {...config, color: 'white' })
}
