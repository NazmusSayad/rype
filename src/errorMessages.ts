import { ExtractPlaceholderValues, Prettify } from './utils.type'
function createMessage<const S extends string>(input: S) {
  type Data = { [i in ExtractPlaceholderValues<S>]: string }

  return function (path: string, data: Prettify<Omit<Data, 'PATH'>>) {
    let result = input.toString()
    const conf = { ...data, PATH: path || '' }

    for (let key in conf) {
      const value = conf[key as keyof typeof conf]
      const replaceValue =
        key === 'PATH' ? (value ? `at ${value}` : '') : `${value}`

      result = result.replaceAll(`<$${key}$>`, replaceValue)
    }

    return result.trim()
  }
}

export default {
  getRequiredErr: createMessage('Value is required <$PATH$>'),

  getNumberMinErr: createMessage(
    'Number must be greater than <$MIN$> <$PATH$>'
  ),

  getNumberMaxErr: createMessage('Number must be less than <$MAX$> <$PATH$>'),

  getStringMinLengthErr: createMessage(
    'String length must be at least <$MIN$> characters <$PATH$>'
  ),

  getStringMaxLengthErr: createMessage(
    'String length must be at most <$MAX$> characters <$PATH$>'
  ),

  getStringRegexErr: createMessage(
    '<$INPUT$> does not match the required pattern: <$REGEX$> <$PATH$>'
  ),

  getTypeErr: createMessage(
    'Input does not match the expected type: <$TYPE$> <$PATH$>'
  ),

  getTupleLengthError: createMessage(
    'Tuple length should match the expected length: <$LENGTH$> <$PATH$>'
  ),

  getPrimitiveTypeError: createMessage(
    'Value <$INPUT$> is not compatible with type <$TYPE$> <$PATH$>'
  ),
}
