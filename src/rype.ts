import * as Schema from './core/Schema'
import { Mutable, ReadonlyArray } from './utils.type'
import { DefaultSchemaConfig, defaultSchemaConfig } from './config'
import { InferSchema, InferInput, InferOutput } from './core/Extract.type'

export { InferSchema as infer }
export { InferInput as inferIn }
export { InferOutput as inferOut }

export function string<const T extends ReadonlyArray<Schema.InputString>>(
  ...args: T
) {
  return new Schema.SchemaString(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function number<const T extends ReadonlyArray<Schema.InputNumber>>(
  ...args: T
) {
  return new Schema.SchemaNumber(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function boolean<const T extends ReadonlyArray<Schema.InputBoolean>>(
  ...args: T
) {
  return new Schema.SchemaBoolean(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}

export function or<const T extends ReadonlyArray<Schema.InputOr>>(...args: T) {
  return new Schema.SchemaOr(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function tuple<const T extends ReadonlyArray<Schema.InputTuple>>(
  ...args: T
) {
  return new Schema.SchemaTuple(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function array<const T extends ReadonlyArray<Schema.InputArray>>(
  ...args: T
) {
  return new Schema.SchemaArray(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}

export function instance<T extends Schema.InputInstance[]>(
  ...args: T
): T extends [any]
  ? Schema.SchemaInstance<T[0], DefaultSchemaConfig>
  : Schema.SchemaOr<
      {
        [K in keyof T]: Schema.SchemaInstance<T[K], DefaultSchemaConfig>
      },
      DefaultSchemaConfig
    > {
  if (args.length === 1) {
    return new Schema.SchemaInstance(args[0], { ...defaultSchemaConfig }) as any // Typescript sucks!!
  }

  return new Schema.SchemaOr(
    args.map(
      (arg) => new Schema.SchemaInstance(arg, { ...defaultSchemaConfig })
    ),
    { ...defaultSchemaConfig }
  ) as any // Typescript sucks!!
}
export function object<T extends Schema.InputObject>(arg: T) {
  return new Schema.SchemaObject(arg, { ...defaultSchemaConfig })
}
export function record<T extends Schema.InputRecord>(arg: T) {
  return new Schema.SchemaRecord(arg, { ...defaultSchemaConfig })
}
