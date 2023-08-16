import r, { InferOutput } from './index'

const schema = r.tuple(
  r.object({
    name: r.string(),
  })
)

/* 
{
  person: {
    name: "Lol",
    age: 18
  }
}
*/

// console.log(schema.parse([]))

type Output = InferOutput<typeof schema>
type Input = Parameters<typeof schema.parseTyped>[0]
