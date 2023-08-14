import r from './index'

try {
  const schema = r.string().minLength(3).maxLength(6)

  const result = schema.typedParse('mi')

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
