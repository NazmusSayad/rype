import {
  SchemaOr,
  SchemaTuple,
  SchemaArray,
  SchemaObject,
  SchemaRecord,
  SchemaString,
  SchemaNumber,
  SchemaBoolean,
  SchemaInstance,
} from './Schema'

export type InputString = string[]
export type InputNumber = number[]
export type InputBoolean = boolean[]

export type InputObject = { [key: string]: Types }
export type InputRecord = Types
export type InputInstance = new (...args: any[]) => any
export type InputArray = Types[]
export type InputTuple = Types[]
export type InputOr = Types[]

export type TypeString = SchemaString<any, any>
export type TypeNumber = SchemaNumber<any, any>
export type TypeBoolean = SchemaBoolean<any, any>

export type TypeOr = SchemaOr<any, any>
export type TypeObject = SchemaObject<any, any>
export type TypeInstance = SchemaInstance<any, any>
export type TypeRecord = SchemaRecord<any, any>
export type TypeArray = SchemaArray<any, any>
export type TypeTuple = SchemaTuple<any, any>

export type TypePrimitive = TypeString | TypeNumber | TypeBoolean
export type Types =
  | TypeInstance
  | TypeObject
  | TypeRecord
  | TypeOr
  | TypeArray
  | TypeTuple
  | TypePrimitive
