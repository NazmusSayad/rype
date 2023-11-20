import messages from '../errorMessages' // Update the path accordingly

describe('messages', () => {
  it('should create messages with placeholders', () => {
    const getRequiredErr = messages.getRequiredErr('/user/name', {})
    expect(getRequiredErr).toEqual('Value is required at /user/name')
  })

  it('should create messages with dynamic values', () => {
    const getNumberMinErr = messages.getNumberMinErr('/order/quantity', {
      MIN: '5',
    })

    expect(getNumberMinErr).toEqual(
      'Number must be greater than: 5 at /order/quantity'
    )
  })

  it('should replace placeholders correctly', () => {
    const getStringRegexErr = messages.getStringRegexErr('/user/email', {
      INPUT: 'invalid-email',
      REGEX: String(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
    })

    expect(getStringRegexErr).toEqual(
      'invalid-email does not match the required pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$/ at /user/email'
    )
  })
})
