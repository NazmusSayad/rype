import { TypePrimitive } from './core/Schema.type'

export type SchemaConfig = {
  isRequired: boolean
  defaultValue?: unknown
}

export type SchemaCheckConf = {
  path: string
  throw: boolean
}

export type InputEnv = { [key: string]: TypePrimitive }
