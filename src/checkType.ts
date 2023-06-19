import * as Type from './Type'
import * as TType from './Type-type'
import { LTypeExtract } from './Extract-type'

export default function <S extends TType.Schema>(
  schema: S,
  input: unknown,
  throwError: boolean
): LTypeExtract<S> {
  return Type.TypeBase.check(input, schema, {
    path: '',
    throw: throwError,
  }) as any
}
