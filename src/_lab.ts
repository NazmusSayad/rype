import r from './index'

const schema = r
  .object({
    person: r
      .object({
        name: r.string(),
        age: r.number().default(18),
      })
      .default({ name: 'Lol' }),
  })
  .default({})
