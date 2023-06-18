import { RypeError, RypeRequiredError, RypeTypeError } from './Error'
import { Schema } from './Type-type'
import { ValidConstructor } from './utils-type'
type CheckTypeOptions = {
  path?: string
  handler?(msg: any): {}
  arrayLikeParser?(input: unknown, schema: Schema, index: number): void
}

export class TypeBase<TArgs = any, TRequired extends boolean = any> {
  args: TArgs
  required: TRequired
  name = 'base'

  getErr(message: string) {
    return new RypeTypeError(message, this.args as any, this.required)
  }

  getRErr(message: string) {
    return new RypeRequiredError(message, this.args as any, this.required)
  }

  checkType(input: unknown, opt: CheckTypeOptions) {}

  check(input: unknown, opt: CheckTypeOptions = {}) {
    if (!this.required && !input) return
    if (input == null) return this.getRErr(`${opt.path || 'Input'} is required`)
    return this.checkType(input, { ...opt })
  }

  constructor(args: TArgs, required: TRequired) {
    this.args = args
    this.required = required
  }
}

export class TypePrimitive<const T, U extends boolean = any> extends TypeBase<
  T,
  U
> {
  checkType(input: unknown, opt: CheckTypeOptions) {
    if (typeof input !== this.name) {
      return this.getErr(
        `Input need to a ${this.name} not ${typeof input}(${input})`
      )
    }

    const args = this.args as any[]
    if (args.length && !args.includes(input as any)) {
      return this.getErr(
        `Input '${input}' is not kasdjfksadf for type (${args
          .map((i) => `'${i}'`)
          .join(' | ')})`
      )
    }

    return input
  }
}

export class TypeString<
  const T = string[],
  U extends boolean = any
> extends TypePrimitive<T, U> {
  name = 'string' as const
}

export class TypeNumber<
  const T = number[],
  U extends boolean = any
> extends TypePrimitive<T, U> {
  name = 'number' as const
}

export class TypeBoolean<
  const T = boolean[],
  U extends boolean = any
> extends TypePrimitive<T, U> {
  name = 'boolean' as const
}

export class TypeConstructor<
  const T = ValidConstructor[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'instance' as const
  checkType(input: unknown) {
    const args = this.args as any[]
    const constructorNames = args.map((a) => a.name)
    const matched = args.some((constructor) => {
      return input instanceof constructor
    })

    return matched
      ? input
      : this.getErr(
          `Input needs to be an instance of (${constructorNames.join(' | ')})`
        )
  }
}

export class TypeTuple<
  const T extends readonly Schema[] = readonly Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'tuple' as const
  checkType(input: unknown[], opt: CheckTypeOptions) {
    if (this.args.length !== input.length) {
      return this.getErr(
        `Input length need to be as same as schema length: ${this.args.length}`
      )
    }

    const result = []
    for (let i = 0; i <= this.args.length - 1; i++) {
      const inputElement = input[i]
      const argsElement = this.args[i]
      const parser = opt.arrayLikeParser!
      result.push(parser(inputElement, argsElement, i))
    }

    return result
  }
}

export class TypeArray<
  const T extends Schema[] = Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'array' as const
  checkType(input: unknown[], opt: CheckTypeOptions) {
    // FIXME:
  }
}

export class TypeOr<
  const T extends Schema[] = Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'or' as const
  checkType(input: unknown[], opt: CheckTypeOptions) {}
}
