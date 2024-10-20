import { RypeOk } from '@/RypeOk'
import messages from '@/errorMessages'
import { SchemaPrimitiveCore } from '@/core/SchemaCore'
import { RypeError, RypeDevError } from '@/Error'
import { SchemaCheckConf, SchemaConfig } from '@/config'

export class SchemaNumber<
  T extends SchemaNumber.Input,
  R extends SchemaConfig & {
    isInt?: boolean
    autoIntFormat?: 'round' | 'ceil' | 'floor'
    minValue?: number
    maxValue?: number
  }
> extends SchemaPrimitiveCore<
  T[number] extends never ? SchemaNumber.Input : T,
  R
> {
  protected name = 'number' as const

  private confirmNotUsingCustomValues() {
    if (this.schema.length > 0) {
      throw new RypeDevError(
        "You can't use min/max while using specific number"
      )
    }
  }

  /**
   * Sets the schema to only accept integer values and configures the rounding mode for non-integer values.
   * @param autoFormatMode `round | ceil | floor` - The rounding mode to apply to non-integer values. Default is 'floor'.
   * @returns The updated SchemaNumber instance with integer validation and rounding mode set.
   * @example
   * ```ts
   * const schema = r.number().int('round')
   * const result = schema.parseTyped(1.5) // 2
   * ```
   */
  public int(autoFormatMode: typeof this.config.autoIntFormat = 'floor') {
    return this.superClone({
      isInt: true,
      autoIntFormat: autoFormatMode,
    })
  }

  /**
   * Sets the minimum allowed value for the schema.
   * @param number - The minimum value that is acceptable for the schema.
   * @returns The updated SchemaNumber instance with the minimum value set.
   * @example
   * ```ts
   * const schema = r.number().min(5)
   * const result = schema.parseTyped(4) // Error
   * ```
   */
  public min(number: number) {
    this.confirmNotUsingCustomValues()
    return this.superClone({
      minValue: number,
    })
  }

  /**
   * Sets the maximum allowed value for the schema.
   * @param number - The maximum value that is acceptable for the schema.
   * @returns The updated SchemaNumber instance with the maximum value set.
   * @example
   * ```ts
   * const schema = r.number().max(5)
   * const result = schema.parseTyped(6) // Error
   * ```
   */
  public max(number: number) {
    this.confirmNotUsingCustomValues()
    return this.superClone({
      maxValue: number,
    })
  }

  protected checkTypeAndGet(
    input: number,
    conf: SchemaCheckConf
  ): RypeOk | RypeError  {
    if (Number.isNaN(input)) {
      return this.getErr(
        input,
        messages.getPrimitiveTypeError(conf.path, {
          INPUT: "'NaN'",
          TYPE: this.type,
        })
      )
    }

    if (
      typeof this.config.minValue === 'number' &&
      input < this.config.minValue
    ) {
      return this.getErr(
        input,
        messages.getNumberMinErr(conf.path, {
          MIN: String(this.config.minValue),
        })
      )
    }

    if (
      typeof this.config.maxValue === 'number' &&
      input > this.config.maxValue
    ) {
      return this.getErr(
        input,
        messages.getNumberMaxErr(conf.path, {
          MAX: String(this.config.maxValue),
        })
      )
    }

    if (this.config.isInt && !Number.isInteger(input)) {
      if (this.config.autoIntFormat) {
        const formattedInput = (
          this.config.autoIntFormat === 'round'
            ? Math.round(input)
            : this.config.autoIntFormat === 'ceil'
            ? Math.ceil(input)
            : input
        ).toString()

        return new RypeOk(Number.parseInt(formattedInput))
      }

      return this.getErr(
        input,
        messages.getNumberIntErr(conf.path, {
          INPUT: JSON.stringify(input),
        })
      )
    }

    return new RypeOk(input)
  }
}

export namespace SchemaNumber {
  export type Input = number[]
  export type Sample = SchemaNumber<any, any>
}
