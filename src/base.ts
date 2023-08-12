import check from './check'
import * as Type from './core/Schema.type'
import { ExtractSchema } from './core/Extract.type'
import { combineForTwoArgs } from './utils'
import { SchemaInput } from './types'

function create<TThrow extends boolean, TTypeCheck extends boolean>({
  throwError,
  typeCheck: _,
}: {
  throwError: TThrow
  typeCheck: TTypeCheck
}) {
  function dual<T extends Type.Types>(
    schema: T,
    input: TTypeCheck extends true ? SchemaInput<T> : unknown,
    name?: string
  ) {
    return check(schema, input, {
      path: name,
      throw: throwError,
    }) as ExtractSchema<T>
  }

  function single<T extends Type.Types>(schema: T) {
    return function (
      input: TTypeCheck extends true ? SchemaInput<T> : unknown,
      name?: string
    ) {
      return dual(schema, input, name)
    }
  }

  return { dual, single }
}

const checkAll = create({ throwError: true, typeCheck: true })
const noCheck = create({ throwError: false, typeCheck: false })
const justThrow = create({ throwError: true, typeCheck: false })
const justType = create({ throwError: false, typeCheck: true })

export const caller = combineForTwoArgs(justThrow.single, checkAll.dual)
export const moreCaller = {
  checkAll: combineForTwoArgs(checkAll.single, checkAll.dual),
  noCheck: combineForTwoArgs(noCheck.single, noCheck.dual),
  justThrow: combineForTwoArgs(justThrow.single, justThrow.dual),
  justType: combineForTwoArgs(justType.single, justType.dual),
}
