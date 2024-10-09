import {
  UpperCaseStrArray,
  LowerCaseStrArray,
  CapitalizeStrArray,
} from '@/utils.type'
import { RypeOk } from '@/RypeOk'
import messages from '@/errorMessages'
import { RypeError, RypeDevError } from '@/Error'
import { SchemaPrimitiveCore } from '@/core/SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '@/config'

export class SchemaString<
  T extends SchemaString.Input,
  TConf extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? SchemaString.Input : T,
  TConf
> {
  name = 'string' as const

  private minCharLength?: number
  private maxCharLength?: number
  private cutAtMaxLength?: boolean
  private regexPattern?: RegExp
  private isCaseSensitiveInput?: boolean
  private transformerMode?: 'capital' | 'lower' | 'upper'

  private confirmNotUsingCustomValues() {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specific string"
      )
    }
  }

  /**
   * Converts the **output** strings to lowercase.
   * @returns The updated SchemaString instance with lowercase transformation applied to **output** strings.
   * @example
   * ```ts
   * const schema = r.string().toLowerCase()
   * const result = schema.parseTyped('JOHN') // 'john'
   * ```
   */
  public toLowerCase() {
    this.transformerMode = 'lower'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<LowerCaseStrArray<T>, TConf>
  }

  /**
   * Converts the **output** strings to uppercase.
   * @returns The updated SchemaString instance with uppercase transformation applied to **output** strings.
   * @example
   * ```ts
   * const schema = r.string().toUpperCase()
   * const result = schema.parseTyped('john') // 'JOHN'
   * ```
   */
  public toUpperCase() {
    this.transformerMode = 'upper'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<UpperCaseStrArray<T>, TConf>
  }

  /**
   * Capitalizes the first letter of **output** strings.
   * @returns The updated SchemaString instance with capitalization transformation applied to **output** strings.
   * @example
   * ```ts
   * const schema = r.string().toCapitalize()
   * const result = schema.parseTyped('john') // 'John'
   * ```
   */
  public toCapitalize() {
    this.transformerMode = 'capital'
    this.schema = this.schema.map((str) => this.transform(str)) as T
    return this as unknown as SchemaString<CapitalizeStrArray<T>, TConf>
  }

  /**
   * Enables case-sensitive comparison of input strings.
   * @returns The updated SchemaString instance with case-sensitive input comparison enabled.
   * @example
   * ```ts
   * const schema = r.string().caseSensitiveInput()
   * const result = schema.parseTyped('John') // 'John'
   * const result2 = schema.parseTyped('john') // Error
   * ```
   */
  public caseSensitiveInput() {
    this.isCaseSensitiveInput = true
    return this
  }

  /**
   * Sets the minimum allowed character length for input strings.
   * @param number - The minimum character length.
   * @returns The updated SchemaString instance with the minimum character length set.
   * @example
   * ```ts
   * const schema = r.string().minLength(3)
   * const result = schema.parseTyped('John') // 'John'
   * const result2 = schema.parseTyped('Jo') // Error
   * ```
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
   * @example
   * ```ts
   * const schema = r.string().maxLength(3)
   * const result = schema.parseTyped('John') // 'Joh'
   * const result2 = schema.parseTyped('John', false) // Error
   * const result2 = schema.parseTyped('Jo') // 'Jo'
   * ```
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
   * @example
   * ```ts
   * const schema = r.string().regex(/^[a-z]+$/)
   * const result = schema.parseTyped('John') // Error
   * const result2 = schema.parseTyped('john') // 'john'
   * ```
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

export namespace SchemaString {
  export type Input = string[]
  export type Sample = SchemaString<any, any>
}
