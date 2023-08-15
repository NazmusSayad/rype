import r, { env } from './index'

process.env.VARIABLE_ONE = '123'
// process.env.VARIABLE_TWO = undefined

const result = env({
  VARIABLE_ONE: r.number(),
  VARIABLE_TWO: r.boolean().default(true),
})

console.log(result)
