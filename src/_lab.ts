import r from './index'
console.clear()

const schema = r.number().int('floor')
const result = schema.parse(100.1)

console.log(result)


