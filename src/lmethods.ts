import * as LT from './LType'
import { suffixedKeys } from './utils'
import { ConstArgs, Mutable } from './utils-type'
type SupportedArrayLike = string | number | boolean | LT.Schema

const optional = {
  string<const T>(...args: ConstArgs<T, string>) {
    return new LT.LTypeString(args as Mutable<typeof args>, false)
  },
  number<const T>(...args: ConstArgs<T, number>) {
    return new LT.LTypeNumber(args as Mutable<typeof args>, false)
  },
  boolean<const T>(...args: ConstArgs<T, boolean>) {
    return new LT.LTypeBoolean(args as Mutable<typeof args>, false)
  },
  tuple<const T>(...args: T extends readonly SupportedArrayLike[] ? T : never) {
    return new LT.LTypeTuple(args as Mutable<typeof args>, false)
  },
  array<const T>(...args: T extends readonly SupportedArrayLike[] ? T : never) {
    return new LT.LTypeArray(args as Mutable<typeof args>[number][], false)
  },
}

export default {
  ...suffixedKeys(optional, '_'),
  ...suffixedKeys(optional, '$'),
  optional,

  string<const T>(...args: ConstArgs<T, string>) {
    return new LT.LTypeString(args as Mutable<typeof args>, true)
  },
  number<const T>(...args: ConstArgs<T, number>) {
    return new LT.LTypeNumber(args as Mutable<typeof args>, true)
  },
  boolean<const T>(...args: ConstArgs<T, boolean>) {
    return new LT.LTypeBoolean(args as Mutable<typeof args>, true)
  },
  tuple<const T>(...args: T extends readonly SupportedArrayLike[] ? T : never) {
    return new LT.LTypeTuple(args, true)
  },
  array<const T>(...args: T extends readonly SupportedArrayLike[] ? T : never) {
    return new LT.LTypeArray(args as Mutable<typeof args>[number][], true)
  },
}
