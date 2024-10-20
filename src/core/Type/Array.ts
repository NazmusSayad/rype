import {
  TypeSchemaUnion,
  ExtractArrayLike,
  AdjustReadonlyObject,
} from './_common.type'
import { SchemaOr } from './Or'
import { RypeOk } from '@/RypeOk'
import { RypeError } from '@/Error'
import messages from '@/errorMessages'
import { ObjectMerge, Prettify } from '@/utils.type'
import { SchemaFreezableCore } from '@/core/SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '@/config'
import { InferClassFromSchema } from '@/core/Extract.type'

export class SchemaArray<
  T extends SchemaArray.Input,
  R extends SchemaConfig & SchemaArray.Config
> extends SchemaFreezableCore<T, R> {
  protected name = 'array' as const

  protected getType(): string[] {
    return [this.config.convertToSet ? 'set' : this.name]
  }

  protected checkTypeOnly(inputs: unknown[], conf: SchemaCheckConf) {
    if (!Array.isArray(inputs)) {
      return this.getErr(
        inputs,
        messages.getTypeErr(conf.path, { TYPE: this.type })
      )
    }
  }

  protected checkTypeAndGet(
    inputs: unknown[],
    conf: SchemaCheckConf
  ): RypeError | RypeOk {
    if (this.schema.length === 0 || inputs.length === 0) {
      return new RypeOk(inputs)
    }

    const output: unknown[] = []
    const schema =
      this.schema.length === 1
        ? this.schema[0]
        : new SchemaOr(this.schema, { isRequired: true })

    for (let i = 0; i <= inputs.length - 1; i++) {
      const input = inputs[i]
      const path = `${conf.path}array[${i}]`
      const result = schema['checkAndThrowError'](input, {
        ...conf,
        path,
      })

      if (result instanceof RypeOk) {
        output.push(result.value)
      }
    }

    return new RypeOk(output)
  }

  protected preCheckInputFormatter(inputs: unknown) {
    return this.config.convertToSet ? [...new Set(inputs as unknown[])] : inputs
  }

  protected postCheckFormatter(result: RypeOk) {
    if (this.config.convertToSet) {
      result.value = new Set(result.value as unknown[])
    }

    return result
  }

  /**
   * Convert the array to a set.
   * @example
   * ```ts
   * const schema = r.array(string(), number()).toSet()
   * const result = schema.parse(['a', 1, 'a', 2])
   * const result = schema.parse(new Set(['a', 1, 'a', 2]))
   * // Set { 'a', 1, 2 }
   * ```
   */
  public toSet() {
    const output = this.superClone<{ convertToSet: true }, 'convertToReadonly'>(
      {
        convertToSet: true,
      }
    )

    output.canConvertToReadonly = false
    return output
  }
}

export namespace SchemaArray {
  export type Config = { convertToSet?: boolean }

  export type Input = TypeSchemaUnion[]
  export type Sample = SchemaArray<any, any>

  type ArrayOrSet<
    I,
    T extends Sample,
    TMode = 'input' | 'output'
  > = T['config']['convertToSet'] extends true
    ? TMode extends 'input'
      ? Set<I> | I[]
      : Set<I>
    : I[]

  export type Extract<
    T extends Sample,
    TMode extends 'input' | 'output',
    // NOTE: Not intended for input.
    Z = ExtractArrayLike<T, TMode>
  > = Z[keyof Z] extends never
    ? ArrayOrSet<any, T, TMode>
    : AdjustReadonlyObject<T, ArrayOrSet<Prettify<Z[keyof Z]>, T, TMode>>
}
