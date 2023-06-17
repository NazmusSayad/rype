import { ValidConstructor } from './utils-type'

class Core<TArgs = any, TRequired extends boolean = any> {
  args: TArgs
  required: TRequired

  constructor(args: TArgs, required: TRequired) {
    this.args = args
    this.required = required
  }
}

export class TypeString<
  const T = string[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeString' as const
  check(input: unknown) {
    if (this.args) {
    }
  }
}

export class TypeNumber<
  const T = number[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeNumber' as const
  check(input: unknown) {}
}

export class TypeBoolean<
  const T = boolean[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeBoolean' as const
  check(input: unknown) {}
}

export class TypeTuple<
  const T extends readonly SchemaAndPrimitives[] = readonly SchemaAndPrimitives[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeTuple' as const
  check(input: unknown) {}
}

export class TypeArray<
  const T extends SchemaAndPrimitives[] = SchemaAndPrimitives[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeArray' as const
  check(input: unknown) {}
}

export class TypeConstructor<
  const T = ValidConstructor,
  U extends boolean = any
> extends Core<T, U> {
  name = 'TypeInstance' as const
  check(input: unknown) {}
}

// Types:
export type primitiveValues = string | number | boolean
export type Base = typeof Core
export type Primitive = TypeString | TypeNumber | TypeBoolean

export type Array = TypeArray | TypeTuple
export type Object = { [i: string]: Schema }
export type Refference = Array | Object | TypeConstructor

export type Schema = Primitive | Refference
export type SchemaAndPrimitives = Schema | primitiveValues
