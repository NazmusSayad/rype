import r from './index'

try {
  const schema = r.checkAll(
    r.number().default(100)
  )

  const result = schema(100)

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
