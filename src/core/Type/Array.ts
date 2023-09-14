import { SchemaOr } from './Or'
import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import messages from '../../errorMessages'
import { Prettify } from '../../utils.type'
import { SchemaFreezableCore } from '../SchemaCore'
import { AdjustReadonlyObject } from '../Extract.type'
import { SchemaCheckConf, SchemaConfig } from '../../types'
import { ExtractArrayLike, TypeSchemaUnion } from './_common.type'

export class SchemaArray<
  T extends InputArray,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = 'array' as const;

  ['~checkType'](inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this['~getErr'](
        inputs,
        messages.getTypeErr(conf.path, { TYPE: this.type })
      )
    }

    if (this.schema.length === 0 || inputs.length === 0) {
      return new RypeOk(inputs)
    }

    const output: unknown[] = []
    const schema =
      this.schema.length === 1
        ? new SchemaOr(this.schema, { isRequired: true })
        : this.schema[0]

    for (let i = 0; i <= inputs.length - 1; i++) {
      const input = inputs[i]
      const path = `${conf.path}array[${i}]`
      const result = schema['~checkAndThrowError'](input, {
        ...conf,
        path,
      })

      if (result instanceof RypeOk) {
        output.push(result.value)
      }
    }

    return new RypeOk(output)
  }
}

export type InputArray = TypeSchemaUnion[]
export type TypeArray = SchemaArray<any, any>
export type ExtractArray<
  T extends TypeArray,
  TMode extends 'input' | 'output',
  U = ExtractArrayLike<T, TMode>
> = U[keyof U] extends never
  ? any[]
  : AdjustReadonlyObject<T, Prettify<U[keyof U][]>>
