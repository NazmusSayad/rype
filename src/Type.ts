import { RypeError, RypeRequiredError, RypeTypeError } from './Error'
import { ObjectLike, Schema } from './Type-type'
import { ValidConstructor, ValidObject } from './utils-type'
type CheckConf = { path: string; throw: boolean; meta?: boolean }

export class TypeBase<TSchemaArgs = any, TRequired extends boolean = any> {
  schema: TSchemaArgs
  required: TRequired
  name = 'base'

  getErr(message: string) {
    return new RypeTypeError(message, this.schema as any, this.required)
  }

  getRErr(message: string) {
    return new RypeRequiredError(message, this.schema as any, this.required)
  }

  checkType(input: unknown, conf: CheckConf) {
    return (this.name + " isn't implemented yet!") as any
  }

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
    if (input instanceof RypeError) return

    if (schema instanceof TypeBase) {
      return schema.check(input, conf)
    }
    return TypeBase.checkObject(input, schema, conf)
  }

  static checkObject(
    inputObject: unknown,
    schema: ObjectLike,
    conf: CheckConf
  ) {
    function getResult() {
      const result: any = {}

      for (let key in schema) {
        const nestedSchema = schema[key]
        const nestedInput = (inputObject as ValidObject)[key]
        const output = TypeBase.check(nestedInput, nestedSchema, {
          ...conf,
          meta: true,
          path: `${conf.path || 'object'}.${key}`,
        })

        if (output instanceof RypeError) return output
        result[key] = output
      }

      return result
    }

    const result = getResult()
    if (!(result instanceof RypeError) || conf.meta) return result
    if (conf.throw) throw result
    return {}
  }

  constructor(schema: TSchemaArgs, required: TRequired) {
    this.schema = schema
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
        `Input need to a ${this.name} not ${typeof input}(${JSON.stringify(
          input
        )}) at ${conf.path}`
      )
    }

    const schema = this.schema as any[]
    if (schema.length && !schema.includes(input as any)) {
      return this.getErr(
        `Input '${input}' at ${conf.path} is not kasdjfksadf for type (${schema
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
    const schema = this.schema as any[]
    const constructorNames = schema.map((a) => a.name)
    const matched = schema.some((constructor) => {
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
    if (this.schema.length !== input.length) {
      return this.getErr(
        `Input length need to be as same as schema length: ${this.schema.length}`
      )
    }

    const result = []
    for (let i = 0; i <= this.schema.length - 1; i++) {
      const inputElement = input[i]
      const argsElement = this.schema[i]
      result.push(
        TypeBase.check(inputElement, argsElement, {
          ...conf,
          path: `${conf.path}tuple:[${i}]`,
        })
      )
    }

    return result
  }
}

export class TypeArray<
  const T extends Schema | TypeOr = Schema | TypeOr,
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'array' as const
  checkType(inputs: unknown[], conf: CheckConf) {
    const result = []

    for (let i = 0; i <= inputs.length - 1; i++) {
      const input = inputs[i]
      const path = `${conf.path}array[${i}]`
      const output = TypeBase.check(input, this.schema, {
        ...conf,
        meta: true,
        path,
      })

      if (output instanceof RypeError) return output.message
      result.push(output)
    }

    return result
  }
}

export class TypeOr<
  const T extends readonly Schema[] = readonly Schema[],
  U extends boolean = any
> extends TypeBase<T, U> {
  name = 'or' as const
}
