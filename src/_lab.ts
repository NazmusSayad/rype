import r from './index'

console.log(
  r.object({ name: r.string(), age: r.o.number() }).parse({
    name: 'Dave',
  })
)
