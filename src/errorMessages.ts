import { ExtractPlaceholderValues, Prettify } from './utils-type'
function createMessage<S extends string>(input: S) {
  type Data = { [i in ExtractPlaceholderValues<S>]: string }
  return function (path: string, data: Prettify<Omit<Data, 'PATH'>>) {
    let result = input.toString()
    const conf: any = { ...data, PATH: path || '' }

    for (let key in conf) {
      const value = conf[key]

      result = result.replaceAll(
        `<$${key}$>`,
        key === 'PATH' ? (value ? `for \`${value}\`` : '') : `\`${value}\``
      )
    }

    return result.trim()
  }
}

const errorMessages = {
  requiredError: 'Input is required <$PATH$>',
  orTypeError: 'Input is not assignable to type <$TYPE$> <$PATH$>',
  primitiveTypeError: '<$INPUT$> is not assignable to type <$TYPE$> <$PATH$>',
  unknownInstanceError:
    'Object needs to be an instance of <$CONSTRUCTOR$> <$PATH$>',
  tupleLengthError:
    'Tuple length need to be as same as schema length: <$LENGTH$>',
} as const

export default {
  getRequiredErr: createMessage(errorMessages.requiredError),
  getOrTypeErr: createMessage(errorMessages.orTypeError),
  getUnknownInstanceError: createMessage(errorMessages.unknownInstanceError),
  getTupleLengthError: createMessage(errorMessages.tupleLengthError),
  getPrimitiveTypeError: createMessage(errorMessages.primitiveTypeError),
}
