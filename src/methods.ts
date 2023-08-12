import * as Schema from './core/Schema'
import * as Types from './core/Schema.type'
import { Mutable } from './utils.type'

function createMethods<R extends boolean>(required: R) {
  return {
    object<const T>(arg: T extends Types.InputObject ? T : never) {
      return new Schema.SchemaObject(arg as Mutable<typeof arg>, required)
    },

    or<const T extends readonly [...Types.InputOr]>(...args: T) {
      return new Schema.SchemaOr(args as Mutable<typeof args>, required)
    },
    tuple<const T extends readonly [...Types.InputTuple]>(...args: T) {
      return new Schema.SchemaTuple(args as Mutable<typeof args>, required)
    },
    array<const T extends readonly [...Types.InputArray]>(...args: T) {
      return new Schema.SchemaArray(args as Mutable<typeof args>, required)
    },

    string<const T extends readonly [...Types.InputString]>(...args: T) {
      return new Schema.SchemaString(args as Mutable<typeof args>, required)
    },
    number<const T extends readonly [...Types.InputNumber]>(...args: T) {
      return new Schema.SchemaNumber(args as Mutable<typeof args>, required)
    },
    boolean<const T extends readonly [...Types.InputBoolean]>(...args: T) {
      return new Schema.SchemaBoolean(args as Mutable<typeof args>, required)
    },
  }
}

const requiredMethods = createMethods(true)
const optionalMethods = createMethods(false)
export default {
  ...requiredMethods,
  o: optionalMethods,
  optional: optionalMethods,
}
