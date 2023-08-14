import {
  ExtractInput,
  ExtractOutput,
  InferClassFromSchema,
} from './Extract.type'
import { RypeOk } from '../RypeOk'
import * as Type from './Schema.type'
import messages from '../errorMessages'
import { ValidObject } from '../utils.type'
import { SchemaCheckConf, SchemaConfig } from '../types'
import {
  RypeError,
  RypeTypeError,
  RypeRequiredError,
  RypeDevError,
} from '../Error'

class SchemaCore<const TFormat, TConfig extends SchemaConfig> {
  name = 'core'
  schema: TFormat
  config: TConfig
  private errorMessage: {
    required?: string
    type?: string
  } = {}

  constructor(schema: TFormat, config: TConfig) {
    this.schema = schema
    this.config = config
  }

  /**
   * Gets the combined type of the schema.
   * @returns A string representing the type of the schema.
   */
  get type(): string {
    return [...new Set([this._getType()].flat())].join(' | ')
  }

  /**
   * Create a new schema with a default value that matches the schema.
   *
   * @param value - Default value that should be matched to the schema.
   * Note: This method doesn't check the value for schema validity at runtime.
   * @returns The updated schema with the specified default value.
   */
  public default(value: Exclude<ExtractOutput<typeof this>, undefined>) {
    this.config.isRequired = false
    this.config.defaultValue = value
    return this as unknown as InferClassFromSchema<
      typeof this,
      TFormat,
      { isRequired: false; defaultValue: unknown }
    >
  }

  /**
   * Sets a custom error message for type mismatch errors.
   *
   * @param message The error message as a string.
   * @returns The updated schema with the specified error message.
   */
  public setTypeErrMsg(message: string) {
    this.errorMessage.type = message
    return this
  }

  /**
   * Sets a custom error message for required errors, which occur when the schema is required but the value is undefined or null.
   *
   * @param message The error message as a string.
   * @returns The updated schema with the specified error message.
   */
  public setRequiredErrMsg(message: string) {
    this.errorMessage.required = message
    return this
  }

  /**
   * Validates the input against the schema and returns the validation result or throws an error.
   *
   * @param {unknown} input - The value to be validated against the schema.
   * @param {string} [name] - A descriptive name or label for the validation point (optional).
   * @throws {RypeError} If validation fails, an error is thrown.
   * @returns  The result of the validation if successful.
   */
  public parse(input: unknown, name?: string) {
    return this._checkAndGetResult(input, {
      path: name || '',
      throw: true,
    }) as ExtractOutput<typeof this>
  }

  /**
   * Validates the input against the schema and returns the validation result or throws an error.
   *
   * @param {unknown} input - The value to be validated against the schema.
   * @param {string} [name] - A descriptive name or label for the validation point (optional).
   * @returns  The result of the validation if successful else undefined.
   */
  public safeParse(input: unknown, name?: string) {
    return this._checkAndGetResult(input, {
      path: name || '',
      throw: false,
    }) as ExtractOutput<typeof this>
  }

  /**
   * This method is similar to the .parse method, but includes input type validation.
   */
  public typedParse(input: ExtractInput<typeof this>, name?: string) {
    return this.parse(input, name)
  }

  /**
   * This method is similar to the .safeParse method, but includes input type validation.
   */
  public typedSafeParse(input: ExtractInput<typeof this>, name?: string) {
    return this.safeParse(input, name)
  }

  /**
   * Check input against the schema and return the result or throw an error (if configured).
   *
   * @param input - The value to be checked against the schema.
   * @param conf - Configuration for schema checking.
   * @returns If successful, returns the result of the check; If 'conf.throw' is false an error is thrown, this returns undefined.
   */
  _checkAndGetResult(input: unknown, conf: SchemaCheckConf): unknown {
    const output = this._checkAndThrowError(input, conf)
    if (output instanceof RypeOk) return output.value
    return undefined
  }

  /**
   * Check input against the schema and return the result or throw an error (if configured).
   *
   *
   *
   * @param input - The value to be checked against the schema.
   * @param conf - Configuration for schema checking.
   * @returns If successful, returns the result as a RypeOk object. If an error occurs and 'conf.throw' is true, an error is thrown; otherwise, a RypeError is returned.
   */
  _checkAndThrowError(
    input: unknown,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    const output = this._checkCore(input, conf)
    if (output instanceof RypeError && conf.throw) throw output
    return output
  }

  /**
   * Check input against the schema and return the result or throw an error (if configured).
   * This method handles some basic required or default value related checks.
   *
   * @param input - The value to be checked against the schema.
   * @param conf - Configuration for checking the schema.
   * @returns If successful, returns the result as a RypeOk object; otherwise, returns a RypeError.
   */
  _checkCore(input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    if (input == null) {
      if (this.config.defaultValue) {
        return new RypeOk(this.config.defaultValue)
      }

      if (this.config.isRequired) {
        return this._getRequiredErr(
          input,
          messages.getRequiredErr(conf.path, {})
        )
      }

      return new RypeOk(undefined)
    }

    const result = this._checkType(input, conf)
    if (result instanceof RypeError) return result
    return this._checkType2(result, input, conf)
  }

  /**
   * Check the input against the schema and return the result or throw an error (if configured).
   * This method checks the schema's types and should be overridden by child classes to provide specific type checks.
   *
   * @param input - The value to be checked against the schema.
   * @param conf - Configuration for schema checking.
   * @returns If successful, returns the result as a RypeOk object; otherwise, returns a RypeError.
   */
  _checkType(input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    return new RypeError(this.name + " isn't implemented yet!")
  }

  /**
   * An optional secondary method for checking the type of the input against the schema.
   * This method is used when the primary _checkType method is not sufficient.
   *
   * @param input - The value to be checked against the schema.
   * @param conf - Configuration for checking the schema.
   * @returns If successful, returns a RypeOk object; otherwise, returns a RypeError.
   */
  _checkType2(
    prevResult: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    return prevResult
  }

  /**
   * Get the type of the schema as an array of strings.
   *
   * @returns An array containing the name and other custom values of the schema.
   */
  _getType(): string[] {
    return [this.name]
  }

  /**
   * Generates a type error message for the input value.
   *
   * @param input - The input value that cwas provided to check against schema
   * @param message - The error message to be displayed.
   * @returns A RypeTypeError object with the specified error message, schema, input, and configuration.
   */
  _getErr(input: unknown, message: string) {
    const msgOrCustomMsg =
      typeof this.errorMessage.type === 'string'
        ? this.errorMessage.type
        : message

    return new RypeTypeError(msgOrCustomMsg, this.schema, input, this.config)
  }

  /**
   * Generates a required error message for the input value.
   *
   * @param input - The input value that cwas provided to check against schema
   * @param message - The error message to be displayed.
   * @returns A RypeRequiredError object with the specified error message, schema, input, and configuration.
   */
  _getRequiredErr(input: unknown, message: string) {
    const msgOrCustomMsg =
      typeof this.errorMessage.required === 'string'
        ? this.errorMessage.required
        : message

    return new RypeRequiredError(
      msgOrCustomMsg,
      this.schema,
      input,
      this.config
    )
  }
}

class SchemaPrimitiveCore<
  T extends Type.InputString | Type.InputNumber | Type.InputBoolean,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = 'primitive'

  _getType() {
    return this.schema.length
      ? this.schema.map((arg) => JSON.stringify(arg))
      : [this.name]
  }

  _checkType(input: unknown, conf: SchemaCheckConf): RypeError | RypeOk {
    if (
      typeof input !== this.name ||
      (this.schema.length && !this.schema.includes(input as never))
    ) {
      return this._getErr(
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
  R extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputString : T,
  R
> {
  name = 'string' as const
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

  min(number: number) {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specefic number"
      )
    }

    this._minValue = number
    return this
  }

  max(number: number) {
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
