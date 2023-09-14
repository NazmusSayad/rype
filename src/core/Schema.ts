import {
  ValidObject,
  UpperCaseStrArray,
  LowerCaseStrArray,
  CapitalizeStrArray,
  Prettify,
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
import { InferClassFromSchema } from './Extract.type'

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

  /**
   * Converts the **output** strings to lowercase.
   * @returns The updated SchemaString instance with lowercase transformation applied to **output** strings.
   */
  public toLowerCase() {
    this.transformerMode = 'lower'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<LowerCaseStrArray<T>, TConf>
  }

  /**
   * Converts the **output** strings to uppercase.
   * @returns The updated SchemaString instance with uppercase transformation applied to **output** strings.
   */
  public toUpperCase() {
    this.transformerMode = 'upper'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<UpperCaseStrArray<T>, TConf>
  }

  /**
   * Capitalizes the first letter of **output** strings.
   * @returns The updated SchemaString instance with capitalization transformation applied to **output** strings.
   */
  public toCapitalize() {
    this.transformerMode = 'capital'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<CapitalizeStrArray<T>, TConf>
  }

  /**
   * Enables case-sensitive comparison of input strings.
   * @returns The updated SchemaString instance with case-sensitive input comparison enabled.
   */
  public caseSensitiveInput() {
    this.isCaseSensitiveInput = true
    return this
  }

  /**
   * Sets the minimum allowed character length for input strings.
   * @param number - The minimum character length.
   * @returns The updated SchemaString instance with the minimum character length set.
   */
  public minLength(number: number) {
    this.confirmNotUsingCustomValues()
    this.minCharLength = number
    return this
  }

  /**
   * Sets the maximum allowed character length for input strings.
   * @param number - The maximum character length.
   * @param autoSlice - Whether to automatically slice input strings if they exceed the maximum length. `default: true`
   * @returns The updated SchemaString instance with the maximum character length set.
   */
  public maxLength(number: number, autoSlice: boolean = true) {
    this.confirmNotUsingCustomValues()
    this.maxCharLength = number
    this.cutAtMaxLength = autoSlice
    return this
  }

  /**
   * Sets a regular expression pattern for validating input strings.
   * @param regex - The regular expression pattern.
   * @returns The updated SchemaString instance with the regex pattern set.
   */
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

  ['~preCheckInputFormatter'](input: unknown) {
    if (this.maxCharLength && this.cutAtMaxLength) {
      input = (input as string).slice(0, this.maxCharLength)
    }

    if (this.transformerMode && !this.isCaseSensitiveInput) {
      return this.transform(input as string)
    }

    return input
  }

  ['~postCheckFormatter'](result: RypeOk) {
    if (this.transformerMode) {
      result.value = this.transform(result.value as string)
    }

    return result
  }

  ['~checkType2'](
    result: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    if (
      typeof this.minCharLength === 'number' &&
      (input as string).length < this.minCharLength
    ) {
      return this['~getErr'](
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
      return this['~getErr'](
        input,
        messages.getStringMaxLengthErr(conf.path, {
          MAX: String(this.maxCharLength),
        })
      )
    }

    if (this.regexPattern) {
      if (!this.regexPattern.test(input as string)) {
        return this['~getErr'](
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

  /**
   * Sets the minimum allowed value for the schema.
   * @param number - The minimum value that is acceptable for the schema.
   * @returns The updated SchemaNumber instance with the minimum value set.
   */
  public min(number: number) {
    this.confirmNotUsingCustomValues()
    this.minValue = number
    return this
  }

  /**
   * Sets the maximum allowed value for the schema.
   * @param number - The maximum value that is acceptable for the schema.
   * @returns The updated SchemaNumber instance with the maximum value set.
   */
  public max(number: number) {
    this.confirmNotUsingCustomValues()
    this.maxValue = number
    return this
  }

  ['~checkType2'](
    result: RypeOk | RypeError,
    input: unknown,
    conf: SchemaCheckConf
  ) {
    if (Number.isNaN(input)) {
      return this['~getErr'](
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
      return this['~getErr'](
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
      return this['~getErr'](
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
  name = names.Instance;

  ['~getType']() {
    return [this.schema.name]
  }

  ['~checkType'](
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    if (input instanceof this.schema) {
      return new RypeOk(input)
    }

    return this['~getErr'](
      input,
      messages.getInstanceErr(conf.path, { Instance: this.type })
    )
  }
}

export class SchemaObject<
  T extends Type.InputObject,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = names.Object;

  ['~checkType'](
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    const output: ValidObject = {}

    for (let key in this.schema) {
      const schema = this.schema[key]
      const value = input[key]

      const result = schema['~checkAndGetResult'](value, {
        ...conf,
        path: `${conf.path || 'object'}.${key}`,
      })

      if (result !== undefined) {
        output[key] = result
      }
    }

    return new RypeOk(output)
  }

  /**
   * Creates a new schema where all properties are marked as optional (not required).
   * @returns A new schema with optional properties.
   */
  partial() {
    for (let key in this.schema) {
      this.schema[key].config.isRequired = false
    }

    return this as unknown as SchemaObject<
      {
        [K in keyof T]: InferClassFromSchema<
          T[K],
          T[K]['schema'],
          Prettify<Omit<T[K]['config'], 'isRequired'> & { isRequired: false }>
        >
      },
      R
    >
  }

  /**
   * Creates a new schema where all properties are marked as required.
   * @returns A new schema with required properties.
   */
  required() {
    for (let key in this.schema) {
      this.schema[key].config.isRequired = true
    }

    return this as unknown as SchemaObject<
      {
        [K in keyof T]: InferClassFromSchema<
          T[K],
          T[K]['schema'],
          Prettify<Omit<T[K]['config'], 'isRequired'> & { isRequired: true }>
        >
      },
      R
    >
  }

  /**
   * Creates a new schema by selecting specific properties from the original schema.
   * @param args - The keys of the properties to include in the new schema.
   * @returns A new schema with selected properties or an empty schema if no properties are selected.
   */
  pick<Key extends (keyof T)[]>(...args: Key) {
    for (let key in this.schema) {
      if (!args.includes(key as any)) {
        delete this.schema[key]
      }
    }

    return this as unknown as Key[number] extends never
      ? SchemaObject<{}, R>
      : SchemaObject<Pick<T, Key[number]>, R>
  }

  /**
   * Creates a new schema by omitting specific properties from the original schema.
   * @param args - The keys of the properties to exclude from the new schema.
   * @returns A new schema with omitted properties or the original schema if no properties are omitted.
   */
  omit<Key extends (keyof T)[]>(...args: Key) {
    for (let key in this.schema) {
      if (args.includes(key as any)) {
        delete this.schema[key]
      }
    }

    return this as unknown as Key[number] extends never
      ? typeof this
      : SchemaObject<Omit<T, Key[number]>, R>
  }
}

export class SchemaRecord<
  T extends Type.InputRecord,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = names.Record;

  ['~checkType'](
    input: ValidObject,
    conf: SchemaCheckConf
  ): RypeOk | RypeError {
    const output: ValidObject = {}

    for (let key in input) {
      const value = input[key]

      output[key] = this.schema['~checkAndGetResult'](value, {
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
  name = names.Array;

  ['~checkType'](inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this['~getErr'](
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
      const result = schema['~checkAndThrowError'](input, {
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
  name = names.Tuple;

  ['~checkType'](inputs: unknown[], conf: SchemaCheckConf): RypeOk | RypeError {
    if (!Array.isArray(inputs)) {
      return this['~getErr'](
        inputs,
        messages.getTypeErr(conf.path, { TYPE: this.type })
      )
    }

    if (
      this.schema.length !== inputs.length &&
      !this.schema.every((schema) => 'defaultValue' in schema.config)
    ) {
      return this['~getErr'](
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
      const result = schema['~checkAndGetResult'](inputElement, {
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
  name = names.Or;

  ['~getType']() {
    return this.schema.map((schema) => schema.type)
  }

  ['~checkType'](input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    if (this.schema.length === 0) return new RypeOk(input)

    for (let i = 0; i <= this.schema.length - 1; i++) {
      const schema = this.schema[i]
      const result = schema['~checkCore'](input, { ...conf })
      if (result instanceof RypeOk) return result
    }

    return this['~getErr'](
      input,
      messages.getTypeErr(conf.path, {
        TYPE: this.type,
      })
    )
  }
}
