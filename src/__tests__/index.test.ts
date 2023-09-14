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

  it('optional methods at .o', () => {
    expect(typeof r.o.object).toBe('function')
    expect(typeof r.o.or).toBe('function')
    expect(typeof r.o.tuple).toBe('function')
    expect(typeof r.o.array).toBe('function')
    expect(typeof r.o.string).toBe('function')
    expect(typeof r.o.number).toBe('function')
    expect(typeof r.o.boolean).toBe('function')
  })

  it('optional methods at .opt', () => {
    expect(typeof r.opt.object).toBe('function')
    expect(typeof r.opt.or).toBe('function')
    expect(typeof r.opt.tuple).toBe('function')
    expect(typeof r.opt.array).toBe('function')
    expect(typeof r.opt.string).toBe('function')
    expect(typeof r.opt.number).toBe('function')
    expect(typeof r.opt.boolean).toBe('function')
  })

  it('optional methods at .optional', () => {
    expect(typeof r.optional.object).toBe('function')
    expect(typeof r.optional.or).toBe('function')
    expect(typeof r.optional.tuple).toBe('function')
    expect(typeof r.optional.array).toBe('function')
    expect(typeof r.optional.string).toBe('function')
    expect(typeof r.optional.number).toBe('function')
    expect(typeof r.optional.boolean).toBe('function')
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

  it('optional methods at .o', () => {
    const objectInstance = r.o.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = r.o.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = r.o.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = r.o.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = r.o.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = r.o.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = r.o.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })

  it('optional methods at .opt', () => {
    const objectInstance = r.opt.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = r.opt.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = r.opt.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = r.opt.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = r.opt.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = r.opt.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = r.opt.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })

  it('optional methods at .optional', () => {
    const objectInstance = r.optional.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = r.optional.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = r.optional.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = r.optional.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = r.optional.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = r.optional.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = r.optional.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })
})
