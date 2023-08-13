import { ExtractSchema } from './core/Extract.type'
import { TypePrimitive, Types } from './core/Schema.type'

export type CheckConf = {
  path: string
  throw: boolean
  meta?: boolean
}

export type OptionalValueToUndefined<T extends Types> =
  T['isRequired'] extends true ? ExtractSchema<T> : ExtractSchema<T> | undefined

export type InputEnv = { [key: string]: TypePrimitive }
