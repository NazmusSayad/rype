import { RypeError, RypeRequiredError, RypeTypeError } from './Error'
import { Schema } from './Type-type'
import { ValidConstructor } from './utils-type'
type CheckConf = { path: string; throw: boolean; meta?: boolean }

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

  checkType(input: unknown, conf: CheckConf) {}
  #check(input: unknown, conf: CheckConf) {
    if (!this.required && !input) return
    if (input == null)
      return this.getRErr(`${conf.path || 'Input'} is required`)
    return this.checkType(input, conf)
  }
  check(input: unknown, conf: CheckConf) {
    const output = this.#check(input, conf)
    if (!(output instanceof RypeError) || conf.meta) return output
    if (conf.throw) throw output
  }

  static check(input: unknown, schema: Schema, conf: CheckConf): unknown {
    console.log(schema instanceof TypeOr, 'wh')
    if (schema instanceof TypeOr) {
      // return new RypeError('working on it')
    }

    if (schema instanceof TypePrimitive) {
      return schema.check(input, conf)
    }

    if (schema instanceof TypeConstructor) {
      return schema.check(input, conf)
    }

    if (schema instanceof TypeTuple || schema instanceof TypeArray) {
      return schema.check(input, conf)
    }
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
  checkType(input: unknown, conf: CheckConf) {
    if (typeof input !== this.name) {
      return this.getErr(
        `Input need to a ${this.name} not ${typeof input}(${input}) at ${
          conf.path
        }`
      )
    }

    const args = this.args as any[]
    if (args.length && !args.includes(input as any)) {
      return this.getErr(
        `Input '${input}' at ${conf.path} is not kasdjfksadf for type (${args
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
  checkType(input: unknown, conf: CheckConf) {
    const args = this.args as any[]
    const constructorNames = args.map((a) => a.name)
    const matched = args.some((constructor) => {
      return input instanceof constructor
    })

    // Fixme:
    return matched
      ? input
      : this.getErr(
          `Input needs to be an instance of (${constructorNames.join(' | ')})${
            conf.path && ` at ${conf.path}`
          }`
        )
  }
}

export class TypeTuple<
  const T extends readonly Schema[] = readonly Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'tuple' as const
  checkType(input: unknown[], conf: CheckConf) {
    if (this.args.length !== input.length) {
      return this.getErr(
        `Input length need to be as same as schema length: ${this.args.length}`
      )
    }

    const result = []
    for (let i = 0; i <= this.args.length - 1; i++) {
      const inputElement = input[i]
      const argsElement = this.args[i]
      result.push(
        TypeBase.check(inputElement, argsElement, {
          ...conf,
          path: `${conf.path}[tuple:${i}]`,
        })
      )
    }

    return result
  }
}

export class TypeArray<
  const T extends Schema[] = Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'array' as const
  checkType(inputs: unknown[], conf: CheckConf) {
    const types = this.args.map((a) => a.name).join(' | ')
    const isInputMatched = (input: unknown, path: string) => {
      for (let schema of this.args) {
        const result = TypeBase.check(input, schema, {
          ...conf,
          path,
          meta: true,
        })
        if (!(result instanceof RypeError)) return true
      }

      return false
    }

    const result = []
    for (let i = 0; i <= inputs.length - 1; i++) {
      const input = inputs[i]
      const path = `${conf.path}[array:${i}]`

      if (this.args.length && !isInputMatched(input, path)) {
        return this.getErr(
          `Input: '${input}' at ${path} needs to be typof ${types}`
        )
      }

      result.push(input)
    }

    return result
  }
}

export class TypeOr<
  const T extends Schema[] = Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'or' as const
}
