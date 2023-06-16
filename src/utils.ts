import { SuffixedKeys, ValidObject } from './utils-type'

export function combine<T extends Function, U extends ValidObject>(
  fn: T,
  obj: U
) {
  for (let key in obj) (fn as any)[key] = obj[key]
  return fn as U & T
}

export function suffixedKeys<T extends object, const S extends string>(
  methods: T,
  suffix: S
) {
  const result: any = {}
  for (let key in methods) {
    result[key + suffix] = methods[key]
  }

  return result as SuffixedKeys<T, typeof suffix>
}
