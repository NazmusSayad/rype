export class Core<TArgs = any, TRequired extends boolean = any> {
  args: TArgs
  required: TRequired

  constructor(args: TArgs, required: TRequired) {
    this.args = args
    this.required = required
  }
}

export class LTypeString<const T = string[], U extends boolean = any> extends Core<
  T,
  U
> {
  name = 'LTypeString' as const
  check(input: unknown) {
    if (this.args) {
    }
  }
}

export class LTypeNumber<const T = number[], U extends boolean = any> extends Core<
  T,
  U
> {
  name = 'LTypeNumber' as const
  check(input: unknown) {}
}

export class LTypeBoolean<
  const T = boolean[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeBoolean' as const
  check(input: unknown) {}
}

export class LTypeTuple<
  const T extends readonly any[] = readonly any[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeTuple' as const
  check(input: unknown) {}
}

export class LTypeArray<
  const T extends any[] = any[],
  U extends boolean = any
> extends Core<T, U> {
  name = 'LTypeArray' as const
  check(input: unknown) {}
}

// Types:
export type Primitive = LTypeString | LTypeNumber | LTypeBoolean
export type Array = LTypeArray | LTypeTuple
export type Object = { [i: string]: Schema }
export type Refference = Array | Object
export type Schema = Primitive | Refference
