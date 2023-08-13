import r from './index'

try {
  const result = r.noCheck(r.array(r.string()))(['aksdjfk', 100])

  const schema = r(r.string().default('Boom'))(null)
  console.log(schema)

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
