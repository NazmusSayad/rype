import methods from './methods'
import { caller } from './base'
import { EnvSchema } from './types'
import { Prettify } from './utils.type'
import { SchemaBoolean, SchemaNumber, SchemaString } from './core/Schema'

export function env<T extends EnvSchema>(schema: T) {
  const stringSchema: any = {}
  const result: any = {}

  for (let key in schema) {
    stringSchema[key] = schema[key as keyof typeof schema].isRequired
      ? methods.string()
      : methods.o.string()
  }

  const object = caller(
    // @ts-ignore
    methods.object(stringSchema as Prettify<typeof schema>)
  )(process.env)

  for (let key in object) {
    const value = object[key as keyof typeof object]
    const schemaType = schema[key as keyof typeof schema]

    result[key] =
      schemaType instanceof SchemaString
        ? String(value)
        : schemaType instanceof SchemaNumber
        ? Number(value)
        : schemaType instanceof SchemaBoolean
        ? value === 'true' ||
          value === 'True' ||
          value === 'TRUE' ||
          value === '1'
        : null
  }

  return result as typeof object
}
