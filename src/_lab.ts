console.clear()
import r from './index'

const schema = r.record(r.string()).pick('test')
type Output = r.inferOutput<typeof schema>

// schema.parse({})
