import { base } from './base'
import typeMethods from './typeMethods'
import { EnvSchema } from './Type-type'
import { TypeBoolean, TypeNumber, TypeString } from './Type'

export default function <T extends EnvSchema>(schema: T) {
  const stringSchema: any = {}
  const result: any = {}

  for (let key in schema) {
    stringSchema[key] = (schema as any)[key].required
      ? typeMethods.string()
      : typeMethods.o.string()
  }

  const object = base(stringSchema as typeof schema)(process.env as any)

  for (let key in object) {
    const value = object[key]
    const schemaType = (schema as any)[key]

    result[key] =
      schemaType instanceof TypeString
        ? String(value)
        : schemaType instanceof TypeNumber
        ? Number(value)
        : schemaType instanceof TypeBoolean
        ? value === 'true' ||
          value === 'True' ||
          value === 'TRUE' ||
          value === '1'
        : null
  }

  return object
}
