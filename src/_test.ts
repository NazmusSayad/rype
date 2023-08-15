import r from './index'

const result = r
  .object({
    name: r.string('John Doe'),
    age: r.o.number().default(0),
    hobbies: r.tuple(r.string('Play')),
    intro: r.object({ address: r.string('BD') }),
    jobs: r.tuple(r.object({ name: r.number(200) })),
    asdf: r.tuple(r.string()),
  })
  .filter({})

console.log(result)
