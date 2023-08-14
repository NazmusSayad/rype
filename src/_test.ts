import r from './index'

try {
  const result = r.noCheck(r.or(r.string()))(['aksdjfk', 100])

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
