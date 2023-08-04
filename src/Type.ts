import { RypeError, RypeRequiredError, RypeTypeError } from './Error'
import { ObjectLike, Schema } from './Type-type'
import errorMessages from './errorMessages'
import { CheckConf } from './types'
import { ValidConstructor, ValidObject } from './utils-type'

export class TypeBase<TSchemaArgs = any, TRequired extends boolean = any> {
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
      const type = `object{${Object.keys(schema)}}`
      // :)

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
        if (output !== undefined) {
          result[key] = output
        }
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

  schema: TSchemaArgs
  required: TRequired
  name = 'base'

  getType(): any {
    return this.name
  }
  get type(): string {
    return [...new Set([this.getType()].flat())].join(' | ')
  }

  getErr(input: unknown, message: string) {
    return new RypeTypeError(message, input, this.schema as any, this.required)
  }

  getRErr(input: unknown, message: string) {
    return new RypeRequiredError(
      message,
      input,
      this.schema as any,
      this.required
    )
  }

  checkType(input: unknown, conf: CheckConf) {
    return (this.name + " isn't implemented yet!") as any
  }

  #check(input: unknown, conf: CheckConf) {
    if (!this.required && !input) return
    if (input == null)
      return this.getRErr(
        input,
        errorMessages.requiredError.replace(
          ':PATH:',
          conf.path || conf.name || 'Input'
        )
      )
    return this.checkType(input, conf)
  }

  check(input: unknown, conf: CheckConf) {
    const output = this.#check(input, conf)
    if (!(output instanceof RypeError) || conf.meta) return output
    if (conf.throw) throw output
  }
}

export class TypePrimitive<const T, U extends boolean = any> extends TypeBase<
  T,
  U
> {
  getType() {
    return (this.schema as any[]).length ? this.schema : this.name
  }

  checkType(input: unknown, conf: CheckConf) {
    const schema = this.schema as any[]

    if (
      typeof input !== this.name ||
      (schema.length && !schema.includes(input as any))
    ) {
      return this.getErr(
        input,
        errorMessages.primitiveTypeError
          .replace(':INPUT:', input as string)
          .replace(':TYPE:', this.name)
          .replace(':PATH:', conf.path)
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

    return matched
      ? input
      : this.getErr(
          input,
          errorMessages.unknownInstanceError
            .replace(':CONSTRUCTOR:', constructorNames.join(' | '))
            .replace(':PATH:', conf.path)
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
        input,
        errorMessages.tupleLengthError.replace(
          ':LENGTH:',
          this.schema.length.toString()
        )
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
  name = 'or[...]' as const

  getType() {
    return this.schema.map((schema) => {
      if (schema instanceof TypeBase) return schema.type
      return `object{${Object.keys(schema)}}`
    })
  }

  checkType(input: unknown, conf: CheckConf) {
    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]
      const output = TypeBase.check(input, schema, {
        ...conf,
        meta: true,
      })
      if (!(output instanceof RypeError)) return output
    }

    return this.getErr(
      input,
      errorMessages.orTypeError
        .replace(':TYPE:', this.type)
        .replace(':PATH:', conf.path)
    )
  }
}
