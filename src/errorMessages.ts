const errorMessages = {
  requiredError: ':PATH: is required',
  orTypeError: 'Input is not assignable to type :TYPE: at :PATH:',
  unknownInstanceError: `Input needs to be an instance of :CONSTRUCTOR: at :PATH:`,
  primitiveTypeError:
    'Input :INPUT: is not assignable to type :TYPE: at :PATH:',
  tupleLengthError:
    'Input length need to be as same as schema length: :LENGTH:',
}

export default errorMessages
export function init(messages: typeof errorMessages) {
  Object.assign(errorMessages, messages)
}
