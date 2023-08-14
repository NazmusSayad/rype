import { combineForTwoArgs } from './utils'
import * as Type from './core/Schema.type'
import { ExtractInput, ExtractOutput } from './core/Extract.type'

function create<TThrow extends boolean, TTypeCheck extends boolean>({
  throwError,
  typeCheck: _,
}: {
  throwError: TThrow
  typeCheck: TTypeCheck
}) {
  function dual<T extends Type.Types>(
    schema: T,
    input: TTypeCheck extends true ? ExtractInput<T> : unknown,
    name?: string
  ) {
    return schema._checkAndGetResult(input, {
      path: name || '',
      throw: throwError,
    }) as ExtractOutput<T>
  }

  function single<T extends Type.Types>(schema: T) {
    return function (
      input: TTypeCheck extends true ? ExtractInput<T> : unknown,
      name?: string
    ) {
      return dual(schema, input, name)
    }
  }

  return { dual, single, combined: combineForTwoArgs(single, dual) }
}

const checkAll = create({ throwError: true, typeCheck: true })
const noCheck = create({ throwError: false, typeCheck: false })
const onlyError = create({ throwError: true, typeCheck: false })
const onlyType = create({ throwError: false, typeCheck: true })

export const caller = combineForTwoArgs(onlyError.single, checkAll.dual)
export const moreCaller = {
  noCheck: noCheck.combined,
  checkAll: checkAll.combined,
  onlyType: onlyType.combined,
  onlyError: onlyError.combined,
}
