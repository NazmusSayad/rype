import {
  SchemaNumber,
  SchemaObject,
  SchemaString,
  SchemaBoolean,
} from './core/Schema'
import methods from './methods'
import { caller } from './base'
import { InputEnv } from './types'
import { ValidObject } from './utils.type'
import { ExtractSchema } from './core/Extract.type'

export function env<T extends InputEnv>(
  schema: T
): ExtractSchema<SchemaObject<T, { isRequired: true }>> {
  const stringSchema: ValidObject = {}
  const result: ValidObject = {}

  for (let key in schema) {
    stringSchema[key] = schema[key as keyof typeof schema].config.isRequired
      ? methods.string()
      : methods.o.string()
  }

  const object = caller(methods.object(stringSchema as typeof schema))(
    process.env
  )

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

  return result as any
}
