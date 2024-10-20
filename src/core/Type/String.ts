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
  TConf extends SchemaConfig & {
    minCharLength?: number
    maxCharLength?: number
    cutAtMaxLength?: boolean
    regexPattern?: RegExp
    isCaseSensitiveInput?: boolean
    transformerMode?: 'capital' | 'lower' | 'upper'
  }
> extends SchemaPrimitiveCore<
  T[number] extends never ? SchemaString.Input : T,
  TConf
> {
  protected name = 'string' as const

  private confirmNotUsingFixedValues() {
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
  public toLowerCase(): SchemaString<LowerCaseStrArray<T>, TConf> {
    const schema = this.superClone({ transformerMode: 'lower' })
    schema.schema = schema.schema.map((str) => schema.transform(str))
    return schema as any // TypeScript SCREAMS without this
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
  public toUpperCase(): SchemaString<UpperCaseStrArray<T>, TConf> {
    const schema = this.superClone({ transformerMode: 'upper' })
    schema.schema = schema.schema.map((str) => schema.transform(str))
    return schema as any // TypeScript SCREAMS without this
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
  public toCapitalize(): SchemaString<CapitalizeStrArray<T>, TConf> {
    const schema = this.superClone({ transformerMode: 'capital' })
    schema.config.transformerMode = 'capital'
    schema.schema = schema.schema.map((str) => schema.transform(str))
    return schema as any // TypeScript SCREAMS without this
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
    return this.superClone({ isCaseSensitiveInput: true })
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
    this.confirmNotUsingFixedValues()
    return this.superClone({ minCharLength: number })
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
    this.confirmNotUsingFixedValues()
    return this.superClone({ maxCharLength: number, cutAtMaxLength: autoSlice })
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
    this.confirmNotUsingFixedValues()
    return this.superClone({ regexPattern: regex })
  }

  private transform(str: string): string {
    switch (this.config.transformerMode) {
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

  protected midCheckInputFormatter(input: string) {
    if (this.config.maxCharLength && this.config.cutAtMaxLength) {
      input = (input as string).slice(0, this.config.maxCharLength)
    }

    if (this.config.transformerMode && !this.config.isCaseSensitiveInput) {
      return this.transform(input)
    }

    return input
  }

  protected postCheckFormatter(result: RypeOk) {
    if (this.config.transformerMode) {
      result.value = this.transform(result.value as string)
    }

    return result
  }

  protected checkTypeAndGet(input: unknown, conf: SchemaCheckConf): RypeOk | RypeError  {
    if (
      typeof this.config.minCharLength === 'number' &&
      (input as string).length < this.config.minCharLength
    ) {
      return this.getErr(
        input,
        messages.getStringMinLengthErr(conf.path, {
          MIN: String(this.config.minCharLength),
        })
      )
    }

    if (
      typeof this.config.maxCharLength === 'number' &&
      (input as string).length > this.config.maxCharLength
    ) {
      return this.getErr(
        input,
        messages.getStringMaxLengthErr(conf.path, {
          MAX: String(this.config.maxCharLength),
        })
      )
    }

    if (this.config.regexPattern) {
      if (!this.config.regexPattern.test(input as string)) {
        return this.getErr(
          input,
          messages.getStringRegexErr(conf.path, {
            INPUT: JSON.stringify(input),
            REGEX: String(this.config.regexPattern),
          })
        )
      }
    }

    return new RypeOk(input as string)
  }
}

export namespace SchemaString {
  export type Input = string[]
  export type Sample = SchemaString<any, any>
}
