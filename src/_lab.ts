console.clear()
import { r } from './index'

const schema = r.string().default('value')

type input = Parameters<typeof schema.parseTyped>[0]
