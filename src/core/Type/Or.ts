import { RypeOk } from '@/RypeOk'
import { SchemaCore } from '@/core/SchemaCore'
import { RypeClientError, RypeError } from '@/Error'
import { SchemaCheckConf, SchemaConfig } from '@/config'
import { ExtractArrayLike, TypeSchemaUnion } from './_common.type'

export class SchemaOr<
  T extends SchemaOr.Input,
  R extends SchemaConfig
> extends SchemaCore<T[number] extends never ? SchemaOr.Input : T, R> {
  name = 'or' as const;

  ['~getType']() {
    return this.schema.map((schema) => schema.type)
  }

  ['~checkType'](input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    if (this.schema.length === 0) return new RypeOk(input)
    let rypeErrors: RypeClientError[] = []

    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]

      try {
        const result = schema['~checkCore'](input, { ...conf })
        if (result instanceof RypeOk) return result
      } catch (err) {
        if (err instanceof RypeClientError) {
          rypeErrors.push(err)
        } else throw err
      }
    }

    return this['~getErr'](
      input,
      [...new Set(rypeErrors.map((err) => err.message))].join(' | ')
    )
  }
}

export namespace SchemaOr {
  export type Input = TypeSchemaUnion[]
  export type Sample = SchemaOr<any, any>
  export type Extract<
    T extends Sample,
    TMode extends 'input' | 'output',
    U = ExtractArrayLike<T, TMode>
  > = U[keyof U] extends never ? any : U[keyof U]
}
