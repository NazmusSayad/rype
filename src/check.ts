import * as Type from './core/Schema.type'
import { CheckConf } from './types'

export default function (
  schema: Type.Types,
  input: unknown,
  conf: Partial<CheckConf>
): unknown {
  return schema.check(input, {
    ...conf,
    path: conf.path || '',
    throw: conf.throw ?? true,
  })
}
