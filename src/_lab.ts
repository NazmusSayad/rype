import r from './index'

const schema = r.array(r.string(), r.number(2, 4, 5, 4)).toSet()
schema.parseTyped([2, '2'], '2')

type Input = r.inferInput<typeof schema> // Set<string | number>
type Output = r.inferOutput<typeof schema> // Set<string | number>
