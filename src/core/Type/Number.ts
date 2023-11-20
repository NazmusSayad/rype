import { RypeOk } from '../../RypeOk'
import messages from '../../errorMessages'
import { SchemaPrimitiveCore } from '../SchemaCore'
import { RypeError, RypeDevError } from '../../Error'
import { SchemaCheckConf, SchemaConfig } from '../../config'

export class SchemaNumber<
  T extends InputNumber,
  R extends SchemaConfig
> extends SchemaPrimitiveCore<T[number] extends never ? InputNumber : T, R> {
  name = 'number' as const
  private minValue?: number
  private maxValue?: number
  private isInt: boolean = false
  private autoIntFormat: 'round' | 'ceil' | 'floor' = 'floor'
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
   */
  int(autoFormatMode: typeof this.autoIntFormat = 'floor') {
    this.isInt = true
    this.autoIntFormat = autoFormatMode
    return this
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
    input: number,
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

    if (typeof this.minValue === 'number' && input < this.minValue) {
      return this['~getErr'](
        input,
        messages.getNumberMinErr(conf.path, {
          MIN: String(this.minValue),
        })
      )
    }

    if (typeof this.maxValue === 'number' && input > this.maxValue) {
      return this['~getErr'](
        input,
        messages.getNumberMaxErr(conf.path, {
          MAX: String(this.maxValue),
        })
      )
    }

    if (this.isInt && !Number.isInteger(input)) {
      if (this.autoIntFormat) {
        const formattedInput = (
          this.autoIntFormat === 'round'
            ? Math.round(input)
            : this.autoIntFormat === 'ceil'
            ? Math.ceil(input)
            : input
        ).toString()

        return new RypeOk(Number.parseInt(formattedInput))
      }

      return this['~getErr'](
        input,
        messages.getNumberIntErr(conf.path, {
          INPUT: JSON.stringify(input),
        })
      )
    }

    return result
  }
}

export type InputNumber = number[]
export type TypeNumber = SchemaNumber<any, any>
