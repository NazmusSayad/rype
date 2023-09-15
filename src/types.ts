import { RypeError } from './Error'

export type CustomValidator<T> = (result: T) => string | void

export type SchemaConfig = {
  isRequired: boolean
  defaultValue?: unknown
  convertToReadonly?: boolean
}

export type SchemaCheckConf = {
  path: string
  throw: boolean
  safeParseRef?: { current: boolean }
  safeParseErrors?: RypeError[]
}
