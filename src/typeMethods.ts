import * as LT from './LType'
import { ConstArgs, Mutable } from './utils-type'
type SupportedArrayLike = string | number | boolean | LT.Schema

function createMethods<TB extends boolean>(required: TB) {
  return {
    string<const T>(...args: ConstArgs<T, string>) {
      return new LT.LTypeString(args as Mutable<typeof args>, required)
    },

    number<const T>(...args: ConstArgs<T, number>) {
      return new LT.LTypeNumber(args as Mutable<typeof args>, required)
    },

    boolean<const T>(...args: ConstArgs<T, boolean>) {
      return new LT.LTypeBoolean(args as Mutable<typeof args>, required)
    },

    tuple<const T>(
      ...args: T extends readonly SupportedArrayLike[] ? T : never
    ) {
      return new LT.LTypeTuple(args as Mutable<typeof args>, required)
    },

    array<const T>(
      ...args: T extends readonly SupportedArrayLike[] ? T : never
    ) {
      return new LT.LTypeArray(args as Mutable<typeof args>[number][], required)
    },
  }
}

const requiredMethods = createMethods(true)
const optionalMethods = createMethods(false)

export default {
  ...requiredMethods,
  opt: optionalMethods,
  optional: optionalMethods,
}
