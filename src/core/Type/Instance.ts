import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import messages from '../../errorMessages'
import { SchemaCore } from '../SchemaCore'
import { ValidObject } from '../../utils.type'
import { SchemaCheckConf, SchemaConfig } from '../../config'

export class SchemaInstance<
  T extends SchemaInstance.Input,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = 'instance' as const;

  ['~getType']() {
    return [this.schema.name]
  }

  ['~checkType'](
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    if (input instanceof this.schema) {
      return new RypeOk(input)
    }

    return this['~getErr'](
      input,
      messages.getInstanceErr(conf.path, { Instance: this.type })
    )
  }
}

export module SchemaInstance {
  export type Input = new (...args: any[]) => any
  export type Sample = SchemaInstance<any, any>
  export type Extract<T extends Sample> = InstanceType<
    T['schema']
  >
}
