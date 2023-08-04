import * as TType from './Type-type'
import { ExtractType } from './Extract-type'
import checkType from './checkType'
import { combineForTwoArgs } from './utils'

function baseDual<
  TInput extends ExtractType<TSchema>,
  TSchema extends TType.Schema
>(input: TInput, schema: TSchema) {
  return checkType(schema, input, {})
}
function baseSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function <TInput extends ExtractType<TSchema>>(input: TInput) {
    return baseDual(input, schema)
  }
}

function noTypeDual<TSchema extends TType.Schema>(
  input: unknown,
  schema: TSchema
) {
  return checkType(schema, input, {})
}
function noTypeSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function (input: unknown) {
    return noTypeDual(input, schema)
  }
}

function noErrorDual<
  TInput extends ExtractType<TSchema>,
  TSchema extends TType.Schema
>(input: TInput, schema: TSchema) {
  return checkType(schema, input, { throw: false })
}
function noErrorSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function <TInput extends ExtractType<TSchema>>(input: TInput) {
    return noErrorDual(input, schema)
  }
}

function noCheckDual<TSchema extends TType.Schema>(
  input: unknown,
  schema: TSchema
) {
  return checkType(schema, input, { throw: false })
}
function noCheckSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function (input: unknown) {
    return noCheckDual(input, schema)
  }
}

export const base = combineForTwoArgs(baseSingle, baseDual)
const noType = combineForTwoArgs(noTypeSingle, noTypeDual)
const noError = combineForTwoArgs(noErrorSingle, noErrorDual)
const noCheck = combineForTwoArgs(noCheckSingle, noCheckDual)

export const methods = { noType, noError, noCheck }
