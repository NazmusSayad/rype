import {
  TypeOr,
  TypeArray,
  TypeBoolean,
  TypeConstructor,
  TypeNumber,
  TypeString,
  TypeTuple,
} from './Type'
import { Prettify } from './utils-type'

export type Primitive = TypeString | TypeNumber | TypeBoolean

export type ArrayLike = TypeArray | TypeTuple
export type ObjectLike = { [i: string]: Schema }
export type Refference = ArrayLike | ObjectLike | TypeConstructor

export type Schema = Primitive | Refference | TypeOr

export type EnvSchema = { [key: string]: Primitive }

export type PrettifyInput<T extends Schema> = T extends Primitive
  ? T
  : Prettify<T>
