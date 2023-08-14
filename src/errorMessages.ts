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
  getRequiredErr: createMessage('Input is required <$PATH$>'),

  getNumberMinErr: createMessage(
    'Number must be greater than <$MIN$> <$PATH$>'
  ),

  getNumberMaxErr: createMessage('Number must be less than <$MAX$> <$PATH$>'),

  getStringMinLengthErr: createMessage(
    'String length must be greater than <$MIN$> <$PATH$>'
  ),

  getStringMaxLengthErr: createMessage(
    'String length must be less than <$MAX$> <$PATH$>'
  ),

  getTypeErr: createMessage(
    'Input is not assignable to type <$TYPE$> <$PATH$>'
  ),

  getTupleLengthError: createMessage(
    'Tuple length need to be as same as schema length: <$LENGTH$> <$PATH$>'
  ),

  getPrimitiveTypeError: createMessage(
    '<$INPUT$> is not assignable to type <$TYPE$> <$PATH$>'
  ),
}
