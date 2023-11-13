import {
  RypeError,
  RypeTypeError,
  RypeClientError,
  RypeRequiredError,
} from '../Error'
import { RypeOk } from '../RypeOk'
import * as Schema from './Schema'
import messages from '../errorMessages'
import { DeepOptional, ObjectMerge, Prettify } from '../utils.type'
import { CustomValidator, SchemaCheckConf, SchemaConfig } from '../types'
import { InferInput, InferOutput, InferClassFromSchema } from './Extract.type'

export class SchemaCore<const TFormat, TConfig extends SchemaConfig> {
  name = 'core' as
    | 'instance'
    | 'boolean'
    | 'number'
    | 'string'
    | 'object'
    | 'record'
    | 'tuple'
    | 'array'
    | 'or'

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
    return [...new Set([this['~getType']()].flat())].join(' | ')
  }

  /**
   * Marks the schema as required, indicating that the corresponding input value must be provided.
   * This method removes any default value previously set and makes the schema mandatory.
   *
   * @returns A new schema instance that needs to be required
   */
  public required() {
    this.config.isRequired = true
    delete this.config.defaultValue
    return this as unknown as InferClassFromSchema<
      typeof this,
      TFormat,
      ObjectMerge<Omit<TConfig, 'defaultValue'>, { isRequired: true }>
    >
  }

  /**
   * Marks the schema as optional, indicating that the corresponding input value is not required.
   * This method makes the schema optional.
   *
   * @returns A new schema instance that can be optional
   */
  public optional() {
    this.config.isRequired = false
    return this as unknown as InferClassFromSchema<
      typeof this,
      TFormat,
      ObjectMerge<TConfig, { isRequired: false }>
    >
  }

  /**
   * Modify the schema by assigning the provided default value.
   *
   * @param value - Default value that should be matched to the schema.
   * @remarks This method makes the schema optional.
   * @remarks This method does not perform schema validity checks at runtime for the given default value.
   * @returns The updated schema with the specified default value.
   */
  public default<T extends Exclude<InferInput<typeof this>, undefined>>(
    value: T | (() => T)
  ) {
    this.optional()
    this.config.defaultValue = value

    return this as unknown as InferClassFromSchema<
      typeof this,
      TFormat,
      ObjectMerge<
        TConfig,
        {
          isRequired: false
          defaultValue: T
        }
      >
    >
  }

  /**
   * Modify the schema by applying a custom validation function.
   *
   * @param fn - A function that returns `string` (for validation failure) or `void` (for success).
   * If the custom validation function returns a string, the validation will fail, and the string will be used as the error message.
   * @returns The schema with the customized validation behavior.
   */
  public validate(fn: CustomValidator<InferOutput<typeof this>>) {
    this.customValidator = fn
    return this
  }

  /**
   * Sets a custom error message for type mismatch errors.
   *
   * @deprecated Use `typeErr` instead, will be removed in v2
   * @param message The error message as a string.
   * @returns The updated schema with the specified error message.
   */
  public setTypeErrMsg(message: string) {
    this.errorMessage.type = message
    return this
  }
  /**
   *  Shorthand for `setTypeErrMsg` method.
   */
  public typeErr(message: string) {
    return this.setTypeErrMsg(message)
  }

  /**
   * Sets a custom error message for required errors, which occur when the schema is required but the value is undefined or null.
   *
   * @deprecated Use `missingErr` instead, will be removed in v2
   * @param message The error message as a string.
   * @returns The updated schema with the specified error message.
   */
  public setRequiredErrMsg(message: string) {
    this.errorMessage.required = message
    return this
  }
  /**
   * Shorthand for `setRequiredErrMsg` method.
   */
  public missingErr(message: string) {
    return this.setRequiredErrMsg(message)
  }

  /**
   * Validates the input against the schema and returns the validation result or throws an error.
   *
   * @param input - The value to be validated against the schema.
   * @param name - A descriptive name or label for the validation point (optional). `default: ""`
   * @throws If validation fails, an error is thrown.
   * @returns The result of the validation if successful.
   */
  public parse(input: unknown, name: string = '') {
    return this['~checkAndGetResult'](input, {
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
   * @param input - The value to be validated against the schema.
   * @param name - A descriptive name or label for the validation point (optional). `default: ""`
   * @returns  The result of the validation if successful else undefined.
   *
   * ⚠️: The type of the result may not be perfect.
   */
  public filter(input: unknown, name: string = '') {
    return this['~checkAndGetResult'](input, {
      path: name,
      throw: false,
    }) as DeepOptional<InferOutput<typeof this>>
  }
  public filterTyped(input: InferInput<typeof this>, name: string = '') {
    return this.filter(input, name)
  }

  /**
   * Validates the input against the schema and returns the validation result or returns the errors
   *
   * @param input - The value to be validated against the schema.
   * @param name - A descriptive name or label for the validation point (optional). `default: ""`
   * @returns An array containing the validated data as the first element if successful, or the errors as the second element if not.
   */
  public safeParse(input: unknown, name: string = '') {
    const metaParseRef = { current: false }
    const output = this['~checkAndGetResult'](input, {
      path: name,
      throw: false,
      safeParseRef: metaParseRef,
    })

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
   * @param input - The value to be validated against the schema.
   * @param name - A descriptive name or label for the validation point (optional). `default: ""`
   * @returns An array containing the validated data as the first element if successful, or an array of errors as the second element if not.
   */
  public safeParseList(input: unknown, name: string = '') {
    const safeParseErrors: RypeError[] = []
    const output = this['~checkAndGetResult'](input, {
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
  ['~checkAndGetResult'](input: unknown, conf: SchemaCheckConf): unknown {
    const output = this['~checkAndThrowError'](input, conf)
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
  ['~checkAndThrowError'](
    input: unknown,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    const output = this['~checkCore'](input, conf)
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
  ['~checkCore'](input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    if (input == null) {
      // When input is null

      if ('defaultValue' in this.config) {
        // Has default value
        const defaultValue =
          typeof this.config.defaultValue === 'function'
            ? this.config.defaultValue()
            : this.config.defaultValue

        if (this.name === 'object' || this.name === 'tuple') {
          input = defaultValue
        } else {
          return new RypeOk(defaultValue)
        }
      } else if (this.config.isRequired) {
        // Doesn't have default value and is required

        return this.getRequiredErr(
          input,
          messages.getRequiredErr(conf.path, {})
        )
      } else return new RypeOk(undefined)
    }

    const formattedInput = this['~preCheckInputFormatter'](input)

    const result = this['~checkType'](formattedInput, conf)
    if (result instanceof RypeError) return result

    const result2 = this['~checkType2'](result, formattedInput, conf)
    if (result2 instanceof RypeError) return result2

    if (this.customValidator) {
      const message = this.customValidator(formattedInput)
      if (typeof message === 'string')
        return this.getClientErr(formattedInput, message)
    }

    return this['~postCheckFormatter'](result2)
  }

  /**
   * Check the input against the schema and return the result or throw an error (if configured).
   * This method checks the schema's types and should be overridden by child classes to provide specific type checks.
   *
   * @param input - The value to be checked against the schema.
   * @param conf - Configuration for schema checking.
   * @returns If successful, returns the result as a RypeOk object; otherwise, returns a RypeError.
   */
  ['~checkType'](input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    return new RypeError(this.name + " isn't implemented yet!")
  }

  /**
   * An optional secondary method for checking the type of the input against the schema.
   * This method is used when the primary ~checkType method is not sufficient.
   *
   * @param input - The value to be checked against the schema.
   * @param conf - Configuration for checking the schema.
   * @returns If successful, returns a RypeOk object; otherwise, returns a RypeError.
   */
  ['~checkType2'](
    prevResult: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    return prevResult
  }

  /**
   * Formats the input value before performing any checks.
   *
   * @param input - The value from user input.
   * @returns The formatted input value.
   */
  ['~preCheckInputFormatter'](input: unknown) {
    return input
  }

  /**
   * Formats the result after all checks have been completed.
   *
   * @param result - The result of the checks.
   * @returns The formatted result.
   */
  ['~postCheckFormatter'](result: RypeOk) {
    return result
  }

  /**
   * Get the type of the schema as an array of strings.
   *
   * @returns An array containing the name and other custom values of the schema.
   */
  ['~getType'](): string[] {
    return [this.name]
  }

  /**
   * Generates a type error message for the input value.
   *
   * @param input - The input value that was provided to check against schema
   * @param message - The error message to be displayed.
   * @returns A RypeTypeError object with the specified error message, schema, input, and configuration.
   */
  ['~getErr'](input: unknown, message: string) {
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
  private getClientErr(input: unknown, message: string) {
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
  private getRequiredErr(input: unknown, message: string) {
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
  TFormat extends Schema.InputString | Schema.InputNumber | Schema.InputBoolean,
  TConfig extends SchemaConfig
> extends SchemaCore<TFormat, TConfig> {
  name = 'primitive' as 'number' | 'string' | 'boolean';

  ['~getType']() {
    return this.schema.length
      ? this.schema.map((arg) => JSON.stringify(arg))
      : [this.name]
  }

  ['~checkType'](input: unknown, conf: SchemaCheckConf): RypeError | RypeOk {
    if (
      typeof input !== this.name ||
      (this.schema.length && !this.schema.includes(input as never))
    ) {
      return this['~getErr'](
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

export class SchemaFreezableCore<
  TFormat extends
    | Schema.InputObject
    | Schema.InputArray
    | Schema.InputTuple
    | Schema.InputRecord,
  TConfig extends SchemaConfig
> extends SchemaCore<TFormat, TConfig> {
  name = 'freezableObject' as 'object' | 'array' | 'tuple' | 'record'
  private isReadonly?: boolean

  /**
   * Marks the parsed output of the schema as readonly, preventing further modifications.
   * @returns A new schema instance with the parsed output marked as readonly.
   */
  toReadonly() {
    this.isReadonly = true
    return this as unknown as InferClassFromSchema<
      typeof this,
      TFormat,
      ObjectMerge<TConfig, { convertToReadonly: true }>
    >
  }

  ['~postCheckFormatter'](result: RypeOk): RypeOk {
    if (this.isReadonly && result.value !== undefined) {
      return new RypeOk(Object.freeze(result.value))
    }

    return result
  }
}
