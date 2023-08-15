import r from '../index'

describe('Validation Library', () => {
  it('should validate string values', () => {
    const result1 = r.string().parseTyped('Boom')
    expect(result1).toBe('Boom')

    const result2 = r.string('Boom', 'Fire').parseTyped('Boom')
    expect(result2).toBe('Boom')

    const result3 = r.string('string').parseTyped('string')
    expect(result3).toBe('string')

    const result4 = r.string('string', 'String').parseTyped('String')
    expect(result4).toBe('String')
  })

  it('should throw an error', () => {
    expect(() => {
      r.string().parse(100)
    }).toThrow()

    expect(() => {
      r.string('Boom', 'Fire').parse('Boom1')
    }).toThrow()
  })
})
