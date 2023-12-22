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

export type DefaultSchemaConfig = { isRequired: true }
export const defaultSchemaConfig: DefaultSchemaConfig = { isRequired: true }
