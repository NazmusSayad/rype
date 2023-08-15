import r from './index'

const result = r
  .tuple(r.object({ name: r.string() }))
  .toReadonly()
  .parseTyped([{ name: 'John' }])
