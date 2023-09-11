import r from './index'

console.log(
  r
    .object({
      name: r.string(),
      age: r.number().default(() => 100),
    })
    .parse({
      name: 'Dave',
    })
)
