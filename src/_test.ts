import r from './index'

try {
  const result = r(r.object({ name: r.string() }))({})

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
