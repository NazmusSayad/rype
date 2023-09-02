console.clear()
import r from './index'

const result = r
  .record(r.string('Boom', 'Test'))
  .toReadonly()
  .parseTyped({ name: 'Boom' })

console.log(result)
