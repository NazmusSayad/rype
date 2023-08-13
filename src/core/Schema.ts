import {
  RypeError,
  RypeDevError,
  RypeTypeError,
  RypeRequiredError,
} from '../Error'
import { RypeOk } from '../RypeOk'
import * as Type from './Schema.type'
import { SchemaName } from './symbols'
import messages from '../errorMessages'
import { SchemaCheckConf, SchemaConfig } from '../types'
import { ValidConstructor, ValidObject } from '../utils.type'
import { ExtractSchemaFromAny, InferClassFromSchema } from './Extract.type'

class SchemaCore<const TFormat, TConfig extends SchemaConfig> {
  name = SchemaName.core
  schema: TFormat
  config: TConfig
  constructor(schema: TFormat, config: TConfig) {
    this.schema = schema
    this.config = config
  }

  get type(): string {
    return [...new Set([this._getType()].flat())].join(' | ')
  }

  default(
    value: ExtractSchemaFromAny<typeof this>
  ): InferClassFromSchema<
    typeof this,
    TFormat,
    { isRequired: false; defaultValue: unknown }
  > {
    if (!(this.name in ConstructorMap)) {
      throw new RypeDevError(this.name + " must have a 'Constructor' property")
    }

    const Constructor = ConstructorMap[
      this.name as keyof typeof ConstructorMap
    ] as ValidConstructor

    return new Constructor(this.schema, {
      isRequired: false,
      defaultValue: value,
    })
  }

  /**
   * This is a method in MyClass that does something useful.
   *
   *  ⚠️Warning: This can throw error
   * @param {unknown} input - This is the value that will recieve from user
   * @param {SchemaCheckConf} conf - Some configuration for crazy stuff
   * @returns {unknown} If everything is ok this will return the result, but if error occurs this will throw the error
   */
  _checkAndGetResult(input: unknown, conf: SchemaCheckConf): unknown {
    const output = this._checkAndThrowError(input, conf)
    if (output instanceof RypeOk) return output.value
    return undefined
  }

  _checkAndThrowError(input: unknown, conf: SchemaCheckConf) {
    const output = this._checkCore(input, conf)
    if (output instanceof RypeError && conf.throw) throw output
    return output
  }

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

    const result1 = this._checkType(input, conf)
    if (result1 instanceof RypeError) return result1
    if (this._checkType2) return this._checkType2(input, conf)
    return result1
  }

  _checkType(input: unknown, conf: SchemaCheckConf): RypeOk | RypeError {
    return new RypeError(this.name + " isn't implemented yet!")
  }

  _checkType2?: (input: unknown, conf: SchemaCheckConf) => RypeOk | RypeError

  _getType(): string[] {
    return [this.name]
  }

  _getErr(input: unknown, message: string) {
    return new RypeTypeError(message, this.schema, input, this.config)
  }

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
    const schema = this.schema

    if (
      typeof input !== this.name ||
      (schema.length && !schema.includes(input as never))
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

    if (!Array.isArray(inputs)) {
      return this._getErr(
        inputs,
        messages.getOrTypeErr(conf.path, { TYPE: this.type })
      )
    }

    for (let i = 0; i <= inputs.length - 1; i++) {
      const input = inputs[i]
      const path = `${conf.path}array[${i}]`
      const schema = new SchemaOr(this.schema, { isRequired: true })
      const result = schema._checkAndThrowError(input, {
        ...conf,
        getUnthrownError: true,
        path,
      })

      if (result instanceof RypeOk) output.push(result.value)
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
      if (result instanceof RypeOk) {
        return new RypeOk(result.value)
      }
    }

    return this._getErr(
      input,
      messages.getOrTypeErr(conf.path, {
        TYPE: this.type,
      })
    )
  }
}

const ConstructorMap = {
  [SchemaName.string]: SchemaString,
  [SchemaName.number]: SchemaNumber,
  [SchemaName.boolean]: SchemaBoolean,

  [SchemaName.array]: SchemaArray,
  [SchemaName.tuple]: SchemaTuple,
  [SchemaName.object]: SchemaObject,

  [SchemaName.or]: SchemaOr,
}
