import {
  RypeError,
  RypeTypeError,
  RypeClientError,
  RypeRequiredError,
} from '../Error'
import { RypeOk } from '../RypeOk'
import * as Type from './Schema.type'
import messages from '../errorMessages'
import { CustomValidator, SchemaCheckConf, SchemaConfig } from '../types'
import { InferInput, InferOutput, InferClassFromSchema } from './Extract.type'

export class SchemaCore<const TFormat, TConfig extends SchemaConfig> {
  name = 'core'
  schema: TFormat
  config: TConfig
  private customValidator?: CustomValidator<any>
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
   * Modify the schema by assigning the provided default value.
   *
   * @param value - Default value that should be matched to the schema.
   * @remarks This method does not perform schema validity checks at runtime for the given default value.
   * @returns The updated schema with the specified default value.
   */
  public default(value: Exclude<InferOutput<typeof this>, undefined>) {
    this.config.isRequired = false
    this.config.defaultValue = value
    return this as unknown as InferClassFromSchema<
      typeof this,
      TFormat,
      { isRequired: false; defaultValue: unknown }
    >
  }

  /**
   * Modify the schema by applying a custom validation function.
   *
   * @param {CustomValidator} fn - A function that returns `string` (for validation failure) or `void` (for success).
   * If the custom validation function returns a string, the validation will fail, and the string will be used as the error message.
   * @returns {this} - The schema with the customized validation behavior.
   */
  public validate(fn: CustomValidator<InferOutput<typeof this>>) {
    this.customValidator = fn
    return this
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
  public parse(input: unknown, name: string = '') {
    return this._checkAndGetResult(input, {
      path: name,
      throw: true,
    }) as InferOutput<typeof this>
  }
  public parseTyped(input: InferInput<typeof this>, name: string = '') {
    return this.parse(input, name)
  }

  /**
   * Validates the input against the schema and returns the validation result or returns undefined
   *
   * @param {unknown} input - The value to be validated against the schema.
   * @param {string} [name] - A descriptive name or label for the validation point (optional).
   * @returns  The result of the validation if successful else undefined.
   *
   * ⚠️: The type of the result may not be perfect.
   */
  public filter(input: unknown, name: string = '') {
    return this._checkAndGetResult(input, {
      path: name,
      throw: false,
    }) as InferOutput<typeof this>
  }
  public filterTyped(input: InferInput<typeof this>, name: string = '') {
    return this.filter(input, name)
  }

  /**
   * Validates the input against the schema and returns the validation result or returns the errors
   *
   * @param {unknown} input - The value to be validated against the schema.
   * @param {string} [name] - A descriptive name or label for the validation point (optional).
   * @returns An array containing the validated data as the first element if successful, or the errors as the second element if not.
   */
  public safeParse(input: unknown, name: string = '') {
    const metaParseRef = { current: false }
    const output = this._checkAndGetResult(input, {
      path: name,
      throw: false,
      safeParseRef: metaParseRef,
    }) as InferOutput<typeof this>

    return (
      metaParseRef.current ? [undefined, output] : [output, undefined]
    ) as [InferOutput<typeof this>?, unknown?]
  }
  public safeParseTyped(input: InferInput<typeof this>, name: string = '') {
    return this.safeParse(input, name)
  }

  /**
   * Validates the input against the schema and returns the validation result or returns the errors
   *
   * @param {unknown} input - The value to be validated against the schema.
   * @param {string} [name] - A descriptive name or label for the validation point (optional).
   * @returns An array containing the validated data as the first element if successful, or an array of errors as the second element if not.
   */
  public safeParseList(input: unknown, name: string = '') {
    const safeParseErrors: RypeError[] = []
    const output = this._checkAndGetResult(input, {
      path: name,
      throw: false,
      safeParseErrors,
    })

    return (
      safeParseErrors.length
        ? [undefined, safeParseErrors]
        : [output, undefined]
    ) as [InferOutput<typeof this>?, RypeError[]?]
  }
  public safeParseListTyped(input: InferInput<typeof this>, name: string = '') {
    return this.safeParseList(input, name)
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
    if (output instanceof RypeError) {
      if (conf.safeParseErrors) {
        conf.safeParseErrors.push(output)
        return
      }

      if (conf.safeParseRef) {
        conf.safeParseRef.current = true
        return output
      }
    }

    if (output instanceof RypeOk) return output.value
    return undefined
  }

  /**
   * Check input against the schema and return the result or throw an error (if configured).
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

    const result2 = this._checkType2(result, input, conf)
    if (result2 instanceof RypeError) return result2

    if (this.customValidator) {
      const message = this.customValidator(input)
      if (typeof message === 'string') return this._getClientErr(input, message)
    }

    return result2
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
   * @param input - The input value that was provided to check against schema
   * @param message - The error message to be displayed.
   * @returns A RypeTypeError object with the specified error message, schema, input, and configuration.
   */
  _getErr(input: unknown, message: string) {
    const msgOrCustomMsg =
      typeof this.errorMessage.type === 'string'
        ? this.errorMessage.type
        : message

    return new RypeTypeError(msgOrCustomMsg, {
      input,
      schema: this.schema,
      config: this.config,
    })
  }

  /**
   * Generates a type error message for the input value.
   *
   * @param input - The input value that was provided to check against schema
   * @param message - The error message to be displayed.
   * @returns A RypeTypeError object with the specified error message, schema, input, and configuration.
   */
  private _getClientErr(input: unknown, message: string) {
    return new RypeClientError(message, {
      input,
      schema: this.schema,
      config: this.config,
    })
  }

  /**
   * Generates a required error message for the input value.
   *
   * @param input - The input value that was provided to check against schema
   * @param message - The error message to be displayed.
   * @returns A RypeRequiredError object with the specified error message, schema, input, and configuration.
   */
  private _getRequiredErr(input: unknown, message: string) {
    const msgOrCustomMsg =
      typeof this.errorMessage.required === 'string'
        ? this.errorMessage.required
        : message

    return new RypeRequiredError(msgOrCustomMsg, {
      input,
      schema: this.schema,
      config: this.config,
    })
  }
}

export class SchemaPrimitiveCore<
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
