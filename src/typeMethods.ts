import * as LT from './LType'
import { ConstArgs, Mutable, ValidConstructor } from './utils-type'

type Mutate1<T, TFallback> = T extends readonly [] ? TFallback : Mutable<T>

function createMethods<TB extends boolean>(required: TB) {
  return {
    string<const T>(...string: ConstArgs<T, string>) {
      return new LT.TypeString(string as Mutate1<T, string[]>, required)
    },

    number<const T>(...number: ConstArgs<T, number>) {
      return new LT.TypeNumber(number as Mutate1<T, number[]>, required)
    },

    boolean<const T>(...boolean: ConstArgs<T, boolean>) {
      return new LT.TypeBoolean(boolean as Mutate1<T, boolean[]>, required)
    },

    tuple<const T>(...element: ConstArgs<T, LT.SchemaAndPrimitives>) {
      return new LT.TypeTuple(
        element as Mutate1<typeof element, never[]>,
        required
      )
    },

    array<const T>(
      ...element: T extends readonly []
        ? any[]
        : ConstArgs<T, LT.SchemaAndPrimitives>
    ) {
      return new LT.TypeArray(
        element as Mutable<typeof element>[number][],
        required
      )
    },

    instance<const T>(
      ...constructor: T extends readonly []
        ? [ValidConstructor]
        : ConstArgs<T, ValidConstructor>
    ) {
      return new LT.TypeConstructor(
        constructor as Mutable<typeof constructor>,
        required
      )
    },

    any<const T>(
      ...options: T extends readonly [] | readonly [LT.Schema]
        ? readonly [LT.Schema, LT.Schema]
        : ConstArgs<T, LT.Schema>
    ) {
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
