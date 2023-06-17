import w from './index'
import { TypeArray, TypeString, TypeTuple } from './LType'
import { LTypeExtract } from './Extract-type'

const check = {
  name: w.string('hello'),
  ages: w.tuple(w.optional.string('hello')),
}

// const result = w(check, { name: 'hello', ages: ['hello'] })

/* 

// I have a type like this:
type Person = {
  name: string
  age: number | undefined
}

// When I use it like this, its fine:
const person1: Person = { name: 'John Doe', age: undefined }

// but when I use this like this, It gives error
const person2: Person = { name: 'John Doe' }
// But I want to use this like this
// I dont have access to the Person type 

*/
