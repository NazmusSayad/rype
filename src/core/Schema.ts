import * as symbols from './symbols'
import * as Type from './Schema.type'
import { RypeError, RypeTypeError } from '../Error'
import { RypeOk } from '../RypeOk'
import messages from '../errorMessages'
import { CheckConf } from '../types'
import { ValidObject } from '../utils.type'
import { ExtractSchema } from './Extract.type'

class SchemaCore<const T, R extends boolean> {
  name = 'core'
  args: T
  isRequired: R
  defaultValue = symbols.EMPTY as unknown

  default(
    value: typeof this extends Type.Types ? ExtractSchema<typeof this> : never
  ) {
    this.defaultValue = value
    return this
  }

  getType(): string[] {
    return [this.name]
  }

  get type(): string {
    return [...new Set([this.getType()].flat())].join(' | ')
  }

  getErr(input: unknown, message: string) {
    return new RypeTypeError(message, input, this.args, this.isRequired)
  }

  #check(input: unknown, conf: CheckConf): RypeOk | RypeError {
    if (input == null) {
      if (this.defaultValue !== symbols.EMPTY) {
        return new RypeOk(this.defaultValue)
      }

      if (!this.isRequired) return new RypeOk(undefined)
      return this.getErr(input, messages.getRequiredErr(conf.path, {}))
    }

    const result1 = this.checkType(input, conf)
    if (result1 instanceof RypeError) return result1
    if (this.checkType2) return this.checkType2(input, conf)
    return result1
  }

  check(input: unknown, conf: CheckConf) {
    const output = this.#check(input, conf)
    if (conf.meta) return output
    if (output instanceof RypeOk) return output.value
    if (conf.throw) throw output
  }

  checkType(input: unknown, conf: CheckConf): RypeOk | RypeError {
    return new RypeError(this.name + " isn't implemented yet!")
  }

  checkType2?: (input: unknown, conf: CheckConf) => RypeOk | RypeError

  constructor(args: T, isRequired: R) {
    this.args = args
    this.isRequired = isRequired
  }
}

class SchemaPrimitiveCore<
  T extends Type.InputString | Type.InputNumber | Type.InputBoolean,
  R extends boolean
> extends SchemaCore<T, R> {
  name = 'primitive'

  getType() {
    return this.args.length
      ? this.args.map((arg) => JSON.stringify(arg))
      : [this.name]
  }

  checkType(input: unknown, conf: CheckConf): RypeError | RypeOk {
    const schema = this.args

    if (
      typeof input !== this.name ||
      (schema.length && !schema.includes(input as never))
    ) {
      return this.getErr(
        input,
        messages.getPrimitiveTypeError(conf.path, {
          INPUT: JSON.stringify(input),
          TYPE: this.type,
        })
      )
    }

    return new RypeOk(input)
  }
}

export class SchemaString<
  T extends Type.InputString,
  R extends boolean
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputString : T,
  R
> {
  name = 'string' as const
}

export class SchemaNumber<
  T extends Type.InputNumber,
  R extends boolean
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputNumber : T,
  R
> {
  name = 'number' as const
}

export class SchemaBoolean<
  T extends Type.InputBoolean,
  R extends boolean
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputBoolean : T,
  R
> {
  name = 'boolean' as const
}

export class SchemaObject<
  T extends Type.InputObject,
  R extends boolean
> extends SchemaCore<T, R> {
  name = 'object' as const

  checkType(input: ValidObject, conf: CheckConf): RypeOk | RypeError {
    const output: ValidObject = {}

    for (let key in input) {
      const schema = this.args[key]
      const value = input[key]

      console.log(schema, value)

      const result = schema.check(value, {
        ...conf,
        path: `${conf.path || 'object'}.${key}`,
      })

      output[key] = result
    }

    return new RypeOk(output)
  }
}

export class SchemaArray<
  T extends Type.InputArray,
  R extends boolean
> extends SchemaCore<T, R> {
  name = 'array' as const

  checkType(inputs: unknown[], conf: CheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this.getErr(
        inputs,
        messages.getOrTypeErr(conf.path, { TYPE: this.type })
      )
    }

    for (let i = 0; i <= inputs.length - 1; i++) {
      const input = inputs[i]
      const path = `${conf.path}array[${i}]`

      const schema = new SchemaOr(this.args, true)
      schema.check(input, {
        ...conf,
        path,
      })
    }

    return new RypeOk(inputs)
  }
}

export class SchemaTuple<
  T extends Type.InputTuple,
  R extends boolean
> extends SchemaCore<T, R> {
  name = 'tuple' as const

  checkType(inputs: unknown[], conf: CheckConf): RypeOk | RypeError {
    if (this.args.length !== inputs.length) {
      return this.getErr(
        inputs,
        messages.getTupleLengthError(conf.path, {
          LENGTH: this.args.length.toString(),
        })
      )
    }

    const output: unknown[] = []
    for (let i = 0; i <= this.args.length - 1; i++) {
      const schema = this.args[i]
      const inputElement = inputs[i]

      output.push(
        schema.check(inputElement, {
          ...conf,
          path: `${conf.path || 'Tuple'}[${i}]`,
        })
      )
    }

    return new RypeOk(output)
  }
}

export class SchemaOr<
  T extends Type.InputOr,
  R extends boolean
> extends SchemaCore<T[number] extends never ? Type.InputOr : T, R> {
  name = 'or' as const

  getType() {
    return this.args.map((schema) => schema.type)
  }

  checkType(input: unknown, conf: CheckConf): RypeOk | RypeError {
    let isOk = false

    for (let i = 0; i <= this.args.length - 1; i++) {
      const schema = this.args[i]
      const result = schema.check(input, { ...conf, meta: true })

      if (!(result instanceof RypeError)) {
        isOk = true
        break
      }
    }

    return isOk
      ? new RypeOk(input)
      : this.getErr(
          input,
          messages.getOrTypeErr(conf.path, {
            TYPE: this.type,
          })
        )
  }
}

/* export class SchemaInstance<
  const T = Type.InputInstance[],
  U extends boolean = any
> extends SchemaCore<T, U> {
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
          messages.getUnknownInstanceError(conf.path, {
            CONSTRUCTOR: constructorNames.join(' | '),
          })
        )
  }
}
 */
