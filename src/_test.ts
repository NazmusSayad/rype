import r from './index'

try {
  const schema = r.string().default('boom').setTypeErrMsg('Boom')

  const result = schema.parse(0)

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
