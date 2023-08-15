import r from '../..'

describe('Number Validation', () => {
  it('should validate number values', () => {
    const result1 = r.number().parse(42)
    expect(result1).toBe(42)

    const result2 = r.number().parse(-10)
    expect(result2).toBe(-10)

    const result3 = r.number().parse(3.14)
    expect(result3).toBe(3.14)
  })

  it('should handle optional values', () => {
    const result1 = r.o.number().parse(undefined)
    expect(result1).toBe(undefined)
  })

  it('should handle min constraint', () => {
    const result1 = r.number().min(5).parse(10)
    expect(result1).toBe(10)
    expect(() => r.number().min(5).parse(2)).toThrow()
  })

  it('should handle max constraint', () => {
    const result1 = r.number().max(50).parse(25)
    expect(result1).toBe(25)
    expect(() => r.number().max(50).parse(75)).toThrow()
  })

  it('should handle min and max constraints', () => {
    const result1 = r.number().min(10).max(20).parse(15)
    expect(result1).toBe(15)
    expect(() => r.number().min(10).max(20).parse(5)).toThrow()
    expect(() => r.number().min(10).max(20).parse(25)).toThrow()
  })

  it('should handle default values', () => {
    const result1 = r.number().default(0).parse(undefined)
    expect(result1).toBe(0)
  })

  it('should handle min constraint with default', () => {
    const result1 = r.number().min(5).default(5).parse(undefined)
    expect(result1).toBe(5)

    const result2 = r.number().min(10).default(10).parse(undefined) // Should throw an error
    expect(result2).toBe(10)
  })

  it('should handle max constraint with default', () => {
    const result1 = r.number().max(50).default(25).parse(undefined)
    expect(result1).toBe(25)

    const result2 = r.number().max(30).default(40).parse(undefined) // Should throw an error
    expect(result2).toBe(40)
  })

  it('should handle min and max constraints with default', () => {
    const result1 = r.number().min(10).max(20).default(15).parse(undefined)
    expect(result1).toBe(15)

    const result2 = r.number().min(5).max(10).default(8).parse(undefined) // Should throw an error
    expect(result2).toBe(8)

    const result3 = r.number().min(15).max(25).default(20).parse(undefined) // Should throw an error
    expect(result3).toBe(20)
  })
})

describe('Number Validation - Throw Tests', () => {
  it('should throw error for invalid number values', () => {
    expect(() => {
      r.number().parse('42')
    }).toThrow()

    expect(() => {
      r.number().parse(true)
    }).toThrow()

    expect(() => {
      r.number().parse({})
    }).toThrow()
  })

  it('should throw error for invalid number with constraints', () => {
    expect(() => {
      r.number().min(5).parse(3)
    }).toThrow()

    expect(() => {
      r.number().max(10).parse(15)
    }).toThrow()
  })

  it('should throw error for invalid values with defaults', () => {
    expect(() => {
      r.number().default(0).parse('42')
    }).toThrow()

    expect(() => {
      r.number().default(5).parse(true)
    }).toThrow()

    expect(() => {
      r.number().default(10).parse({})
    }).toThrow()
  })
})

describe('Number Validation - Comprehensive Tests', () => {
  it('should validate number values', () => {
    const validNumbers = [42, -10, 3.14, 0]
    validNumbers.forEach((num) => {
      const result = r.number().parse(num)
      expect(result).toBe(num)
    })
  })

  it('should handle optional values', () => {
    const result = r.o.number().parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle constraints', () => {
    // Test min constraint
    expect(() => {
      r.number().min(10).parse(5)
    }).toThrow()

    // Test max constraint
    expect(() => {
      r.number().max(50).parse(75)
    }).toThrow()

    // Test min and max constraints
    expect(() => {
      r.number().min(10).max(20).parse(5)
    }).toThrow()

    expect(() => {
      r.number().min(10).max(20).parse(25)
    }).toThrow()
  })

  it('should handle default values', () => {
    const result = r.number().default(0).parse(undefined)
    expect(result).toBe(0)
  })

  it('should handle constraints with default', () => {
    // Test min constraint with default
    const result1 = r.number().min(5).default(5).parse(undefined)
    expect(result1).toBe(5)

    // Test min and max constraints with default
    const result2 = r.number().min(10).max(20).default(15).parse(undefined)
    expect(result2).toBe(15)

    // Test max constraint with default
    const result3 = r.number().max(30).default(40).parse(undefined)
    expect(result3).toBe(40)
  })

  it('should throw error for invalid number values', () => {
    const invalidValues = ['42', true, {}, null]
    invalidValues.forEach((val) => {
      expect(() => {
        r.number().parse(val)
      }).toThrow()
    })
  })

  it('should throw error for invalid number with constraints', () => {
    // Test min constraint
    expect(() => {
      r.number().min(5).parse(3)
    }).toThrow()

    // Test max constraint
    expect(() => {
      r.number().max(10).parse(15)
    }).toThrow()
  })
})
