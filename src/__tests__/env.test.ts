import { env, r } from '..'

describe('Env function should handle number, boolean and string', () => {
  beforeEach(() => {
    for (const key in process.env) {
      if (key.startsWith('VARIABLE_')) delete process.env[key]
    }
  })

  it('should validate and parse environment variables', () => {
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
    process.env.VARIABLE_ONE = '123'

    const result = env({
      VARIABLE_ONE: r.number(),
      VARIABLE_TWO: r.number().optional(),
    })

    expect(result).toEqual({
      VARIABLE_ONE: 123,
    })
  })

  it('should handle default values', () => {
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
