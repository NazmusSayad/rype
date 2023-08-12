import schema from './methods'
import { caller, moreCaller } from './base'
import { combine } from './utils'

export const r = combine(caller, { ...schema, ...moreCaller })
export default r

export * from './core/Schema'
export * from './core/symbols'
export * from './core/Extract.type'
export * from './core/Schema.type'

export * from './Error'
export * from './RypeOk'
export * from './types'
