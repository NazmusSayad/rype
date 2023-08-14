import r from './index'

try {
  const result = r.array(r.string('Boom')).typedParse(['Boom'])

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
