import * as Schema from './core/Schema'
import { Mutable, ReadonlyArray } from './utils.type'
import { InferInput, InferOutput } from './core/Extract.type'
import { DefaultSchemaConfig, defaultSchemaConfig } from './config'

export { InferInput as inferInput }
export { InferOutput as inferOutput }

export function string<
  const T extends ReadonlyArray<Schema.SchemaString.Input>
>(...args: T) {
  return new Schema.SchemaString(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function number<
  const T extends ReadonlyArray<Schema.SchemaNumber.Input>
>(...args: T) {
  return new Schema.SchemaNumber(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function boolean<
  const T extends ReadonlyArray<Schema.SchemaBoolean.Input>
>(...args: T) {
  return new Schema.SchemaBoolean(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}

export function or<const T extends ReadonlyArray<Schema.SchemaOr.Input>>(
  ...args: T
) {
  return new Schema.SchemaOr(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function tuple<const T extends ReadonlyArray<Schema.SchemaTuple.Input>>(
  ...args: T
) {
  return new Schema.SchemaTuple(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}
export function array<const T extends ReadonlyArray<Schema.SchemaArray.Input>>(
  ...args: T
) {
  return new Schema.SchemaArray(args as Mutable<typeof args>, {
    ...defaultSchemaConfig,
  })
}

export function instance<T extends Schema.SchemaInstance.Input[]>(
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
export function object<T extends Schema.SchemaObject.Input>(arg: T) {
  return new Schema.SchemaObject(arg, { ...defaultSchemaConfig })
}
export function record<T extends Schema.SchemaRecord.Input>(arg: T) {
  return new Schema.SchemaRecord(arg, { ...defaultSchemaConfig })
}

export function fixed<T extends Schema.SchemaFixed.Input>(arg: T) {
  return new Schema.SchemaFixed(arg, {
    ...defaultSchemaConfig,
  }).default(arg as any)
}
