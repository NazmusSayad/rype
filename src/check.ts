import * as Type from './core/Schema.type'
import { ExtractSchema } from './index'
import { SchemaCheckConf } from './types'

export default function <T extends Type.Types>(
  schema: T,
  input: unknown,
  conf: Partial<SchemaCheckConf>
) {
  return schema._checkAndGetResult(input, {
    ...conf,
    path: conf.path || '',
    throw: conf.throw ?? true,
  }) as ExtractSchema<T>
}
