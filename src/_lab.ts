import r from './index'
console.clear()

const schema = r.object({ name: r.string() }).required()
