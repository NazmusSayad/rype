import * as LT from './LType'
import { LTypeExtract } from './LTypeExtract-type'

export default function <S extends LT.Schema>(
  schema: S,
  input: unknown,
  throwError: boolean
): LTypeExtract<S> {
  return {} as any
}
