import * as Type from './core/Schema.type'
import { ExtractSchema } from './index'
import { CheckConf } from './types'

export default function <T extends Type.Types>(
  schema: T,
  input: unknown,
  conf: Partial<CheckConf>
): ExtractSchema<T> {
  return schema.check(input, {
    ...conf,
    path: conf.path || '',
    throw: conf.throw ?? true,
  })
}
