import { RypeOk } from '../RypeOk'
import * as Type from './Schema.type'
import messages from '../errorMessages'
import { ValidObject } from '../utils.type'
import { RypeError, RypeDevError } from '../Error'
import { SchemaCheckConf, SchemaConfig } from '../types'
import { SchemaCore, SchemaPrimitiveCore } from './SchemaCore'

export class SchemaString<
  T extends Type.InputString,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputString : T,
  R
> {
  name = 'string' as const

  _minLength?: number
  _maxLength?: number
  _regex?: RegExp

  public minLength(number: number) {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specefic string"
      )
    }

    this._minLength = number
    return this
  }

  public maxLength(number: number) {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specefic string"
      )
    }

    this._maxLength = number
    return this
  }

  public regex(regex: RegExp) {
    this._regex = regex
    return this
  }

  _checkType2(
    result: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    if (
      typeof this._minLength === 'number' &&
      (input as string).length < this._minLength
    ) {
      return this._getErr(
        input,
        messages.getStringMinLengthErr(conf.path, {
          MIN: String(this._minLength),
        })
      )
    }

    if (
      typeof this._maxLength === 'number' &&
      (input as string).length > this._maxLength
    ) {
      return this._getErr(
        input,
        messages.getStringMaxLengthErr(conf.path, {
          MAX: String(this._maxLength),
        })
      )
    }

    if (this._regex) {
      if (!this._regex.test(input as string)) {
        return this._getErr(
          input,
          messages.getStringRegexErr(conf.path, {
            INPUT: JSON.stringify(input),
            REGEX: String(this._regex),
          })
        )
      }
    }

    return result
  }
}

export class SchemaNumber<
  T extends Type.InputNumber,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputNumber : T,
  R
> {
  name = 'number' as const
  _minValue?: number
  _maxValue?: number

  public min(number: number) {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specefic number"
      )
    }

    this._minValue = number
    return this
  }

  public max(number: number) {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specefic number"
      )
    }

    this._maxValue = number
    return this
  }

  _checkType2(
    result: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    if (
      typeof this._minValue === 'number' &&
      (input as number) < this._minValue
    ) {
      return this._getErr(
        input,
        messages.getNumberMinErr(conf.path, {
          MIN: String(this._minValue),
        })
      )
    }

    if (
      typeof this._maxValue === 'number' &&
      (input as number) > this._maxValue
    ) {
      return this._getErr(
        input,
        messages.getNumberMaxErr(conf.path, {
          MAX: String(this._maxValue),
        })
      )
    }

    return result
  }
}

export class SchemaBoolean<
  T extends Type.InputBoolean,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputBoolean : T,
  R
> {
  name = 'boolean' as const
}

export class SchemaObject<
  T extends Type.InputObject,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = 'object' as const

  _checkType(input: ValidObject, conf: SchemaCheckConf): RypeOk | RypeError {
    const output: ValidObject = {}

    for (let key in this.schema) {
      const schema = this.schema[key]
      const value = input[key]
      output[key] = schema._checkAndGetResult(value, {
        ...conf,
        path: `${conf.path || 'object'}.${key}`,
      })
    }

    return new RypeOk(output)
  }
}

export class SchemaArray<
  T extends Type.InputArray,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = 'array' as const

  _checkType(inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this._getErr(
        inputs,
        messages.getTypeErr(conf.path, { TYPE: this.type })
      )
    }

    if (this.schema.length === 0 || inputs.length === 0) {
      return new RypeOk(inputs)
    }

    const output: unknown[] = []
    const schema =
      this.schema.length === 1
        ? new SchemaOr(this.schema, { isRequired: true })
        : this.schema[0]

    for (let i = 0; i <= inputs.length - 1; i++) {
      const input = inputs[i]
      const path = `${conf.path}array[${i}]`
      const result = schema._checkAndThrowError(input, {
        ...conf,
        path,
      })

      if (result instanceof RypeOk) {
        output.push(result.value)
      }
    }

    return new RypeOk(output)
  }
}

export class SchemaTuple<
  T extends Type.InputTuple,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = 'tuple' as const

  _checkType(inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this._getErr(
        inputs,
        messages.getTypeErr(conf.path, { TYPE: this.type })
      )
    }

    if (this.schema.length !== inputs.length) {
      return this._getErr(
        inputs,
        messages.getTupleLengthError(conf.path, {
          LENGTH: this.schema.length.toString(),
        })
      )
    }

    const output: unknown[] = []
    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]
      const inputElement = inputs[i]
      const result = schema._checkAndGetResult(inputElement, {
        ...conf,
        path: `${conf.path || 'Tuple'}[${i}]`,
      })

      output.push(result)
    }

    return new RypeOk(output)
  }
}

export class SchemaOr<
  T extends Type.InputOr,
  R extends SchemaConfig
> extends SchemaCore<T[number] extends never ? Type.InputOr : T, R> {
  name = 'or' as const

  _getType() {
    return this.schema.map((schema) => schema.type)
  }

  _checkType(input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    if (this.schema.length === 0) return new RypeOk(input)

    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]
      const result = schema._checkCore(input, { ...conf })
      if (result instanceof RypeOk) return result
    }

    return this._getErr(
      input,
      messages.getTypeErr(conf.path, {
        TYPE: this.type,
      })
    )
  }
}
