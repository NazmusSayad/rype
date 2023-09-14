import r from './index'

const schema = r
  .object({
    name: r.string(),
    age: r.number().default(() => 100),
  })
  .partial()

const result = schema.parse({})
console.log(result)
