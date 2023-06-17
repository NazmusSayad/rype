import * as Type from './Type'
import * as TType from './Type-type'
import { LTypeExtract } from './Extract-type'

function isPrimitiveSchema<T>(schema: T) {
  return (
    schema instanceof Type.TypeString ||
    schema instanceof Type.TypeNumber ||
    schema instanceof Type.TypeBoolean
  )
}

export default function <S extends TType.Schema>(
  schema: S,
  input: unknown,
  throwError: boolean
): LTypeExtract<S> {
  function parsePrimitive(
    input: unknown,
    schema: TType.primitiveValues | TType.Primitive
  ) {
    if (isPrimitiveSchema(schema)) {
      return schema.check(input)
    }
  }

  function parse(input: unknown, schema: TType.Schema) {
    schema instanceof Type.TypeString
  }

  if (isPrimitiveSchema(schema)) return parsePrimitive(input, schema)

  return {} as any
}
