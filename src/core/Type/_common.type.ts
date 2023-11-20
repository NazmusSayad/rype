import { TypeOr } from './Or'
import { TypeTuple } from './Tuple'
import { TypeArray } from './Array'
import { TypeNumber } from './Number'
import { TypeObject } from './Object'
import { TypeRecord } from './Record'
import { TypeString } from './String'
import { TypeBoolean } from './Boolean'
import { TypeInstance } from './Instance'
import { InferSchema } from '../Extract.type'
import { DeepReadonly } from '../../utils.type'

export type TypePrimitive = TypeString | TypeNumber | TypeBoolean
export type TypeSchemaUnion =
  | TypeInstance
  | TypeObject
  | TypeRecord
  | TypeOr
  | TypeArray
  | TypeTuple
  | TypePrimitive

export type ExtractPrimitive<T extends TypePrimitive> = T['schema'][number]
export type ExtractArrayLike<
  T extends TypeArray | TypeOr,
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
