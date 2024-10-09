import { SchemaConfig } from '@/config'
import { SchemaPrimitiveCore } from '@/core/SchemaCore'

export class SchemaBoolean<
  T extends SchemaBoolean.Input,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? SchemaBoolean.Input : T,
  R
> {
  name = 'boolean' as const
}

export namespace SchemaBoolean {
  export type Input = boolean[]
  export type Sample = SchemaBoolean<any, any>
}
