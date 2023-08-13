import { ExtractSchema } from './core/Extract.type'
import { TypePrimitive, Types } from './core/Schema.type'

export type SchemaConfig = {
  isRequired: boolean
  defaultValue?: unknown
}

export type SchemaCheckConf = {
  path: string
  throw: boolean
  getUnthrownError?: boolean
}

export type AdjustOptionalValue<
  T extends Types,
  R
> = T['config']['isRequired'] extends true
  ? R
  : 'defaultValue' extends keyof T['config']
  ? R
  : R | undefined

export type OptionalValueToUndefined<T extends Types> =
  T['config']['isRequired'] extends true
    ? ExtractSchema<T>
    : 'defaultValue' extends keyof T['config']
    ? ExtractSchema<T>
    : ExtractSchema<T> | undefined

export type InputEnv = { [key: string]: TypePrimitive }
