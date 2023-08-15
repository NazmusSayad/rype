import r from './index'

const result = r
  .array(r.object({ name: r.string() }))
  .toReadonly()
  .parseTyped([{ name: 'John' }])

console.log(result)
