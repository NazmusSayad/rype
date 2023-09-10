import { env } from './env'
import r from './index'

{
  delete process.env.VARIABLE_ONE
  delete process.env.VARIABLE_TWO
  delete process.env.VARIABLE_THREE

  process.env.VARIABLE_ONE = '123'

  const result = env({
    VARIABLE_ONE: r.number(),
    VARIABLE_TWO: r.boolean().default(true),
    VARIABLE_THREE: r.number().default(100),
    VARIABLE_Four: r.o.number(),
  })

  console.log(result)
}
