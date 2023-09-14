import {
  UpperCaseStrArray,
  LowerCaseStrArray,
  CapitalizeStrArray,
} from '../../utils.type'
import { RypeOk } from '../../RypeOk'
import messages from '../../errorMessages'
import { SchemaPrimitiveCore } from '../SchemaCore'
import { RypeError, RypeDevError } from '../../Error'
import { SchemaCheckConf, SchemaConfig } from '../../types'

export class SchemaString<
  T extends InputString,
  TConf extends SchemaConfig
> extends SchemaPrimitiveCore<
  T[number] extends never ? InputString : T,
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

export type InputString = string[]
export type TypeString = SchemaString<any, any>
