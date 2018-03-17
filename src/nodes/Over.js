import { isPlainObject } from '../helpers'
import Patch from '../Patch'
import { Shaper, Gain } from './nativeNodes'

const CURVE_LEN = 8192

// Adapted from https://github.com/Theodeus/tuna/blob/master/tuna.js#L1170
// TODO Descriptive names for these?
const ALGOS = [
  (arr, amount) => {
    amount = Math.min(amount, 0.9999)
    let k = 2 * amount / (1 - amount)
    let i, x
    for (i = 0; i < CURVE_LEN; i++) {
      x = i * 2 / CURVE_LEN - 1
      arr[i] = (1 + k) * x / (1 + k * Math.abs(x))
    }
  },
  (arr, amount) => {
    let i, x, y
    for (i = 0; i < CURVE_LEN; i++) {
      x = i * 2 / CURVE_LEN - 1
      y = ((0.5 * Math.pow((x + 1.4), 2)) - 1) * y >= 0 ? 5.8 : 1.2
      arr[i] = Math.tanh(y)
    }
  },
  (arr, amount) => {
    let a = 1 - amount
    let i, x, y
    for (i = 0; i < CURVE_LEN; i++) {
      x = i * 2 / CURVE_LEN - 1
      y = x < 0 ? -Math.pow(Math.abs(x), a + 0.04) : Math.pow(x, a)
      arr[i] = Math.tanh(y * 2)
    }
  },
  (arr, amount) => {
    let a = 1 - amount > 0.99 ? 0.99 : 1 - amount
    let i, x, y, abx
    for (i = 0; i < CURVE_LEN; i++) {
      x = i * 2 / CURVE_LEN - 1
      abx = Math.abs(x)
      if (abx < a) {
        y = abx
      } else if (abx > a) {
        y = a + (abx - a) / (1 + Math.pow((abx - a) / (1 - a), 2))
      } else if (abx > 1) {
        y = abx
      }
      arr[i] = sign(x) * y * (1 / ((a + 1) / 2))
    }
  },
  (arr, amount) => {
    let i, x
    for (i = 0; i < CURVE_LEN; i++) {
      x = i * 2 / CURVE_LEN - 1
      if (x < -0.08905) {
        arr[i] =
          (-3 / 4) *
          (
            1 -
            (Math.pow((1 - (Math.abs(x) - 0.032857)), 12)) +
            (1 / 3) *
            (Math.abs(x) - 0.032847)
          ) +
          0.01
      } else if (x >= -0.08905 && x < 0.320018) {
        arr[i] = (-6.153 * (x * x)) + 3.9375 * x
      } else {
        arr[i] = 0.630035
      }
    }
  },
  (arr, amount) => {
    let a = 2 + Math.round(amount * 14)
    // we go from 2 to 16 bits, keep in mind for the UI
    let bits = Math.round(Math.pow(2, a - 1))
    // real number of quantization steps divided by 2
    let i, x
    for (i = 0; i < CURVE_LEN; i++) {
      x = i * 2 / CURVE_LEN - 1
      arr[i] = Math.round(x * bits) / bits
    }
  }
]

let _curveCache = {}

function sign(x) {
  if (x === 0) {
    return 1
  } else {
    return Math.abs(x) / x
  }
}

function getCurve(algo = 0, amount = 0.725) {
  let cacheKey = `${algo}/${amount}`
  if (!_curveCache[cacheKey]) {
    let arr = new Float32Array(CURVE_LEN)
    ALGOS[algo](arr, amount)
    _curveCache[cacheKey] = arr
  }
  return _curveCache[cacheKey]
}

function Over(context, config) {
  let params = isPlainObject(config) ? config : { drive: config }
  let curve = getCurve(params.algo, params.shape)
  return Patch(context, {
    drive: Gain(context, params.drive),
    shaper: Shaper(context, curve),
    makeup: Gain(context, params.makeup)
  }, 'in > drive > shaper > makeup > out')
}

export default Over
