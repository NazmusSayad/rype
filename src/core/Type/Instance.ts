import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import messages from '../../errorMessages'
import { SchemaCore } from '../SchemaCore'
import { ValidObject } from '../../utils.type'
import { SchemaCheckConf, SchemaConfig } from '../../types'

export class SchemaInstance<
  T extends InputInstance,
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

export type InputInstance = new (...args: any[]) => any

export type TypeInstance = SchemaInstance<any, any>

export type ExtractInstance<T extends TypeInstance> = InstanceType<T['schema']>
