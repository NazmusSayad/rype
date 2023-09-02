console.clear()
import r from './index'

const schema = r.instance(Array)

console.log(schema.parseTyped(['string', 100]))