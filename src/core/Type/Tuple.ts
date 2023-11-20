import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import messages from '../../errorMessages'
import { InferSchema } from '../Extract.type'
import { SchemaFreezableCore } from '../SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '../../config'
import { Prettify, FormatTupleToNeverTuple } from '../../utils.type'
import { AdjustReadonlyObject, TypeSchemaUnion } from './_common.type'

export class SchemaTuple<
  T extends InputTuple,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = 'tuple' as const;

  ['~checkType'](inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this['~getErr'](
        inputs,
        messages.getTypeErr(conf.path, { TYPE: this.type })
      )
    }

    if (
      this.schema.length !== inputs.length &&
      !this.schema.every((schema) => 'defaultValue' in schema.config)
    ) {
      return this['~getErr'](
        inputs,
        messages.getTupleLengthError(conf.path, {
          LENGTH: this.schema.length.toString(),
        })
      )
    }

    const output: unknown[] = []
    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]
      const inputElement = inputs[i]
      const result = schema['~checkAndGetResult'](inputElement, {
        ...conf,
        path: `${conf.path || 'Tuple'}[${i}]`,
      })

      output.push(result)
    }

    return new RypeOk(output)
  }
}

export type InputTuple = TypeSchemaUnion[]
export type TypeTuple = SchemaTuple<any, any>
export type ExtractTuple<
  T extends TypeTuple,
  TMode extends 'input' | 'output'
> = AdjustReadonlyObject<
  T,
  Prettify<
    FormatTupleToNeverTuple<
      {
        [K in keyof T['schema'] as K extends `${number}`
          ? K
          : never]: InferSchema<T['schema'][K], TMode>
      } & Pick<T['schema'], 'length'>
    >
  >
>
