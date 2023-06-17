import * as LT from './LType'
import { LTypeExtract } from './Extract-type'
import checkType from './checkType'
import { combine, combineForTwoArgs } from './utils'

function baseDual<
  TInput extends LTypeExtract<TSchema>,
  TSchema extends LT.Schema
>(input: TInput, schema: TSchema) {
  return checkType(schema, input, true)
}
function baseSingle<TSchema extends LT.Schema>(schema: TSchema) {
  return function <TInput extends LTypeExtract<TSchema>>(input: TInput) {
    return baseDual(input, schema)
  }
}

function noErrorDual<
  TInput extends LTypeExtract<TSchema>,
  TSchema extends LT.Schema
>(input: TInput, schema: TSchema) {
  return checkType(schema, input, false)
}
function noErrorSingle<TSchema extends LT.Schema>(schema: TSchema) {
  return function <TInput extends LTypeExtract<TSchema>>(input: TInput) {
    return noErrorDual(input, schema)
  }
}

function noTypeDual<TSchema extends LT.Schema>(
  input: unknown,
  schema: TSchema
) {
  return checkType(schema, input, true)
}
function noTypeSingle<TSchema extends LT.Schema>(schema: TSchema) {
  return function (input: unknown) {
    return noTypeDual(input, schema)
  }
}

function noCheckDual<TSchema extends LT.Schema>(
  input: unknown,
  schema: TSchema
) {
  return checkType(schema, input, false)
}
function noCheckSingle<TSchema extends LT.Schema>(schema: TSchema) {
  return function (input: unknown) {
    return noCheckDual(input, schema)
  }
}

const base = combineForTwoArgs(baseSingle, baseDual)
const noError = combineForTwoArgs(noErrorSingle, noErrorDual)
const noType = combineForTwoArgs(noTypeSingle, noTypeDual)
const noCheck = combineForTwoArgs(noCheckSingle, noCheckDual)
export default combine(base, { noError, noType, noCheck })
