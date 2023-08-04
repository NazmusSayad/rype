import checkType from './checkType'
import * as TType from './Type-type'
import { ExtractSchema } from './Extract-type'
import { combineForTwoArgs } from './utils'

// Default call (typeCheck: 0, throwError: 1)
function defaultDual<TSchema extends TType.Schema>(
  schema: TSchema,
  input: unknown,
  name?: string
) {
  return checkType(schema, input, { name })
}
function defaultSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function (input: unknown, name?: string) {
    return defaultDual(schema, input, name)
  }
}

// Check All (typeCheck: 1, throwError: 1)
function typeCheckDual<
  TSchema extends TType.Schema,
  TInput extends ExtractSchema<TSchema>
>(schema: TSchema, input: TInput, name?: string) {
  return checkType(schema, input, { name })
}
function typeCheckSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function <TInput extends ExtractSchema<TSchema>>(
    input: TInput,
    name?: string
  ) {
    return typeCheckDual(schema, input, name)
  }
}

// Only Check Type (typeCheck: 1, throwError: 0)
function noErrorDual<
  TSchema extends TType.Schema,
  TInput extends ExtractSchema<TSchema>
>(schema: TSchema, input: TInput, name?: string) {
  return checkType(schema, input, { throw: false, name })
}
function noErrorSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function <TInput extends ExtractSchema<TSchema>>(
    input: TInput,
    name?: string
  ) {
    return noErrorDual(schema, input, name)
  }
}

// Check noting (typeCheck: 0, throwError: 0)
function noCheckDual<TSchema extends TType.Schema>(
  schema: TSchema,
  input: unknown,
  name?: string
) {
  return checkType(schema, input, { throw: false, name })
}
function noCheckSingle<TSchema extends TType.Schema>(schema: TSchema) {
  return function (input: unknown, name?: string) {
    return noCheckDual(schema, input, name)
  }
}

export const base = combineForTwoArgs(defaultSingle, defaultDual)
const typeCheck = combineForTwoArgs(typeCheckSingle, typeCheckDual)
const noError = combineForTwoArgs(noErrorSingle, noErrorDual)
const noCheck = combineForTwoArgs(noCheckSingle, noCheckDual)

export const methods = { typeCheck, noError, noCheck }
