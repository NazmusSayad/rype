import {
  ValidObject,
  UpperCaseStrArray,
  LowerCaseStrArray,
  CapitalizeStrArray,
} from '../utils.type'
import {
  SchemaCore,
  SchemaPrimitiveCore,
  SchemaFreezableCore,
} from './SchemaCore'
import names from './names'
import { RypeOk } from '../RypeOk'
import * as Type from './Schema.type'
import messages from '../errorMessages'
import { RypeError, RypeDevError } from '../Error'
import { SchemaCheckConf, SchemaConfig } from '../types'

export class SchemaString<
  T extends Type.InputString,
  TConf extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputString : T,
  TConf
> {
  name = names.String

  private minCharLength?: number
  private maxCharLength?: number
  private cutAtMaxLength?: boolean
  private regexPattern?: RegExp
  private isCaseSensitiveInput?: boolean
  private transformerMode?: 'capital' | 'lower' | 'upper'

  private confirmNotUsingCustomValues() {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specefic string"
      )
    }
  }

  public toLowerCase() {
    this.transformerMode = 'lower'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<LowerCaseStrArray<T>, TConf>
  }

  public toUpperCase() {
    this.transformerMode = 'upper'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<UpperCaseStrArray<T>, TConf>
  }

  public toCapitalize() {
    this.transformerMode = 'capital'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<CapitalizeStrArray<T>, TConf>
  }

  public caseSensitiveInput() {
    this.isCaseSensitiveInput = true
    return this
  }

  public minLength(number: number) {
    this.confirmNotUsingCustomValues()
    this.minCharLength = number
    return this
  }

  public maxLength(number: number, autoSlice: boolean = true) {
    this.confirmNotUsingCustomValues()
    this.maxCharLength = number
    this.cutAtMaxLength = autoSlice
    return this
  }

  public regex(regex: RegExp) {
    this.confirmNotUsingCustomValues()
    this.regexPattern = regex
    return this
  }

  private transform(str: string): string {
    switch (this.transformerMode) {
      case 'lower':
        return str.toLowerCase()

      case 'upper':
        return str.toUpperCase()

      case 'capital':
        return str.charAt(0).toUpperCase() + str.slice(1)

      default:
        return str
    }
  }

  _preCheckInputFormatter(input: unknown) {
    if (this.maxCharLength && this.cutAtMaxLength) {
      input = (input as string).slice(0, this.maxCharLength)
    }

    if (this.transformerMode && !this.isCaseSensitiveInput) {
      return this.transform(input as string)
    }

    return input
  }

  _postCheckFormatter(result: RypeOk) {
    if (this.transformerMode) {
      result.value = this.transform(result.value as string)
    }

    return result
  }

  _checkType2(
    result: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    if (
      typeof this.minCharLength === 'number' &&
      (input as string).length < this.minCharLength
    ) {
      return this._getErr(
        input,
        messages.getStringMinLengthErr(conf.path, {
          MIN: String(this.minCharLength),
        })
      )
    }

    if (
      typeof this.maxCharLength === 'number' &&
      (input as string).length > this.maxCharLength
    ) {
      return this._getErr(
        input,
        messages.getStringMaxLengthErr(conf.path, {
          MAX: String(this.maxCharLength),
        })
      )
    }

    if (this.regexPattern) {
      if (!this.regexPattern.test(input as string)) {
        return this._getErr(
          input,
          messages.getStringRegexErr(conf.path, {
            INPUT: JSON.stringify(input),
            REGEX: String(this.regexPattern),
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
  name = names.Number
  private minValue?: number
  private maxValue?: number
  private confirmNotUsingCustomValues() {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specific number"
      )
    }
  }

  public min(number: number) {
    this.confirmNotUsingCustomValues()
    this.minValue = number
    return this
  }

  public max(number: number) {
    this.confirmNotUsingCustomValues()
    this.maxValue = number
    return this
  }

  _checkType2(
    result: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    if (Number.isNaN(input)) {
      return this._getErr(
        input,
        messages.getPrimitiveTypeError(conf.path, {
          INPUT: "'NaN'",
          TYPE: this.type,
        })
      )
    }

    if (
      typeof this.minValue === 'number' &&
      (input as number) < this.minValue
    ) {
      return this._getErr(
        input,
        messages.getNumberMinErr(conf.path, {
          MIN: String(this.minValue),
        })
      )
    }

    if (
      typeof this.maxValue === 'number' &&
      (input as number) > this.maxValue
    ) {
      return this._getErr(
        input,
        messages.getNumberMaxErr(conf.path, {
          MAX: String(this.maxValue),
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
  name = names.Boolean
}

export class SchemaInstance<
  T extends Type.InputInstance,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = names.Instance

  _getType() {
    return [this.schema.name]
  }

  _checkType(input: ValidObject, conf: SchemaCheckConf): RypeOk | RypeError {
    if (input instanceof this.schema) {
      return new RypeOk(input)
    }

    return this._getErr(
      input,
      messages.getInstanceErr(conf.path, { Instance: this.type })
    )
  }
}

export class SchemaObject<
  T extends Type.InputObject,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = names.Object

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

export class SchemaRecord<
  T extends Type.InputRecord,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = names.Record

  _checkType(input: ValidObject, conf: SchemaCheckConf): RypeOk | RypeError {
    const output: ValidObject = {}

    for (let key in input) {
      const value = input[key]

      output[key] = this.schema._checkAndGetResult(value, {
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
> extends SchemaFreezableCore<T, R> {
  name = names.Array

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
> extends SchemaFreezableCore<T, R> {
  name = names.Tuple

  _checkType(inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this._getErr(
        inputs,
        messages.getTypeErr(conf.path, { TYPE: this.type })
      )
    }

    if (
      this.schema.length !== inputs.length &&
      !this.schema.every((schema) => 'defaultValue' in schema.config)
    ) {
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
  name = names.Or

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
