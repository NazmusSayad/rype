import {
  Prettify,
  SplitStringBySpace,
  ArrayOfStrToObjectAsKey,
} from './utils.type'
export default {
  getRequiredErr: $((data) => `Value is required ${data.PATH}`),

  getNumberMinErr: $<'MIN'>(
    (data) => `Number must be greater than: ${data.MIN} ${data.PATH}`
  ),

  getNumberMaxErr: $<'MAX'>(
    (data) => `Number must be less than: ${data.MAX} ${data.PATH}`
  ),

  getStringMinLengthErr: $<'MIN'>(
    (data) =>
      `Input should consist of at least: ${data.MIN} characters ${data.PATH}`
  ),

  getStringMaxLengthErr: $<'MAX'>(
    (data) =>
      `Input must not exceed a length of: ${data.MAX} characters ${data.PATH}`
  ),

  getStringRegexErr: $<'INPUT REGEX'>(
    (data) =>
      `${data.INPUT} does not match the required pattern: ${data.REGEX} ${data.PATH}`
  ),

  getTypeErr: $<'TYPE'>(
    (data) =>
      `Input does not match the expected type: ${data.TYPE} ${data.PATH}`
  ),

  getInstanceErr: $<'Instance'>(
    (data) => `Input isn't an instance of ${data.Instance} ${data.PATH}`
  ),

  getTupleLengthError: $<'LENGTH'>(
    (data) =>
      `Tuple length should match the expected length: ${data.LENGTH} ${data.PATH}`
  ),

  getPrimitiveTypeError: $<'INPUT TYPE'>(
    (data) =>
      `Value ${data.INPUT} is not compatible with type: ${data.TYPE} ${data.PATH}`
  ),
}

function $<
  const S extends string = '',
  Data = Omit<ArrayOfStrToObjectAsKey<SplitStringBySpace<S>>, 'PATH'>
>(fn: (data: Prettify<Data & { PATH: string }>) => string) {
  return function (path: string, data: Prettify<Data>) {
    return fn({ ...data, PATH: path ? 'at ' + path : '' }).trim()
  }
}
