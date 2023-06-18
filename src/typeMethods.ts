import * as Type from './Type'
import * as TType from './Type-type'
import { ConstArgs, Mutable, ValidConstructor } from './utils-type'

type Mutate1<T, TFallback> = T extends readonly [] ? TFallback : Mutable<T>

function createMethods<TB extends boolean>(required: TB) {
  return {
    string<const T>(...string: ConstArgs<T, string>) {
      return new Type.TypeString(string as Mutate1<T, string[]>, required)
    },

    number<const T>(...number: ConstArgs<T, number>) {
      return new Type.TypeNumber(number as Mutate1<T, number[]>, required)
    },

    boolean<const T>(...boolean: ConstArgs<T, boolean>) {
      return new Type.TypeBoolean(boolean as Mutate1<T, boolean[]>, required)
    },

    tuple<const T>(...element: ConstArgs<T, TType.Schema>) {
      return new Type.TypeTuple(
        element as Mutate1<typeof element, never[]>,
        required
      )
    },

    array<const T>(
      ...element: T extends readonly [] ? any[] : ConstArgs<T, TType.Schema>
    ) {
      return new Type.TypeArray(
        element as Mutable<typeof element>[number][],
        required
      )
    },

    instance<const T>(
      ...constructor: T extends readonly []
        ? [ValidConstructor]
        : ConstArgs<T, ValidConstructor>
    ) {
      return new Type.TypeConstructor(
        constructor as Mutable<typeof constructor>,
        required
      )
    },

    or<const T>(
      ...options: T extends readonly [] | readonly [TType.Schema]
        ? readonly [TType.Schema, TType.Schema]
        : ConstArgs<T, TType.Schema>
    ) {
      return new Type.TypeOr(
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
