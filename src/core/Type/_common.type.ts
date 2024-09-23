import { InferSchema } from '@/core/Extract.type'
import { DeepReadonly } from '@/utils.type'
import { SchemaInstance } from './Instance'
import { SchemaObject } from './Object'
import { SchemaRecord } from './Record'
import { SchemaOr } from './Or'
import { SchemaArray } from './Array'
import { SchemaTuple } from './Tuple'
import { SchemaFixed } from './Fixed'
import { SchemaString } from './String'
import { SchemaNumber } from './Number'
import { SchemaBoolean } from './Boolean'

export type TypePrimitive =
  | SchemaString.Sample
  | SchemaNumber.Sample
  | SchemaBoolean.Sample
export type TypeSchemaUnion =
  | TypePrimitive
  | SchemaInstance.Sample
  | SchemaObject.Sample
  | SchemaRecord.Sample
  | SchemaOr.Sample
  | SchemaArray.Sample
  | SchemaTuple.Sample
  | SchemaFixed.Sample

export type ExtractPrimitive<T extends TypePrimitive> = T['schema'][number]
export type ExtractArrayLike<
  T extends SchemaArray.Sample | SchemaOr.Sample,
  TMode extends 'input' | 'output'
> = {
  [K in keyof T['schema'] as K extends `${number}` ? K : never]: InferSchema<
    T['schema'][K],
    TMode
  >
}

export type AdjustReadonlyObject<
  T extends TypeSchemaUnion,
  R
> = T['config']['convertToReadonly'] extends true ? DeepReadonly<R> : R
