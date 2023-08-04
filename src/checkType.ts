import * as Type from './Type'
import * as TType from './Type-type'
import { ExtractType } from './Extract-type'
import { CheckConf } from './types'

export default function <S extends TType.Schema>(
  schema: S,
  input: unknown,
  conf: Partial<Pick<CheckConf, 'path' | 'name' | 'throw'>>
): ExtractType<S> {
  return Type.TypeBase.check(input, schema, {
    path: '',
    name: '',
    throw: true,
    ...conf,
  }) as any
}
