// export function makeReadOnly(obj, prop) {
//   const value = obj[prop]
//   Object.defineProperty(obj, prop, { value, writable: false })
// }

export function isPlainObject(thing) {
  return typeof thing === "object" && thing.constructor === Object
}

export function isString(thing) {
  return typeof thing === "string"
}

export function isAudioParam(thing) {
  return typeof thing?.setValueAtTime === "function"
}

export function parseFloatOr(thing, fallback) {
  const val = parseFloat(thing)
  return Number.isNaN(val) ? fallback : val
}

export function split(thing, separator = "") {
  if (Array.isArray(thing)) {
    return thing
  }
  if (isString(thing)) {
    return thing.split(separator)
  }
  return []
}

export function forceArr(thing) {
  if (thing == null) {
    // Includes undefined
    return []
  }
  return Array.isArray(thing) ? thing : [thing]
}

export function forcePlainObject(thing, fallbackKey) {
  if (thing === undefined) {
    return {}
  }
  if (isPlainObject(thing)) {
    return thing
  }
  return { [fallbackKey]: thing }
}

export function withoutKey(thing, key) {
  const r = {}
  Object.entries(thing)
    .filter(([k]) => k !== key)
    .forEach(([k, v]) => {
      r[k] = v
    })
  return r
}
