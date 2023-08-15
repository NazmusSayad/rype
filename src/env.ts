import {
  SchemaNumber,
  SchemaObject,
  SchemaString,
  SchemaBoolean,
} from './core/Schema'
import r from './rype'
import { InputEnv } from './types'
import { ValidObject } from './utils.type'
import { InferOutput } from './core/Extract.type'

export function env<T extends InputEnv>(
  schema: T
): InferOutput<SchemaObject<T, { isRequired: true }>> {
  const result: ValidObject = {}
  const stringSchema: ValidObject = {}

  for (let key in schema) {
    stringSchema[key] = schema[key as keyof typeof schema].config.isRequired
      ? r.string()
      : r.o.string()
  }

  const object = r.object(stringSchema as typeof schema).parse(process.env)

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
