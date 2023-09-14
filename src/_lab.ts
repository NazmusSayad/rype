import { env } from './env'
import { r } from './index'
console.clear()

const result = env({
  NAME: r.string().default('lab'),
})

console.log(result)
