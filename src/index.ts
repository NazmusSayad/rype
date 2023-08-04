import typeMethods from './typeMethods'
import { base, methods } from './base'
import { combine } from './utils'

export const r = combine(base, { ...typeMethods, ...methods })

export default r
export * from './env'
export * from './Type'
export * from './Error'

export * from './types'
export * from './Type-type'
export * from './Extract-type'
