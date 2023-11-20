console.clear()
import { r, InferOutput } from './index'

const schema = r.string().default('value')

type Result = InferOutput<typeof schema>
