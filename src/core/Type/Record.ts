import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import { InferSchema } from '../Extract.type'
import { SchemaFreezableCore } from '../SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '../../config'
import { TypeSchemaUnion, AdjustReadonlyObject } from './_common.type'
import { ValidObject, Prettify, MakeOptional } from '../../utils.type'
import { object } from '../../rype'

export class SchemaRecord<
  T extends InputRecord,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = 'record' as const;

  ['~checkType'](
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    const output: ValidObject = {}

    for (let key in input) {
      const value = input[key]

      output[key] = this.schema['~checkAndGetResult'](value, {
        ...conf,
        path: `${conf.path || 'object'}.${key}`,
      })
    }

    return new RypeOk(output)
  }

  pick<T extends string[]>(...keys: T) {
    type Input = Prettify<Record<T[number], typeof this.schema>>
    const objectInput = {} as Input

    for (let key of keys) {
      objectInput[key as T[number]] = this.schema
    }

    return object(objectInput)
  }
}

export type InputRecord = TypeSchemaUnion
export type TypeRecord = SchemaRecord<any, any>
export type ExtractRecord<
  T extends TypeRecord,
  TMode extends 'input' | 'output'
> = AdjustReadonlyObject<
  T,
  Prettify<
    MakeOptional<{
      [K: string]: InferSchema<T['schema'], TMode>
    }>
  >
>
