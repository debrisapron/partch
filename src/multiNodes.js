import { upTo } from './helpers'
import Patch from './Patch'

export function Parallel(context, arrayOrFactory, length) {
  let arr = Array.isArray(arrayOrFactory)
    ? arrayOrFactory
    : upTo(length).map(arrayOrFactory)

  let connections = arr.map((__, i) => {
    return `${arr[i].input ? 'in > ' : ''}${i} > out`
  })
  return Patch(context, arr, ...connections)
}
