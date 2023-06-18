import {
  TypeOr,
  TypeArray,
  TypeBoolean,
  TypeConstructor,
  TypeNumber,
  TypeString,
  TypeTuple,
} from './Type'

export type Primitive = TypeString | TypeNumber | TypeBoolean

export type ArrayLike = TypeArray | TypeTuple
export type ObjectLike = { [i: string]: Schema }
export type Refference = ArrayLike | ObjectLike | TypeConstructor

export type Schema = Primitive | Refference | TypeOr
