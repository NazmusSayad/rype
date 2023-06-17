import { Schema, SchemaAndPrimitives } from './Type-type'
import { ValidConstructor } from './utils-type'

export class TypeBase<TArgs = any, TRequired extends boolean = any> {
  args: TArgs
  required: TRequired

  get<TOk extends boolean, const TResult, const TError>(
    ok: TOk,
    output: TOk extends true ? TResult : TError
  ) {
    return {
      ok,
      error: ok ? undefined : output,
      result: ok ? output : undefined,
      instance: { args: this.args, required: this.required },
    } as {
      ok: TOk
      instance: { args: TArgs; required: TRequired }
    } & TOk extends true
      ? { result: TResult; error: undefined }
      : { error: TError; result: undefined }
  }

  constructor(args: TArgs, required: TRequired) {
    this.args = args
    this.required = required
  }
}

export class TypeString<
  const T = string[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'LTypeString' as const
  check(input: unknown) {
    if (!this.required && !input) return this.get(true, '')
    if (input == null) return this.get(false, 'This is required')
    if (typeof input !== 'string') return this.get(false, 'This must be string')

    const args = this.args as string[]
    if (args.length && !args.includes(input as string)) {
      return this.get(false, 'KDSJFLDKSjfLSDf')
    }

    return this.get(true, input)
  }
}

export class TypeNumber<
  const T = number[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'LTypeNumber' as const
  check(input: unknown) {}
}

export class TypeBoolean<
  const T = boolean[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'LTypeBoolean' as const
  check(input: unknown) {}
}

export class TypeTuple<
  const T extends readonly SchemaAndPrimitives[] = readonly SchemaAndPrimitives[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'LTypeTuple' as const
  check(input: unknown) {}
}

export class TypeArray<
  const T extends SchemaAndPrimitives[] = SchemaAndPrimitives[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'LTypeArray' as const
  check(input: unknown) {}
}

export class TypeAny<
  const T extends Schema[] = Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'TypeAny' as const
  check(input: unknown) {}
}

export class TypeConstructor<
  const T = ValidConstructor[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'TypeConstructor' as const
  check(input: unknown) {}
}
