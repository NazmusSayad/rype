import r from './index'

try {
  const schema = r.or()

  const result = schema.typedParse('Boom')

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
