import { RypeError } from './Error'
import { TypePrimitive } from './core/Schema.type'

export type CustomValidator<T> = (result: T) => string | void

export type SchemaConfig = {
  isRequired: boolean
  defaultValue?: unknown
}

export type SchemaCheckConf = {
  path: string
  throw: boolean
  safeParseRef?: { current: boolean }
  safeParseErrors?: RypeError[]
}

export type InputEnv = { [key: string]: TypePrimitive }
