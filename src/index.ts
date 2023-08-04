import typeMethods from './typeMethods'
import { base, methods } from './base'
import { combine } from './utils'
import env from './env'

export const r = combine(base, { ...typeMethods, ...methods })

export const optionalString = typeMethods.optional.string()
export const optionalNumber = typeMethods.optional.number()
export const optionalBoolean = typeMethods.optional.boolean()
export const optionalTuple = typeMethods.optional.tuple()
export const optionalArray = typeMethods.optional.array()
export const string = typeMethods.string()
export const number = typeMethods.number()
export const boolean = typeMethods.boolean()
export const tuple = typeMethods.tuple()
export const array = typeMethods.array()
export const oString = optionalString
export const oNumber = optionalNumber
export const oBoolean = optionalBoolean
export const oTuple = optionalTuple
export const oArray = optionalArray

export { env }
export default r
export * from './Type'
export * from './Error'

export * from './Type-type'
export * from './Extract-type'
