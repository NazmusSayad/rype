import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import messages from '../../errorMessages'
import { SchemaCore } from '../SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '../../types'
import { ExtractArrayLike, TypeSchemaUnion } from './_common.type'

export class SchemaOr<
  T extends InputOr,
  R extends SchemaConfig
> extends SchemaCore<T[number] extends never ? InputOr : T, R> {
  name = 'or' as const;

  ['~getType']() {
    return this.schema.map((schema) => schema.type)
  }

  ['~checkType'](input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    if (this.schema.length === 0) return new RypeOk(input)

    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]
      const result = schema['~checkCore'](input, { ...conf })
      if (result instanceof RypeOk) return result
    }

    return this['~getErr'](
      input,
      messages.getTypeErr(conf.path, {
        TYPE: this.type,
      })
    )
  }
}

export type InputOr = TypeSchemaUnion[]
export type TypeOr = SchemaOr<any, any>
export type ExtractOr<
  T extends TypeOr,
  TMode extends 'input' | 'output',
  U = ExtractArrayLike<T, TMode>
> = U[keyof U] extends never ? any : U[keyof U]
