import { RypeOk } from '../RypeOk'
import * as Type from './Schema.type'
import { SchemaName } from './symbols'
import messages from '../errorMessages'
import { SchemaCheckConf, SchemaConfig } from '../types'
import { ValidConstructor, ValidObject } from '../utils.type'
import { ExtractOutput, InferClassFromSchema } from './Extract.type'
import { RypeError, RypeTypeError, RypeRequiredError } from '../Error'

class SchemaCore<const TFormat, TConfig extends SchemaConfig> {
  name = SchemaName.core
  schema: TFormat
  config: TConfig
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
   * @returns A new schema with the specified default value.
   */
  default(
    value: Exclude<ExtractOutput<typeof this>, undefined>
  ): InferClassFromSchema<
    typeof this,
    TFormat,
    { isRequired: false; defaultValue: unknown }
  > {
    const Constructor = ConstructorMap[
      this.name as keyof typeof ConstructorMap
    ] as ValidConstructor

    return new Constructor(this.schema, {
      isRequired: false,
      defaultValue: value,
    })
  }

  /**
   * Validates the input against the schema and returns the validation result or throws an error.
   *
   * @param {unknown} input - The value to be validated against the schema.
   * @param {string} [name] - A descriptive name or label for the validation point (optional).
   * @throws {RypeError} If validation fails, an error is thrown.
   * @returns  The result of the validation if successful.
   */
  parse(input: unknown, name?: string) {
    return this._checkAndGetResult(input, {
      path: name || '',
      throw: true,
    }) as ExtractOutput<typeof this>
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
    if (this._checkType2) return this._checkType2(input, conf)
    return result
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
  _checkType2?: (input: unknown, conf: SchemaCheckConf) => RypeOk | RypeError

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
    return new RypeTypeError(message, this.schema, input, this.config)
  }

  /**
   * Generates a required error message for the input value.
   *
   * @param input - The input value that cwas provided to check against schema
   * @param message - The error message to be displayed.
   * @returns A RypeRequiredError object with the specified error message, schema, input, and configuration.
   */
  _getRequiredErr(input: unknown, message: string) {
    return new RypeRequiredError(message, this.schema, input, this.config)
  }
}

class SchemaPrimitiveCore<
  T extends Type.InputString | Type.InputNumber | Type.InputBoolean,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = SchemaName.primitive

  _getType() {
    return this.schema.length
      ? this.schema.map((arg) => JSON.stringify(arg))
      : [this.name]
  }

  _checkType(input: unknown, conf: SchemaCheckConf): RypeError | RypeOk {
    const schema = new Set(this.schema as Iterable<string | number | boolean>)

    if (
      typeof input !== this.name ||
      (schema.size && !schema.has(input as string | number | boolean))
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
  name = SchemaName.string
}

export class SchemaNumber<
  T extends Type.InputNumber,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputNumber : T,
  R
> {
  name = SchemaName.number
}

export class SchemaBoolean<
  T extends Type.InputBoolean,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? Type.InputBoolean : T,
  R
> {
  name = SchemaName.boolean
}

export class SchemaObject<
  T extends Type.InputObject,
  R extends SchemaConfig
> extends SchemaCore<T, R> {
  name = SchemaName.object

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
  name = SchemaName.array

  _checkType(inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    const output: unknown[] = []
    const schema = new SchemaOr(this.schema, { isRequired: true })

    if (!Array.isArray(inputs)) {
      return this._getErr(
        inputs,
        messages.getOrTypeErr(conf.path, { TYPE: this.type })
      )
    }

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
  name = SchemaName.tuple

  _checkType(inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
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
  name = SchemaName.or

  _getType() {
    return this.schema.map((schema) => schema.type)
  }

  _checkType(input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]
      const result = schema._checkCore(input, { ...conf })
      if (result instanceof RypeOk) return result
    }

    return this._getErr(
      input,
      messages.getOrTypeErr(conf.path, {
        TYPE: this.type,
      })
    )
  }
}

/**
 * A map that associates schema names with their respective schema constructor classes.
 * This map is used to retrieve the constructor class based on the schema name.
 */
const ConstructorMap = {
  [SchemaName.string]: SchemaString,
  [SchemaName.number]: SchemaNumber,
  [SchemaName.boolean]: SchemaBoolean,

  [SchemaName.array]: SchemaArray,
  [SchemaName.tuple]: SchemaTuple,
  [SchemaName.object]: SchemaObject,

  [SchemaName.or]: SchemaOr,
}
