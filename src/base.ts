import check from './check'
import { OptionalValueToUndefined } from './types'
import * as Type from './core/Schema.type'
import { combineForTwoArgs } from './utils'

function create<TThrow extends boolean, TTypeCheck extends boolean>({
  throwError,
  typeCheck: _,
}: {
  throwError: TThrow
  typeCheck: TTypeCheck
}) {
  function dual<T extends Type.Types>(
    schema: T,
    input: TTypeCheck extends true ? OptionalValueToUndefined<T> : unknown,
    name?: string
  ) {
    return check(schema, input, {
      path: name,
      throw: throwError,
    })
  }

  function single<T extends Type.Types>(schema: T) {
    return function (
      input: TTypeCheck extends true ? OptionalValueToUndefined<T> : unknown,
      name?: string
    ) {
      return dual(schema, input, name)
    }
  }

  return { dual, single, combined: combineForTwoArgs(single, dual) }
}

const checkAll = create({ throwError: true, typeCheck: true })
const noCheck = create({ throwError: false, typeCheck: false })
const justThrow = create({ throwError: true, typeCheck: false })
const justType = create({ throwError: false, typeCheck: true })

export const caller = combineForTwoArgs(justThrow.single, checkAll.dual)
export const moreCaller = {
  checkAll: checkAll.combined,
  noCheck: noCheck.combined,
  justThrow: justThrow.combined,
  justType: justType.combined,
}
