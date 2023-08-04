import * as Type from './Type'
import * as TType from './Type-type'
import { ExtractSchema } from './Extract-type'

export default function <S extends TType.Schema>(
  schema: S,
  input: unknown,
  conf: { name?: string; throw?: boolean }
) {
  return Type.TypeBase.check(input, schema, {
    path: conf.name || '',
    throw: conf.throw ?? true,
  }) as ExtractSchema<S>
}
