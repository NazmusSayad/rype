import { SchemaConfig } from '../../config'
import { SchemaPrimitiveCore } from '../SchemaCore'

export class SchemaBoolean<
  T extends InputBoolean,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<T[number] extends never ? InputBoolean : T, R> {
  name = 'boolean' as const
}

export type InputBoolean = boolean[]
export type TypeBoolean = SchemaBoolean<any, any>
