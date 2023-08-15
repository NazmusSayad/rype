import rype from '..'
import * as Schema from '../core/Schema'

describe('Rype Methods as exists', () => {
  it('required methods', () => {
    expect(typeof rype.object).toBe('function')
    expect(typeof rype.or).toBe('function')
    expect(typeof rype.tuple).toBe('function')
    expect(typeof rype.array).toBe('function')
    expect(typeof rype.string).toBe('function')
    expect(typeof rype.number).toBe('function')
    expect(typeof rype.boolean).toBe('function')
  })

  it('optional methods at .o', () => {
    expect(typeof rype.o.object).toBe('function')
    expect(typeof rype.o.or).toBe('function')
    expect(typeof rype.o.tuple).toBe('function')
    expect(typeof rype.o.array).toBe('function')
    expect(typeof rype.o.string).toBe('function')
    expect(typeof rype.o.number).toBe('function')
    expect(typeof rype.o.boolean).toBe('function')
  })

  it('optional methods at .opt', () => {
    expect(typeof rype.opt.object).toBe('function')
    expect(typeof rype.opt.or).toBe('function')
    expect(typeof rype.opt.tuple).toBe('function')
    expect(typeof rype.opt.array).toBe('function')
    expect(typeof rype.opt.string).toBe('function')
    expect(typeof rype.opt.number).toBe('function')
    expect(typeof rype.opt.boolean).toBe('function')
  })

  it('optional methods at .optional', () => {
    expect(typeof rype.optional.object).toBe('function')
    expect(typeof rype.optional.or).toBe('function')
    expect(typeof rype.optional.tuple).toBe('function')
    expect(typeof rype.optional.array).toBe('function')
    expect(typeof rype.optional.string).toBe('function')
    expect(typeof rype.optional.number).toBe('function')
    expect(typeof rype.optional.boolean).toBe('function')
  })
})

describe('Rype Methods should return the schema instances', () => {
  it('required methods', () => {
    const objectInstance = rype.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = rype.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = rype.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = rype.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = rype.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = rype.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = rype.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })

  it('optional methods at .o', () => {
    const objectInstance = rype.o.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = rype.o.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = rype.o.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = rype.o.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = rype.o.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = rype.o.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = rype.o.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })

  it('optional methods at .opt', () => {
    const objectInstance = rype.opt.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = rype.opt.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = rype.opt.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = rype.opt.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = rype.opt.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = rype.opt.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = rype.opt.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })

  it('optional methods at .optional', () => {
    const objectInstance = rype.optional.object({})
    expect(objectInstance).toBeInstanceOf(Schema.SchemaObject)

    const orInstance = rype.optional.or()
    expect(orInstance).toBeInstanceOf(Schema.SchemaOr)

    const tupleInstance = rype.optional.tuple()
    expect(tupleInstance).toBeInstanceOf(Schema.SchemaTuple)

    const arrayInstance = rype.optional.array()
    expect(arrayInstance).toBeInstanceOf(Schema.SchemaArray)

    const stringInstance = rype.optional.string()
    expect(stringInstance).toBeInstanceOf(Schema.SchemaString)

    const numberInstance = rype.optional.number()
    expect(numberInstance).toBeInstanceOf(Schema.SchemaNumber)

    const booleanInstance = rype.optional.boolean()
    expect(booleanInstance).toBeInstanceOf(Schema.SchemaBoolean)
  })
})
