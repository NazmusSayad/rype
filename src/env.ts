import {
  SchemaObject,
  SchemaNumber,
  SchemaString,
  SchemaBoolean,
  TypePrimitive,
} from './core/Schema'
import r from './index'
import { SchemaConfig } from './config'
import { ValidObject } from './utils.type'

function formatString(
  schema: any,
  value: string | number | boolean,
  path?: string
) {
  if (!schema.config.isRequired && value === undefined) return

  if (schema instanceof SchemaString) {
    return r.string().parse(String(value), path)
  }

  if (schema instanceof SchemaNumber) {
    return r.number().parse(Number(value), path)
  }

  if (schema instanceof SchemaBoolean) {
    if (typeof value === 'boolean') return value

    if (typeof value === 'number') {
      if (value === 1) return true
      if (value === 0) return false
    }

    if (typeof value === 'string') {
      const lowerCase = value.toLowerCase()
      if (lowerCase === 'true') return true
      if (lowerCase === 'false') return false
      if (lowerCase === 'yes') return true
      if (lowerCase === 'no') return false
      if (value === '1') return true
      if (value === '0') return false
    }

    return r.boolean().parse(value, path)
  }
}

export function env<T extends InputEnv>(schema: T): InferEnv<T> {
  const result: ValidObject = {}

  for (let key in schema) {
    const oldSchema = schema[key as keyof typeof schema]
    const config = oldSchema.config as SchemaConfig

    const newSchema = config.isRequired ? r.string() : r.string().optional()
    const withDefaultValue =
      'defaultValue' in config
        ? newSchema.default(config.defaultValue as string)
        : newSchema

    try {
      const path = 'ENV.' + key
      const output = withDefaultValue.parse(process.env[key], path)
      if (output === undefined) continue
      result[key] = formatString(oldSchema, output, path)
    } catch (err: any) {
      console.error(`\x1b[31m\x1b[1m${err.message}\x1b[0m`)
      process.exit(1)
    }
  }

  return result as any // Typescript Sucks
}

export type InputEnv = { [key: string]: TypePrimitive }
export type InferEnv<T extends InputEnv> = r.inferOut<
  SchemaObject<T, { isRequired: true }>
>
