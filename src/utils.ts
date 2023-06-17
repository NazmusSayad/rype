import { SuffixedKeys, ValidObject } from './utils-type'

export function combine<T extends Function, U extends ValidObject>(
  fn: T,
  obj: U
) {
  for (let key in obj) (fn as any)[key] = obj[key]
  return fn as U & T
}

export function combineForTwoArgs<
  T extends (...args: any[]) => any,
  U extends (...args: any[]) => any
>(oneArg: T, twoArg: U) {
  const dualFn = function (...args: any[]) {
    if (args.length === 0) throw new Error('')
    if (args.length === 1) return oneArg(args[0])
    if (args.length === 2) return twoArg(args[0], args[1])
    throw new Error('')
  }

  return dualFn as T & U
}
