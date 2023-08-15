import r from '../rype'
import { env } from '../env'

describe('Env function should handle number, boolean and string', () => {
  it('should validate and parse environment variables', () => {
    delete process.env.VARIABLE_ONE
    delete process.env.VARIABLE_TWO
    delete process.env.VARIABLE_THREE

    process.env.VARIABLE_ONE = '123'
    process.env.VARIABLE_TWO = 'true'
    process.env.VARIABLE_THREE = 'hello'

    const result = env({
      VARIABLE_ONE: r.number(),
      VARIABLE_TWO: r.boolean(),
      VARIABLE_THREE: r.string(),
    })

    expect(result).toEqual({
      VARIABLE_ONE: 123,
      VARIABLE_TWO: true,
      VARIABLE_THREE: 'hello',
    })
  })

  it('should handle missing optional variables', () => {
    delete process.env.VARIABLE_ONE
    delete process.env.VARIABLE_TWO
    delete process.env.VARIABLE_THREE

    process.env.VARIABLE_ONE = '123'

    const result = env({
      VARIABLE_ONE: r.number(),
      VARIABLE_TWO: r.o.number(),
    })

    expect(result).toEqual({
      VARIABLE_ONE: 123,
    })
  })

  it('should handle default values', () => {
    delete process.env.VARIABLE_ONE
    delete process.env.VARIABLE_TWO
    delete process.env.VARIABLE_THREE

    process.env.VARIABLE_ONE = '123'

    const result = env({
      VARIABLE_ONE: r.number(),
      VARIABLE_TWO: r.boolean().default(true),
    })

    expect(result).toEqual({
      VARIABLE_ONE: 123,
      VARIABLE_TWO: true,
    })
  })
})
