import r from './index'

console.log(
  r
    .object({
      person: r
        .object({
          name: r.string().default('Anonymous'),
          age: r.number().default(18),
        })
        .default({}),
    })
    .default({})
    .parseTyped({})
)
