function getBuggedSubclassOf(C) {
  // NOTE This stupid dance is to make sure the subclass
  // has the same name as the superclass
  const name = C.name
  const o = {
    [name]: class extends C {
      __connections = []
      connect(...args) {
        const [destination, outputIndex, inputIndex] = args
        this.__connections.push({ destination, outputIndex, inputIndex })
        return super.connect(...args)
      }
    },
  }
  return o[name]
}

export function getBuggedWaaConstructors(orig) {
  const bugged = {}
  Object.entries(orig).forEach(([name, C]) => {
    if (name.endsWith("Node")) {
      bugged[name] = getBuggedSubclassOf(C)
    }
  })
  return bugged
}
