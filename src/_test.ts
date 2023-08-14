import r from './index'

try {
  const schema = r.number().min(100).max(200)

  const result = schema.safeParse(200)

  type Input = Parameters<(typeof schema)['typedParse']>[0]
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
