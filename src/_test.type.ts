import r from './index'

r(r.number(1), 1)
r(r.boolean(), true)
r(r.boolean(), false)
r(r.string('Boom', 'Fire'), 'Boom')

r(r.or(r.boolean()), false)

r(r.tuple(), [])
r(r.array(r.string('World')))(['World'])
r(r.string('string'), 'string')
r(r.string('string', 'String'), 'String')

r(r.number(1, 2, 3), 1)
r(r.number(1, 2, 3), 2)
r(r.number(1, 2, 3), 3)

r(r.boolean(true), true)
r(r.boolean(false), false)
r(r.boolean(true, false), true)
r(r.boolean(true, false), false)

r(
  r.object({
    name: r.string('John Doe'),
    age: r.o.number(),
    hobbies: r.tuple(r.string('Play')),
    intro: r.object({ address: r.string('BD') }),
    jobs: r.tuple(r.object({ name: r.number(200) })),
    asdf: r.tuple(r.string()),
  }),

  {
    age: 0,
    name: 'John Doe',
    hobbies: ['Play'],
    intro: { address: 'BD' },
    jobs: [{ name: 200 }],
    asdf: ['Boom'],
  }
)

r(
  r.tuple(
    r.string('BD'),

    r.array(
      r.tuple(
        r.array(
          r.tuple(
            r.object({
              hi: r.string('Boom'),
            })
          )
        )
      )
    ),

    r.tuple(
      r.object({
        name: r.string('hello'),
        ages: r.tuple(r.number(10)),
      })
    )
  ),

  [
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
  ]
)
