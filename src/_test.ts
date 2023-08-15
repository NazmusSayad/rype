import r from './index'

try {
  const schema = r.object({
    name: r.string(),
    password: r.string(),
    confirmPassword: r.string(),
  })

  const result = schema.filter({})

  type Input = Parameters<(typeof schema)['parseTyped']>[0]
  type Result = typeof result

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
