import r from '../..'

describe('String Validation', () => {
  it('should validate string values', () => {
    const result1 = r.string().parse('fo')
    expect(result1).toBe('fo')

    const result3 = r.string('bar').parse('bar')
    expect(result3).toBe('bar')

    const result2 = r.string('fo', 'bar').parse('fo')
    expect(result2).toBe('fo')
  })

  it('Should handle optional values', () => {
    const result1 = r.o.string().parse(undefined)
    expect(result1).toBe(undefined)

    const result2 = r.o.string('bar').parse(undefined)
    expect(result2).toBe(undefined)

    const result3 = r.o.string('fo', 'bar').parse(undefined)
    expect(result3).toBe(undefined)
  })

  it('Should handle `minLength` with required schema', () => {
    const result1 = r.string().minLength(2).parse('fo')
    expect(result1).toBe('fo')

    const result2 = r.string().minLength(3).parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `maxLength` with required schema', () => {
    const result1 = r.string().maxLength(2).parse('fo')
    expect(result1).toBe('fo')

    const result2 = r.string().maxLength(3).parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `minLength` and `maxLength` with required schema', () => {
    const result1 = r.string().minLength(2).maxLength(2).parse('fo')
    expect(result1).toBe('fo')

    const result2 = r.string().minLength(3).maxLength(3).parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `minLength` with optional schema', () => {
    const result1 = r.o.string().minLength(2).parse('fo')
    expect(result1).toBe('fo')

    const result2 = r.o.string().minLength(3).parse('bar')
    expect(result2).toBe('bar')

    const result3 = r.o.string().minLength(2).parse(undefined)
    expect(result3).toBe(undefined)

    const result4 = r.o.string().minLength(3).parse(undefined)
    expect(result4).toBe(undefined)
  })

  it('Should handle `maxLength` with optional schema', () => {
    const result1 = r.o.string().maxLength(2).parse('fo')
    expect(result1).toBe('fo')

    const result2 = r.o.string().maxLength(3).parse('bar')
    expect(result2).toBe('bar')

    const result3 = r.o.string().maxLength(2).parse(undefined)
    expect(result3).toBe(undefined)

    const result4 = r.o.string().maxLength(3).parse(undefined)
    expect(result4).toBe(undefined)
  })

  it('Should handle `minLength` and `maxLength` with optional schema', () => {
    const result1 = r.o.string().minLength(2).maxLength(2).parse('fo')
    expect(result1).toBe('fo')

    const result2 = r.o.string().minLength(3).maxLength(3).parse('bar')
    expect(result2).toBe('bar')

    const result3 = r.o.string().minLength(2).maxLength(2).parse(undefined)
    expect(result3).toBe(undefined)

    const result4 = r.o.string().minLength(3).maxLength(3).parse(undefined)
    expect(result4).toBe(undefined)
  })

  it('Should handle defualt values with required schema', () => {
    const result1 = r.string().default('fo').parse(undefined)
    expect(result1).toBe('fo')

    const result2 = r.string().default('fo').parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle defualt values with optional schema', () => {
    const result1 = r.o.string().default('fo').parse(undefined)
    expect(result1).toBe('fo')

    const result2 = r.o.string().default('fo').parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `minLength` with required schema with default', () => {
    const result1 = r.string().minLength(2).default('default').parse(undefined)
    expect(result1).toBe('default')

    const result2 = r.string().minLength(2).default('default').parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `minLength` with optional schema with default', () => {
    const result1 = r.o
      .string()
      .minLength(2)
      .default('default')
      .parse(undefined)
    expect(result1).toBe('default')

    const result2 = r.o.string().minLength(2).default('default').parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `maxLength` with required schema with default', () => {
    const result1 = r.string().maxLength(2).default('default').parse(undefined)
    expect(result1).toBe('default')

    const result2 = r.string().maxLength(3).default('default').parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `maxLength` with optional schema with default', () => {
    const result1 = r.o
      .string()
      .maxLength(2)
      .default('default')
      .parse(undefined)
    expect(result1).toBe('default')

    const result2 = r.o.string().maxLength(3).default('default').parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `minLength` and `maxLength` with required schema with default', () => {
    const result1 = r
      .string()
      .minLength(2)
      .maxLength(4)
      .default('default')
      .parse(undefined)
    expect(result1).toBe('default')

    const result2 = r
      .string()
      .minLength(2)
      .maxLength(4)
      .default('default')
      .parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle `minLength` and `maxLength` with optional schema with default', () => {
    const result1 = r.o
      .string()
      .minLength(2)
      .maxLength(4)
      .default('default')
      .parse(undefined)
    expect(result1).toBe('default')

    const result2 = r.o
      .string()
      .minLength(2)
      .maxLength(4)
      .default('default')
      .parse('bar')
    expect(result2).toBe('bar')
  })

  it('Should handle regular expressions for string validation', () => {
    const result1 = r.string().regex(/abc/).parse('abc')
    expect(result1).toBe('abc')

    const result2 = r.string().regex(/def/).parse('def')
    expect(result2).toBe('def')

    const result3 = r.string().regex(/ghi/).parse('ghi')
    expect(result3).toBe('ghi')
  })

  it('Should handle regular expression with optional schema', () => {
    const result1 = r.o.string().regex(/abc/).parse('abc')
    expect(result1).toBe('abc')

    const result2 = r.o.string().regex(/def/).parse('def')
    expect(result2).toBe('def')

    const result3 = r.o.string().regex(/ghi/).parse('ghi')
    expect(result3).toBe('ghi')

    const result4 = r.o.string().regex(/abc/).parse(undefined)
    expect(result4).toBe(undefined)

    const result5 = r.o.string().regex(/def/).parse(undefined)
    expect(result5).toBe(undefined)
  })

  it('Should handle regular expression with minLength', () => {
    const result1 = r.string().regex(/abc/).minLength(3).parse('abc')
    expect(result1).toBe('abc')

    const result2 = r.string().regex(/def/).minLength(3).parse('def')
    expect(result2).toBe('def')
  })

  it('Should handle regular expression with maxLength', () => {
    const result1 = r.string().regex(/abc/).maxLength(3).parse('abc')
    expect(result1).toBe('abc')

    const result2 = r.string().regex(/def/).maxLength(3).parse('def')
    expect(result2).toBe('def')
  })

  it('Should handle regular expression with minLength and maxLength', () => {
    const result1 = r
      .string()
      .regex(/abc/)
      .minLength(2)
      .maxLength(4)
      .parse('abc')
    expect(result1).toBe('abc')

    const result2 = r
      .string()
      .regex(/def/)
      .minLength(2)
      .maxLength(4)
      .parse('def')
    expect(result2).toBe('def')
  })

  it('Should handle regular expression with default value', () => {
    const result1 = r.string().regex(/abc/).default('default').parse(undefined)
    expect(result1).toBe('default')

    const result2 = r.string().regex(/bar/).default('default').parse('bar')
    expect(result2).toBe('bar')
  })
})

describe('String Validation - ChatGPT', () => {
  it('Should handle a complex combination of constraints and defaults', () => {
    const result1 = r
      .string()
      .minLength(3)
      .maxLength(10)
      .default('default')
      .parse(undefined)
    expect(result1).toBe('default')

    const result2 = r
      .string()
      .minLength(3)
      .maxLength(10)
      .default('default')
      .parse('bar')
    expect(result2).toBe('bar')

    const result3 = r.o
      .string()
      .minLength(3)
      .maxLength(10)
      .default('default')
      .parse(undefined)
    expect(result3).toBe('default')

    const result4 = r.o
      .string()
      .minLength(3)
      .maxLength(10)
      .default('default')
      .parse('bar')
    expect(result4).toBe('bar')
  })

  it('Should handle special characters and whitespace', () => {
    const result1 = r.string().parse('!@#$%^&*()')
    expect(result1).toBe('!@#$%^&*()')

    const result2 = r.string().parse('   whitespace   ')
    expect(result2).toBe('   whitespace   ')
  })

  it('Should handle non-ASCII characters', () => {
    const result1 = r.string().parse('こんにちは')
    expect(result1).toBe('こんにちは')

    const result2 = r.string().parse('你好')
    expect(result2).toBe('你好')
  })

  it('Should handle special string cases', () => {
    const result1 = r.string().parse('null')
    expect(result1).toBe('null')

    const result2 = r.string().parse('undefined')
    expect(result2).toBe('undefined')
  })

  it('Should handle large strings', () => {
    const longString = 'a'.repeat(100000) // A very long string
    const result = r.string().parse(longString)
    expect(result).toBe(longString)
  })
})

describe('String Validation should Throw - ChatGPT', () => {
  it('should throw error for invalid string values', () => {
    expect(() => {
      r.string().parse(123)
    }).toThrow()

    expect(() => {
      r.string('foo').parse('bar')
    }).toThrow()

    expect(() => {
      r.string('foo', 'bar').parse('baz')
    }).toThrow()
  })

  it('should throw error for invalid string with constraints', () => {
    expect(() => {
      r.string().minLength(5).parse('foo')
    }).toThrow()

    expect(() => {
      r.string().maxLength(2, false).parse('bar')
    }).toThrow()
  })

  it('should throw error for invalid regular expression', () => {
    expect(() => {
      r.string().regex(/abc/).parse('def')
    }).toThrow()
  })

  it('should throw error for invalid regular expression with constraints', () => {
    expect(() => {
      r.string().regex(/abc/).minLength(5).parse('abc')
    }).toThrow()

    expect(() => {
      r.string().regex(/abc/).maxLength(2).parse('abc')
    }).toThrow()
  })
})

describe('String Validation should Throw - ChatGPT v2', () => {
  it('should throw error for non-string optional value', () => {
    expect(() => {
      r.o.string().parse(123)
    }).toThrow()

    expect(() => {
      r.o.string().parse(true)
    }).toThrow()

    expect(() => {
      r.o.string().parse({})
    }).toThrow()
  })

  it('should throw error for non-string with minLength constraint', () => {
    expect(() => {
      r.string().minLength(5).parse(123)
    }).toThrow()

    expect(() => {
      r.string().minLength(5).parse(true)
    }).toThrow()

    expect(() => {
      r.string().minLength(5).parse({})
    }).toThrow()
  })

  it('should throw error for non-string with maxLength constraint', () => {
    expect(() => {
      r.string().maxLength(5).parse(123)
    }).toThrow()

    expect(() => {
      r.string().maxLength(5).parse(true)
    }).toThrow()

    expect(() => {
      r.string().maxLength(5).parse({})
    }).toThrow()
  })

  it('should throw error for non-string with regular expression constraint', () => {
    expect(() => {
      r.string().regex(/abc/).parse(123)
    }).toThrow()

    expect(() => {
      r.string().regex(/abc/).parse(true)
    }).toThrow()

    expect(() => {
      r.string().regex(/abc/).parse({})
    }).toThrow()
  })

  it('should throw error for non-string with minLength and regex constraints', () => {
    expect(() => {
      r.string().minLength(3).regex(/abc/).parse(123)
    }).toThrow()

    expect(() => {
      r.string().minLength(3).regex(/abc/).parse(true)
    }).toThrow()

    expect(() => {
      r.string().minLength(3).regex(/abc/).parse({})
    }).toThrow()
  })

  it('should throw error for non-string with maxLength and regex constraints', () => {
    expect(() => {
      r.string().maxLength(5).regex(/abc/).parse(123)
    }).toThrow()

    expect(() => {
      r.string().maxLength(5).regex(/abc/).parse(true)
    }).toThrow()

    expect(() => {
      r.string().maxLength(5).regex(/abc/).parse({})
    }).toThrow()
  })

  it('should throw error for non-string with minLength, maxLength, and regex constraints', () => {
    expect(() => {
      r.string().minLength(2).maxLength(4).regex(/abc/).parse(123)
    }).toThrow()

    expect(() => {
      r.string().minLength(2).maxLength(4).regex(/abc/).parse(true)
    }).toThrow()

    expect(() => {
      r.string().minLength(2).maxLength(4).regex(/abc/).parse({})
    }).toThrow()
  })

  it('should throw error for invalid values with defaults', () => {
    expect(() => {
      r.string().default('foo').parse(123)
    }).toThrow()

    expect(() => {
      r.string().default('foo').parse(true)
    }).toThrow()

    expect(() => {
      r.string().default('foo').parse({})
    }).toThrow()
  })
})

describe('String Validation - Additional Tests', () => {
  it('should handle optional value with minLength constraint', () => {
    const result = r.o.string().minLength(3).parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle optional value with maxLength constraint', () => {
    const result = r.o.string().maxLength(5).parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle optional value with regex constraint', () => {
    const result = r.o.string().regex(/abc/).parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle optional value with minLength and maxLength constraints', () => {
    const result = r.o.string().minLength(2).maxLength(4).parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle optional value with minLength, maxLength, and regex constraints', () => {
    const result = r.o
      .string()
      .minLength(2)
      .maxLength(4)
      .regex(/abc/)
      .parse(undefined)
    expect(result).toBe(undefined)
  })

  it('should handle optional value with default value', () => {
    const result = r.o.string().default('default').parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle non-string optional value with default', () => {
    const result = r.o.string().default('default').parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle non-string with minLength constraint and default', () => {
    const result = r.string().minLength(5).default('default').parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle non-string with maxLength constraint and default', () => {
    const result = r.string().maxLength(5).default('default').parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle non-string with regex constraint and default', () => {
    const result = r.string().regex(/abc/).default('default').parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle non-string with minLength, maxLength, and regex constraints and default', () => {
    const result = r
      .string()
      .minLength(2)
      .maxLength(4)
      .regex(/abc/)
      .default('default')
      .parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle non-string optional value with minLength, maxLength, and regex constraints and default', () => {
    const result = r.o
      .string()
      .minLength(2)
      .maxLength(4)
      .regex(/abc/)
      .default('default')
      .parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle special characters and whitespace with minLength constraint', () => {
    const result = r.string().minLength(3).parse('!@#')
    expect(result).toBe('!@#')
  })

  it('should handle special characters and whitespace with maxLength constraint', () => {
    const result = r.string().maxLength(16).parse('   whitespace   ')
    expect(result).toBe('   whitespace   ')
  })

  it('should handle non-ASCII characters with minLength constraint', () => {
    const result = r.string().minLength(1).parse('你好')
    expect(result).toBe('你好')
  })

  it('should handle non-ASCII characters with maxLength constraint', () => {
    const result = r.string().maxLength(6).parse('こんにちは')
    expect(result).toBe('こんにちは')
  })

  it('should handle special string cases with regex constraint', () => {
    const result1 = r.string().regex(/null/).parse('null')
    expect(result1).toBe('null')

    const result2 = r
      .string()
      .regex(/undefined/)
      .parse('undefined')
    expect(result2).toBe('undefined')
  })

  it('should handle special string cases with minLength and maxLength constraints', () => {
    const result1 = r.string().minLength(4).maxLength(6).parse('null')
    expect(result1).toBe('null')

    const result2 = r.string().minLength(8).maxLength(10).parse('undefined')
    expect(result2).toBe('undefined')
  })

  it('should handle special string cases with default value', () => {
    const result1 = r.string().default('null').parse(undefined)
    expect(result1).toBe('null')

    const result2 = r.string().default('undefined').parse(undefined)
    expect(result2).toBe('undefined')
  })

  it('should handle regular expression with minLength and default value', () => {
    const result = r
      .string()
      .regex(/abc/)
      .minLength(3)
      .default('default')
      .parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle regular expression with minLength, maxLength, and default value', () => {
    const result = r
      .string()
      .regex(/ghi/)
      .minLength(2)
      .maxLength(4)
      .default('default')
      .parse(undefined)
    expect(result).toBe('default')
  })

  it('should handle a combination of minLength, maxLength, regex, and default value', () => {
    const result = r
      .string()
      .minLength(3)
      .maxLength(8)
      .regex(/abc/)
      .default('default')
      .parse(undefined)
    expect(result).toBe('default')
  })

  it('should throw error for invalid string with minLength, maxLength, regex, and default value', () => {
    expect(() => {
      r.string()
        .minLength(3)
        .maxLength(6)
        .regex(/abc/)
        .default('default')
        .parse('def')
    }).toThrow()
  })

  it('should throw error for non-string optional value with minLength, maxLength, regex, and default value', () => {
    expect(() => {
      r.o
        .string()
        .minLength(3)
        .maxLength(6)
        .regex(/abc/)
        .default('default')
        .parse(123)
    }).toThrow()
  })
})

describe('String Validation - Combined Tests', () => {
  it('should handle minLength, toLowerCase, and caseSensitiveInput', () => {
    const result = r
      .string()
      .minLength(5)
      .toLowerCase()
      .caseSensitiveInput()
      .parse('hello')
    expect(result).toBe('hello')
  })

  it('should handle maxLength, toUpperCase, and caseSensitiveInput', () => {
    const result = r
      .string()
      .maxLength(7)
      .toUpperCase()
      .caseSensitiveInput()
      .parse('Hello world!')
    expect(result).toBe('HELLO W')

    const result2 = r
      .string()
      .maxLength(7, false)
      .toUpperCase()
      .caseSensitiveInput()
      .parse('Hello w')
    expect(result2).toBe('HELLO W')
  })

  it('should handle regex, toCapitalize, and caseSensitiveInput', () => {
    const result = r
      .string()
      .regex(/^[A-Za-z]+$/)
      .toCapitalize()
      .caseSensitiveInput()
      .parse('SOmE')
    expect(result).toBe('SOmE')
  })

  it('should handle minLength, maxLength, and toLowerCase', () => {
    const result = r
      .string()
      .minLength(3)
      .maxLength(6)
      .toLowerCase()
      .parse('HeLLo')
    expect(result).toBe('hello')
  })

  it('should handle minLength, maxLength, and toUpperCase', () => {
    const result = r
      .string()
      .minLength(2)
      .maxLength(6)
      .toUpperCase()
      .parse('Hi')
    expect(result).toBe('HI')
  })

  it('should handle minLength, maxLength, and toCapitalize', () => {
    const result = r
      .string()
      .minLength(4)
      .maxLength(8)
      .toCapitalize()
      .parse('fRIENDS')
    expect(result).toBe('FRIENDS')
  })

  it('should handle minLength, regex, and toLowerCase', () => {
    const result = r
      .string()
      .minLength(4)
      .regex(/^[a-z]+$/)
      .toLowerCase()
      .parse('cODE')
    expect(result).toBe('code')
  })

  it('should handle minLength, regex, and toUpperCase', () => {
    const result = r
      .string()
      .minLength(5)
      .regex(/^[A-Z]+$/)
      .toUpperCase()
      .parse('Style')
    expect(result).toBe('STYLE')
  })

  it('should handle minLength, regex, and toCapitalize', () => {
    const result = r
      .string()
      .minLength(3)
      .regex(/^[A-Za-z]+$/)
      .toCapitalize()
      .parse('bold')
    expect(result).toBe('Bold')
  })

  it('should handle maxLength, regex, and toLowerCase', () => {
    const result = r
      .string()
      .maxLength(5)
      .regex(/^[a-z]+$/)
      .toLowerCase()
      .parse('COOL')
    expect(result).toBe('cool')
  })

  it('should handle maxLength, regex, and toUpperCase', () => {
    const result = r
      .string()
      .maxLength(6)
      .regex(/^[A-Z]+$/)
      .toUpperCase()
      .parse('Great')
    expect(result).toBe('GREAT')
  })

  it('should handle maxLength, regex, and toCapitalize', () => {
    const result = r
      .string()
      .maxLength(5)
      .regex(/^[A-Za-z]+$/)
      .toCapitalize()
      .parse('nICE')
    expect(result).toBe('NICE')
  })

  it('should handle minLength, maxLength, regex, and toLowerCase', () => {
    const result = r
      .string()
      .minLength(3)
      .maxLength(6)
      .regex(/^[a-z]+$/)
      .toLowerCase()
      .parse('FUNny')
    expect(result).toBe('funny')
  })

  it('should handle minLength, maxLength, regex, and toUpperCase', () => {
    const result = r
      .string()
      .minLength(5)
      .maxLength(8)
      .regex(/^[A-Z]+$/)
      .toUpperCase()
      .parse('excited')
    expect(result).toBe('EXCITED')
  })

  it('should handle minLength, maxLength, regex, and toCapitalize', () => {
    const result = r
      .string()
      .minLength(4)
      .maxLength(7)
      .regex(/^[A-Za-z]+$/)
      .toCapitalize()
      .parse('weIRD')
    expect(result).toBe('WeIRD')
  })
})
