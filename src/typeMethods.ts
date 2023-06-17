import * as LT from './LType'
import { ConstArgs, Mutable, ValidConstructor } from './utils-type'

function createMethods<TB extends boolean>(required: TB) {
  return {
    string<const T>(...args: ConstArgs<T, string>) {
      return new LT.TypeString(args as Mutable<typeof args>, required)
    },

    number<const T>(...args: ConstArgs<T, number>) {
      return new LT.TypeNumber(args as Mutable<typeof args>, required)
    },

    boolean<const T>(...args: ConstArgs<T, boolean>) {
      return new LT.TypeBoolean(args as Mutable<typeof args>, required)
    },

    tuple<const T>(
      ...args: T extends readonly LT.SchemaAndPrimitives[] ? T : never
    ) {
      return new LT.TypeTuple(args as Mutable<typeof args>, required)
    },

    array<const T>(
      ...args: T extends readonly LT.SchemaAndPrimitives[] ? T : never
    ) {
      return new LT.TypeArray(args as Mutable<typeof args>[number][], required)
    },

    instance<const T>(constructor: T extends ValidConstructor ? T : never) {
      return new LT.TypeConstructor(constructor, required)
    },
  }
}

const requiredMethods = createMethods(true)
const optionalMethods = createMethods(false)
export default {
  ...requiredMethods,
  o: optionalMethods,
  opt: optionalMethods,
  optional: optionalMethods,
}
