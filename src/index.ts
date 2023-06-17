import base from './base'
import typeMethods from './typeMethods'
import { combine } from './utils'

const r = combine(base, typeMethods)
export { r }
export default r

export * from './Type'
export * from './Type-type'
export * from './Extract-type'
