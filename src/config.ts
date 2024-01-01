import { RypeError } from './Error'

export type CustomValidator<T> = (result: T) => string | void

export type SchemaConfig = {
  isRequired: boolean
  defaultValue?: unknown
  convertToReadonly?: boolean
  outputAsKey?: string
  inputAsKey?: string
}

export type SchemaCheckConf = {
  path: string
  throw: boolean
  safeParseRef?: { current: boolean }
  safeParseErrors?: RypeError[]
}

export const defaultSchemaConfig = { isRequired: true } as const
export type DefaultSchemaConfig = typeof defaultSchemaConfig
