import * as Type from './Type'
import * as TType from './Type-type'
import { LTypeExtract } from './Extract-type'
import { RypeError } from './Error'

export default function <S extends TType.Schema>(
  schema: S,
  input: unknown,
  throwError: boolean
): LTypeExtract<S> {
  return Type.TypeBase.check(input, schema, {
    path: '',
    throw: throwError,
  }) as any

  /* function parse(
    input: unknown,
    schema: TType.Schema,
    path: string = '',
    tempThrowError = true
  ): any {
    const needToThrowError = throwError && tempThrowError
    console.log(needToThrowError, needToThrowError)

    if (schema instanceof Type.TypePrimitive) {
      return schema.check(input, { path, throw: needToThrowError })
    }

    if (schema instanceof Type.TypeConstructor) {
      return schema.check(input, { path, throw: needToThrowError })
    }

    if (schema instanceof Type.TypeTuple || schema instanceof Type.TypeArray) {
      return schema.check(input, {
        path,
        throw: needToThrowError,
        parser(input, schema, index) {
          return parse(input, schema, path + index)
        },
      })
    }
  }

  return parse(input, schema) */
}
