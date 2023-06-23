import base from './base'
import typeMethods from './typeMethods'
import { combine } from './utils'

export const r = combine(base, typeMethods)

export const string = typeMethods.string()
export const number = typeMethods.number()
export const boolean = typeMethods.boolean()
export const tuple = typeMethods.tuple()
export const array = typeMethods.array()
export const optionalString = typeMethods.optional.string()
export const optionalNumber = typeMethods.optional.number()
export const optionalBoolean = typeMethods.optional.boolean()
export const optionalTuple = typeMethods.optional.tuple()
export const optionalArray = typeMethods.optional.array()
export const oString = typeMethods.optional.string()
export const oNumber = typeMethods.optional.number()
export const oBoolean = typeMethods.optional.boolean()
export const oTuple = typeMethods.optional.tuple()
export const oArray = typeMethods.optional.array()

export default r
export * from './Type'
export * from './Type-type'
export * from './Extract-type'
