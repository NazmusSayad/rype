import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import { SchemaCore } from '../SchemaCore'
import { ValidObject } from '../../utils.type'
import { SchemaCheckConf, SchemaConfig } from '../../config'

export class SchemaFixed<
  T extends SchemaFixed.Input,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = 'fixed' as const;

  ['~checkType'](
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    return new RypeOk(this.schema)
  }
}

export module SchemaFixed {
  export type Input = any
  export type Sample = SchemaFixed<any, any>
  export type Extract<
    T extends Sample,
    TMode extends 'input' | 'output'
  > = TMode extends 'input' ? never | null | undefined : T['schema']
}
