import r from '../..'

describe('Boolean Validation - Comprehensive Tests', () => {
  it('should validate boolean values', () => {
    const validBooleans = [true, false]
    validBooleans.forEach((bool) => {
      const result = r.boolean().parse(bool)
      expect(result).toBe(bool)
    })
  })

  it('should handle optional values', () => {
    const result = r.o.boolean().parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle default values', () => {
    const result1 = r.boolean().default(true).parse(undefined)
    expect(result1).toBe(true)

    const result2 = r.boolean().default(false).parse(undefined)
    expect(result2).toBe(false)
  })

  it('should throw error for invalid boolean values', () => {
    const invalidValues = ['true', 1, {}, null]
    invalidValues.forEach((val) => {
      expect(() => {
        r.boolean().parse(val)
      }).toThrow()
    })
  })

  it('should handle invalid values with defaults', () => {
    const invalidValues = ['true', 1, {}, NaN]
    invalidValues.forEach((val) => {
      expect(() => {
        r.boolean().default(false).parse(val)
      }).toThrow()
    })
  })
})

describe('Boolean Validation - Additional Tests', () => {
  it('should validate boolean values with parseTyped', () => {
    const result1 = r.boolean(true).parse(true)
    expect(result1).toBe(true)

    const result2 = r.boolean(false).parse(false)
    expect(result2).toBe(false)

    const result3 = r.boolean(true, false).parse(true)
    expect(result3).toBe(true)

    const result4 = r.boolean(true, false).parse(false)
    expect(result4).toBe(false)
  })

  it('should throw error for invalid boolean values with parseTyped', () => {
    expect(() => {
      r.boolean(true).parse(false)
    }).toThrow()

    expect(() => {
      r.boolean(false).parse(true)
    }).toThrow()

    expect(() => {
      r.boolean(true, false).parse(null)
    }).toThrow()
  })

  it('should handle optional values with parseTyped', () => {
    const result = r.o.boolean(true).parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle default values with parseTyped', () => {
    const result1 = r.boolean(true).default(true).parse(undefined)
    expect(result1).toBe(true)

    const result2 = r.boolean(false).default(false).parse(undefined)
    expect(result2).toBe(false)
  })

  it('should throw error for invalid values with defaults using parseTyped', () => {
    expect(() => {
      r.boolean(true)
        .default(false as unknown as true)
        .parse(NaN)
    }).toThrow()

    expect(() => {
      r.boolean(false)
        .default(true as unknown as false)
        .parse({})
    }).toThrow()
  })
})
