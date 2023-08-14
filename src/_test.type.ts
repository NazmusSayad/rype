// Import the updated validation library
const { r } = require('./index')

// Example 1
r.number(1).typedParse(1)

// Example 2
r.boolean().typedParse(true)

// Example 3
r.boolean().typedParse(false)

// Example 4
r.string('Boom', 'Fire').typedParse('Boom')

// Example 5
r.or(r.boolean()).typedParse(false)

// Example 6
r.tuple().typedParse([])

// Example 7
r.array(r.string('World')).typedParse(['World'])

// Example 8
r.string('string').typedParse('string')

// Example 9
r.string('string', 'String').typedParse('String')

// Example 10
r.number(1, 2, 3).typedParse(1)
r.number(1, 2, 3).typedParse(2)
r.number(1, 2, 3).typedParse(3)

// Example 11
r.boolean(true).typedParse(true)
r.boolean(false).typedParse(false)
r.boolean(true, false).typedParse(true)
r.boolean(true, false).typedParse(false)

// Example 12
r.object({
  name: r.string('John Doe'),
  age: r.o.number(),
  hobbies: r.tuple(r.string('Play')),
  intro: r.object({ address: r.string('BD') }),
  jobs: r.tuple(r.object({ name: r.number(200) })),
  asdf: r.tuple(r.string()),
}).typedParse({
  age: 0,
  name: 'John Doe',
  hobbies: ['Play'],
  intro: { address: 'BD' },
  jobs: [{ name: 200 }],
  asdf: ['Boom'],
})

// Example 13
r.tuple(
  r.string('BD'),
  r
    .array(
      r.tuple(r.array(r.tuple(r.object({ hi: r.string('Boom') })))),
      r.tuple(
        r.object({ name: r.string('hello'), ages: r.tuple(r.number(10)) })
      )
    )
    .typedParse([
      'BD',
      [
        [
          [
            [
              {
                hi: 'Boom',
              },
            ],
          ],
        ],
      ],
      [
        {
          name: 'hello',
          ages: [10],
        },
      ],
    ])
)
