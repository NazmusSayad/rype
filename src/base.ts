import * as TType from './Type-type'
import { LTypeExtract } from './Extract-type'
import checkType from './checkType'
import { combineForTwoArgs } from './utils'

function baseDual<
  TInput extends LTypeExtract<TSchema>,
  TSchema extends TType.Schema
>(input: TInput, schema: TSchema) {
  return checkType(schema, input, true)
}
function baseSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function <TInput extends LTypeExtract<TSchema>>(input: TInput) {
    return baseDual(input, schema)
  }
}

function noTypeDual<TSchema extends TType.Schema>(
  input: unknown,
  schema: TSchema
) {
  return checkType(schema, input, true)
}
function noTypeSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function (input: unknown) {
    return noTypeDual(input, schema)
  }
}

function noErrorDual<
  TInput extends LTypeExtract<TSchema>,
  TSchema extends TType.Schema
>(input: TInput, schema: TSchema) {
  return checkType(schema, input, false)
}
function noErrorSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function <TInput extends LTypeExtract<TSchema>>(input: TInput) {
    return noErrorDual(input, schema)
  }
}

function noCheckDual<TSchema extends TType.Schema>(
  input: unknown,
  schema: TSchema
) {
  return checkType(schema, input, false)
}
function noCheckSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function (input: unknown) {
    return noCheckDual(input, schema)
  }
}

const noType = combineForTwoArgs(noTypeSingle, noTypeDual)
const noError = combineForTwoArgs(noErrorSingle, noErrorDual)
const noCheck = combineForTwoArgs(noCheckSingle, noCheckDual)

export const base = combineForTwoArgs(baseSingle, baseDual)
export const methods = { noType, noError, noCheck }
