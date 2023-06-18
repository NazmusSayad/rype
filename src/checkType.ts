import * as Type from './Type'
import * as TType from './Type-type'
import { LTypeExtract } from './Extract-type'
import { RypeError } from './Error'

export default function <S extends TType.Schema>(
  schema: S,
  input: unknown,
  throwError: boolean
): LTypeExtract<S> {
  function wrap(result: any) {
    if (!(result instanceof RypeError)) return result
    if (throwError) throw result
  }

  function parse(input: unknown, schema: TType.Schema): any {
    if (schema instanceof Type.TypePrimitive) {
      return wrap(schema.check(input))
    }

    if (schema instanceof Type.TypeConstructor) {
      return wrap(schema.check(input))
    }

    if (schema instanceof Type.TypeTuple || schema instanceof Type.TypeArray) {
      return wrap(
        schema.check(input, {
          arrayLikeParser(input, schema, index) {
            return parse(input, schema)
          },
        })
      )
    }
  }

  return parse(input, schema)
}
