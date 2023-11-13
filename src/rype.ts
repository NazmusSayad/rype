import * as Schema from './core/Schema'
import { Mutable, ReadonlyArray } from './utils.type'

function createMethods<R extends boolean>(required: R) {
  return {
    instance<T extends Schema.InputInstance[]>(
      ...args: T
    ): T extends [any]
      ? Schema.SchemaInstance<T[0], { isRequired: R }>
      : Schema.SchemaOr<
          {
            [K in keyof T]: Schema.SchemaInstance<T[K], { isRequired: R }>
          },
          { isRequired: R }
        > {
      if (args.length === 1) {
        return new Schema.SchemaInstance(args[0], {
          isRequired: required,
        }) as any /* Typescript sucks!! */
      }

      return new Schema.SchemaOr(
        args.map(
          (arg) => new Schema.SchemaInstance(arg, { isRequired: required })
        ),
        { isRequired: required }
      ) as any /* Typescript sucks!! */
    },
    object<T extends Schema.InputObject>(arg: T) {
      return new Schema.SchemaObject(arg, { isRequired: required })
    },
    record<T extends Schema.InputRecord>(arg: T) {
      return new Schema.SchemaRecord(arg, { isRequired: required })
    },

    or<const T extends ReadonlyArray<Schema.InputOr>>(...args: T) {
      return new Schema.SchemaOr(args as Mutable<typeof args>, {
        isRequired: required,
      })
    },
    tuple<const T extends ReadonlyArray<Schema.InputTuple>>(...args: T) {
      return new Schema.SchemaTuple(args as Mutable<typeof args>, {
        isRequired: required,
      })
    },
    array<const T extends ReadonlyArray<Schema.InputArray>>(...args: T) {
      return new Schema.SchemaArray(args as Mutable<typeof args>, {
        isRequired: required,
      })
    },

    string<const T extends ReadonlyArray<Schema.InputString>>(...args: T) {
      return new Schema.SchemaString(args as Mutable<typeof args>, {
        isRequired: required,
      })
    },
    number<const T extends ReadonlyArray<Schema.InputNumber>>(...args: T) {
      return new Schema.SchemaNumber(args as Mutable<typeof args>, {
        isRequired: required,
      })
    },
    boolean<const T extends ReadonlyArray<Schema.InputBoolean>>(...args: T) {
      return new Schema.SchemaBoolean(args as Mutable<typeof args>, {
        isRequired: required,
      })
    },
  }
}

const requiredMethods = createMethods(true)
const optionalMethods = createMethods(false)
export default {
  ...requiredMethods,

  /**
   * @deprecated Use `schema.optional()` or `schema.required()` instead.
   */
  o: optionalMethods,

  /**
   * @deprecated Use `schema.optional()` or `schema.required()` instead.
   */
  opt: optionalMethods,

  /**
   * @deprecated Use `schema.optional()` or `schema.required()` instead.
   */
  optional: optionalMethods,
}
