import r from './index'

const result1 = r.number().min(5).parse(10)

// const result2 = r.number().min(5).parse(2) // Should throw an error


console.log(result1)