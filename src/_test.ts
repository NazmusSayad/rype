import r from './index'

try {
  const result = r.noCheck(r.or(r.string()))(['aksdjfk', 100])

  const value = r(r.o.number(100, 200))(null, 'Matha')
  console.log(value)

  r.string().default('boom').config.defaultValue

  console.log()
  console.log('Result:')
  console.log(result)
  console.log()
} catch (err: any) {
  console.log()
  console.log('Error:')
  console.log(err.message)
  console.log()
}

console.log(r.string().type)
