import {
  TypeOr,
  TypeArray,
  TypeTuple,
  TypeNumber,
  TypeString,
  TypeBoolean,
  TypeConstructor,
} from './Type'
import { Prettify } from './utils-type'

export type Primitive = TypeString | TypeNumber | TypeBoolean

export type ArrayLike = TypeArray | TypeTuple
export type ObjectLike = { [i: string]: Schema }
export type Refference = ArrayLike | ObjectLike | TypeConstructor

export type Schema = Primitive | Refference | TypeOr
export type EnvSchema = { [i: string]: Primitive }

export type PrettifyInput<T extends object> = T extends Primitive
  ? T
  : Prettify<T>
