import { MakeOptional } from './utils.type'

type Object = { name?: string }
type result = MakeOptional<Object>[keyof Object]
