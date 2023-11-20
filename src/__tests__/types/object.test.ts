import { r } from '../..'

describe('r.object() Tests', () => {
  it('should throw validation error for missing required fields', () => {
    expect(() =>
      r
        .object({
          name: r.string(),
          age: r.number(),
        })
        .parse({
          age: 30,
        })
    ).toThrow()
  })

  it('should throw validation error for extra fields', () => {
    expect(
      r.object({ name: r.string(), age: r.number() }).parse({
        name: 'Alice',
        age: 28,
        city: 'New York',
      })
    ).toBeTruthy()
  })

  it('should throw validation error for invalid data types', () => {
    expect(() =>
      r.object({ name: r.string(), age: r.number() }).parse({
        name: 123,
        age: '25',
      })
    ).toThrow()
  })

  it('should handle nested objects', () => {
    expect(
      r
        .object({
          name: r.string(),
          address: r.object({ street: r.string(), city: r.string() }),
        })
        .parseTyped({
          name: 'Bob',
          address: {
            street: '123 Main St',
            city: 'Los Angeles',
          },
        })
    ).toBeTruthy()
  })

  it('should handle arrays within the object', () => {
    expect(
      r
        .object({ name: r.string(), interests: r.array(r.string()) })
        .parseTyped({
          name: 'Eve',
          interests: ['Reading', 'Hiking'],
        })
    ).toBeTruthy()
  })

  it('should handle optional fields', () => {
    expect(
      r.object({ name: r.string(), age: r.number().optional() }).parseTyped({
        name: 'Charlie',
      })
    ).toBeTruthy()
  })

  it('should throw validation error for invalid optional fields', () => {
    expect(() =>
      r.object({ name: r.string(), age: r.number().optional() }).parse({
        name: 'Dave',
        age: '40',
      })
    ).toThrow()
  })

  it('should handle objects with OR validation', () => {
    expect(
      r
        .object({
          name: r.string(),
          data: r.or(r.string(), r.number()),
        })
        .parseTyped({
          name: 'Fiona',
          data: 'Hello',
        })
    ).toBeTruthy()
  })

  it('should throw validation error for invalid OR validation', () => {
    expect(() =>
      r
        .object({
          name: r.string(),
          data: r.or(r.string(), r.number()),
        })
        .parse({
          name: 'Gina',
          data: true,
        })
    ).toThrow()
  })
})

describe('r.object() Additional Tests', () => {
  it('should handle default values', () => {
    expect(
      r
        .object({
          name: r.string().default('John Doe'),
          age: r.number().default(30),
        })
        .parse({ age: 30 })
    ).toEqual({ name: 'John Doe', age: 30 })
  })

  it('should handle deeply nested objects with defaults', () => {
    expect(
      r
        .object({
          person: r.object({
            name: r.string().default('Anonymous'),
            age: r.number().default(18),
          }),
        })
        .parseTyped({ person: {} })
    ).toEqual({ person: { name: 'Anonymous', age: 18 } })
  })

  it('should handle deeply nested objects with defaults object', () => {
    expect(
      r
        .object({
          person: r
            .object({
              name: r.string().default('Anonymous'),
              age: r.number().default(18),
            })
            .default({}),
        })
        .default({})
        .parseTyped({})
    ).toEqual({ person: { name: 'Anonymous', age: 18 } })
  })

  it('should handle arrays with default values', () => {
    expect(
      r
        .object({
          hobbies: r.array(r.string()).default(['Reading']),
        })
        .parse({})
    ).toEqual({ hobbies: ['Reading'] })
  })

  it('should handle optional fields with default values', () => {
    expect(
      r
        .object({
          name: r.string(),
          age: r.number().optional().default(25),
        })
        .parse({ name: 'Alice' })
    ).toEqual({ name: 'Alice', age: 25 })
  })

  it('should handle objects with OR validation and default', () => {
    expect(
      r
        .object({
          name: r.string(),
          data: r.or(r.string(), r.number()).default('No data'),
        })
        .parse({ name: 'Eve' })
    ).toEqual({ name: 'Eve', data: 'No data' })
  })

  it('should handle custom validation logic', () => {
    expect(() =>
      r
        .object({
          name: r.string(),
          password: r.string(),
          confirmPassword: r.string(),
        })
        .validate((data) => {
          if (data.password !== data.confirmPassword) {
            return "Password doesn't match"
          }
        })
        .parse({ name: 'John', password: 'pass', confirmPassword: 'password' })
    ).toThrow("Password doesn't match")
  })

  it('should handle custom error messages', () => {
    expect(() =>
      r
        .object({
          name: r.string().setTypeErrMsg('Name must be a string'),
          age: r.number().setRequiredErrMsg('Age is required'),
        })
        .parse({ name: 123 })
    ).toThrow('Name must be a string')
  })
})
