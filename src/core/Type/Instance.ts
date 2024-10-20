import messages from '@/errorMessages'
import { ValidObject } from '@/utils.type'
import { SchemaCore } from '@/core/SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '@/config'

export class SchemaInstance<
  T extends SchemaInstance.Input,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  protected name = 'instance' as const

  protected getType() {
    return [this.schema.name]
  }

  protected checkTypeOnly(input: ValidObject, conf: SchemaCheckConf) {
    if (!(input instanceof this.schema)) {
      return this.getErr(
        input,
        messages.getInstanceErr(conf.path, { Instance: this.type })
      )
    }
  }
}

export namespace SchemaInstance {
  export type Input = new (...args: any[]) => any
  export type Sample = SchemaInstance<any, any>
  export type Extract<T extends Sample> = InstanceType<T['schema']>
}
