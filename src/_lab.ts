console.clear()
import r from './index'

const parse = r.object({ name: r.instance(Array<string>, String) }).parseTyped
type result = Parameters<typeof parse>[0]
