import types from './methods'
import { combine } from './utils'
import { caller, moreCaller } from './base'

export const r = combine(caller, { ...types, ...moreCaller })
export default r

export * from './core/Schema'
export * from './core/symbols'
export * from './core/Extract.type'
export * from './core/Schema.type'

export * from './Error'
export * from './RypeOk'
export * from './types'

export * from './env'
