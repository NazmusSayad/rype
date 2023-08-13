import { SchemaCheckConf } from './types'
import * as Type from './core/Schema.type'
import { ExtractSchema } from './core/Extract.type'

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
