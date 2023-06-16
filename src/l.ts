import * as LT from './LType'
import { LTypeExtract } from './LTypeExtract-type'
import checkType from './checkType'

function createSchema<TSchema extends LT.Schema>(schema: TSchema) {
  return function <TInput extends LTypeExtract<TSchema>>(input: TInput) {
    return checkType(schema, input)
  }
}

function createAndVerifySchema<
  TSchema extends LT.Schema,
  TInput extends LTypeExtract<TSchema>
>(schema: TSchema, target: TInput) {
  return checkType(schema, target)
}

export default (function (...args: any[]) {
  if (args.length === 0) throw new Error('')
  if (args.length === 1) return createSchema(args[0])
  if (args.length === 2) return createAndVerifySchema(args[0], args[1])
  throw new Error('')
} as typeof createSchema & typeof createAndVerifySchema)
