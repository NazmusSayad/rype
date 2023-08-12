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

export function combineForTwoArgs<
  T extends (...args: any[]) => any,
  U extends (...args: any[]) => any
>(oneArg: T, twoArg: U) {
  const conbined = function (...args: any[]) {
    if (args.length === 0) throw new Error('')
    if (args.length === 1) return oneArg(args[0])
    return twoArg(...args)
  }

  return conbined as T & U
}
