import {
  SchemaNumber,
  SchemaObject,
  SchemaString,
  SchemaBoolean,
} from './core/Schema'
import r from './rype'
import { ValidObject } from './utils.type'
import { InputEnv, SchemaConfig } from './types'
import { InferOutput } from './core/Extract.type'

export function env<T extends InputEnv>(
  schema: T
): InferOutput<SchemaObject<T, { isRequired: true }>> {
  const result: ValidObject = {}
  const stringSchema: ValidObject = {}

  for (let key in schema) {
    const oldSchema = schema[key as keyof typeof schema]
    const config = oldSchema.config as SchemaConfig
    const newSchema = config.isRequired ? r.string() : r.o.string()

    stringSchema[key] =
      'defaultValue' in config
        ? newSchema.default(config.defaultValue as string)
        : newSchema
  }

  const object = r.object(stringSchema as typeof schema).parse(process.env)

  for (let key in object) {
    const value = object[key as keyof typeof object]
    const schemaType = schema[key as keyof typeof schema]

    if (!schemaType.config.isRequired && value === undefined) {
      continue
    }

    result[key] =
      schemaType instanceof SchemaString
        ? String(value)
        : schemaType instanceof SchemaNumber
        ? Number(value)
        : schemaType instanceof SchemaBoolean
        ? typeof value === 'string'
          ? value === 'true' ||
            value === 'True' ||
            value === 'TRUE' ||
            value === '1'
          : value
        : null
  }

  return result as any
}
