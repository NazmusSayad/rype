import { ValidObject } from './utils.type'

export function combine<T extends Function, U extends ValidObject>(
  fn: T,
  obj: U
) {
  for (let key in obj) {
    ;(fn as unknown as typeof obj)[key] = obj[key]
  }
  return fn as U & T
}
