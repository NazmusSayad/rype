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

  /**
   * Creates a new schema where all properties are marked as optional (not required).
   * @returns A new schema with optional properties.
   * @example
   * ```ts
   * const schema = r.record(r.string()).pick("name")
   * const result = schema.parseTyped({ name: 'John' }) // { name: 'John' }
   * ```
   */
  pick<T extends string[]>(
    ...keys: T
  ): ReturnType<
    typeof object<{
      [K in T[number]]: typeof this.schema
    }>
  > {
    const objectInput: any = {}
    for (let key of keys) {
      objectInput[key] = this.schema
    }

    return object(
      objectInput as {
        [K in T[number]]: typeof this.schema
      }
    )
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
