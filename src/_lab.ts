import { env } from './env'
import { r } from './index'
console.clear()

const result = env({
  NAME: r.string().setRequiredErrMsg('Name is required'),
})

console.log(result)
