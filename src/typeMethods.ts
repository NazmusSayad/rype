import * as LT from './LType'
import { ConstArgs, Mutable, ValidConstructor } from './utils-type'

function createMethods<TB extends boolean>(required: TB) {
  return {
    string<const T>(...string: ConstArgs<T, string>) {
      return new LT.TypeString(string as Mutable<T>, required)
    },

    number<const T>(...number: ConstArgs<T, number>) {
      return new LT.TypeNumber(number as Mutable<T>, required)
    },

    boolean<const T>(...boolean: ConstArgs<T, boolean>) {
      return new LT.TypeBoolean(boolean as Mutable<T>, required)
    },

    tuple<const T>(...element: ConstArgs<T, LT.SchemaAndPrimitives>) {
      return new LT.TypeTuple(element as Mutable<typeof element>, required)
    },

    array<const T>(...element: ConstArgs<T, LT.SchemaAndPrimitives>) {
      return new LT.TypeArray(
        element as Mutable<typeof element>[number][],
        required
      )
    },

    instance<const T>(...constructor: ConstArgs<T, ValidConstructor>) {
      return new LT.TypeConstructor(constructor as Mutable<T>, required)
    },

    any<const T>(...options: ConstArgs<T, LT.Schema>) {
      return new LT.TypeAny(
        options as Mutable<typeof options>[number][],
        required
      )
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
