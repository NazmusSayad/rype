import { r } from '..'
import * as Schema from '../core/Schema'

describe('Rype Methods as exists', () => {
  it('required methods', () => {
    expect(typeof r.object).toBe('function')
    expect(typeof r.or).toBe('function')
    expect(typeof r.tuple).toBe('function')
    expect(typeof r.array).toBe('function')
    expect(typeof r.string).toBe('function')
    expect(typeof r.number).toBe('function')
    expect(typeof r.boolean).toBe('function')
  })

  it('optional methods', () => {
    expect(typeof r.object({}).optional).toBe('function')
    expect(typeof r.or().optional).toBe('function')
    expect(typeof r.tuple().optional).toBe('function')
    expect(typeof r.array().optional).toBe('function')
    expect(typeof r.string().optional).toBe('function')
    expect(typeof r.number().optional).toBe('function')
    expect(typeof r.boolean().optional).toBe('function')
  })
})

describe('Rype Methods should return the schema instances', () => {
  it('required methods', () => {
    const objectInstance = r.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = r.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = r.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = r.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = r.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = r.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = r.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })

  it('optional methods', () => {
    const objectInstance = r.object({}).optional()
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = r.or().optional()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = r.tuple().optional()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = r.array().optional()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = r.string().optional()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = r.number().optional()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = r.boolean().optional()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })
})
