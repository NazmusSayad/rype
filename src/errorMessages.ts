const errorMessages = {
  requiredError: ':PATH: is required',
  unknownInstanceError: `Input needs to be an instance of :CONSTRUCTOR: at :PATH:`,
  tupleLengthError:
    'Input length need to be as same as schema length: :LENGTH:',
  orTypeError: 'Input is not assignable to type :TYPE: at :PATH:',
  primitiveTypeError:
    'Input :INPUT: is not assignable to type :TYPE: at :PATH:',
}

// TODO:
export const messages = {
  getRequired(path: string) {
    return errorMessages.requiredError.replace(':PATH:', path)
  },
}

export default errorMessages
export function init(messages: typeof errorMessages) {
  Object.assign(errorMessages, messages)
}
