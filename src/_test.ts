import r from './index'

try {
  const schema = r.checkAll(r.object({ name: r.string().default('Boom') }))

  const result = schema({})

  type Input = Parameters<typeof schema>[0]
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
