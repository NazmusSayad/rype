import r from './index'

const schema = r.object({
  name: r.string().input('username'),
})

const result = schema.parseTyped({
  username: 'John',
})

type Input = r.inferInput<typeof schema>
type Output = r.inferOutput<typeof schema>

console.log(result)
