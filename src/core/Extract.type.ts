import {
  SchemaOr,
  SchemaTuple,
  SchemaArray,
  SchemaString,
  SchemaNumber,
  SchemaObject,
  SchemaBoolean,
} from './Schema'
import {
  ExtractOr,
  ExtractArray,
  ExtractTuple,
  ExtractObject,
  ExtractPrimitive,
} from './ExtractSchema.type'
import * as Type from './Schema.type'
import { SchemaConfig } from '../types'
import { DeepReadonly } from '../utils.type'

export type AdjustReadonlyObject<
  T extends Type.Types,
  R
> = T['config']['convertToReadonly'] extends true ? DeepReadonly<R> : R

type AdjustSchemaInput<
  T extends Type.Types,
  R
> = T['config']['isRequired'] extends true ? R : R | undefined

type AdjustSchemaOutput<
  T extends Type.Types,
  R
> = T['config']['isRequired'] extends true
  ? R
  : 'defaultValue' extends keyof T['config']
  ? R
  : R | undefined

type ExtractSchemaCore<T extends Type.Types, TMode extends 'input' | 'output'> =
  // Primitive:
  T extends Type.TypePrimitive
    ? ExtractPrimitive<T>
    : // Tuple:
    T extends Type.TypeTuple
    ? ExtractTuple<T, TMode>
    : // Array:
    T extends Type.TypeArray
    ? ExtractArray<T, TMode>
    : // Or:
    T extends Type.TypeOr
    ? ExtractOr<T, TMode>
    : // Object:
    T extends Type.TypeObject
    ? ExtractObject<T, TMode>
    : // It's never gonna happen!
      never

export type InferInput<T> = T extends Type.Types
  ? AdjustSchemaInput<T, ExtractSchemaCore<T, 'input'>>
  : never

export type InferOutput<T> = T extends Type.Types
  ? AdjustSchemaOutput<T, ExtractSchemaCore<T, 'output'>>
  : never

export type InferSchema<
  T,
  TMode extends 'input' | 'output'
> = TMode extends 'input' ? InferInput<T> : InferOutput<T>

export type InferClassFromSchema<T, TFormat, TConfig extends SchemaConfig> =
  // String:
  T extends Type.TypeString
    ? SchemaString<TFormat extends Type.InputString ? TFormat : never, TConfig>
    : // Number:
    T extends Type.TypeNumber
    ? SchemaNumber<TFormat extends Type.InputNumber ? TFormat : never, TConfig>
    : // Boolean:
    T extends Type.TypeBoolean
    ? SchemaBoolean<
        TFormat extends Type.InputBoolean ? TFormat : never,
        TConfig
      >
    : // Tuple:
    T extends Type.TypeTuple
    ? SchemaTuple<TFormat extends Type.InputTuple ? TFormat : never, TConfig>
    : // Array:
    T extends Type.TypeArray
    ? SchemaArray<TFormat extends Type.InputArray ? TFormat : never, TConfig>
    : // Or:
    T extends Type.TypeOr
    ? SchemaOr<TFormat extends Type.InputOr ? TFormat : never, TConfig>
    : // Object:
    T extends Type.TypeObject
    ? SchemaObject<TFormat extends Type.InputObject ? TFormat : never, TConfig>
    : // It's never gonna happen!
      never