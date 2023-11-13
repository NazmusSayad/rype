import {
  Prettify,
  ObjectMerge,
  ValidObject,
  MakeOptional,
} from '../../utils.type'
import {
  InferSchema,
  AdjustReadonlyObject,
  InferClassFromSchema,
} from '../Extract.type'
import { RypeOk } from '../../RypeOk'
import { RypeError } from '../../Error'
import { TypeSchemaUnion } from './_common.type'
import { SchemaFreezableCore } from '../SchemaCore'
import { SchemaCheckConf, SchemaConfig } from '../../types'

export class SchemaObject<
  T extends InputObject,
  R extends SchemaConfig
> extends SchemaFreezableCore<T, R> {
  name = 'object' as const;

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
  partial(): SchemaObject<
    {
      [K in keyof T]: InferClassFromSchema<
        T[K],
        T[K]['schema'],
        ObjectMerge<T[K]['config'], { isRequired: false }>
      >
    },
    R
  > {
    for (let key in this.schema) {
      this.schema[key].config.isRequired = false
    }

    return this as any /* Typescript Sucks */
  }

  /**
   * Creates a new schema where all properties are marked as required.
   * @returns A new schema with required properties.
   */
  impartial(): SchemaObject<
    {
      [K in keyof T]: InferClassFromSchema<
        T[K],
        T[K]['schema'],
        ObjectMerge<T[K]['config'], { isRequired: true }>
      >
    },
    R
  > {
    for (let key in this.schema) {
      this.schema[key].config.isRequired = true
    }

    return this as any /* Typescript Sucks */
  }

  /**
   * Creates a new schema by selecting specific properties from the original schema.
   * @param args - The keys of the properties to include in the new schema.
   * @returns A new schema with selected properties or an empty schema if no properties are selected.
   */
  pick<Key extends (keyof T)[]>(...args: Key) {
    for (let key in this.schema) {
      if (!args.includes(key)) {
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
      if (args.includes(key)) {
        delete this.schema[key]
      }
    }

    return this as unknown as Key[number] extends never
      ? typeof this
      : SchemaObject<Omit<T, Key[number]>, R>
  }
}

export type InputObject = { [key: string]: TypeSchemaUnion }
export type TypeObject = SchemaObject<any, any>
export type ExtractObject<
  T extends TypeObject,
  TMode extends 'input' | 'output'
> = AdjustReadonlyObject<
  T,
  Prettify<
    MakeOptional<{
      [K in keyof T['schema']]: InferSchema<T['schema'][K], TMode>
    }>
  >
>
