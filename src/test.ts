import l from './index'

l(l.string('string'), 'string')
l(l.string('string', 'String'), 'String')

l(l.number(1, 2, 3), 1)
l(l.number(1, 2, 3), 2)
l(l.number(1, 2, 3), 3)

l(l.boolean(true), true)
l(l.boolean(false), false)
l(l.boolean(true, false), true)
l(l.boolean(true, false), false)

l(l.tuple(1, 2, 3), [1, 2, 3])
l(l.tuple('1', '2', '3'), ['1', '2', '3'])

l(l.array(1, 2, 3), [1, 2, 3, 3, 1, 2])
l(l.array('1', '2', '3'), ['1', '2', '3'])

l(
  {
    name: l.string('John Doe'),
    hobbies: l.tuple('Play'),
    intro: {
      address: l.string('BD'),
    },

    jobs: l.tuple({ name: l.number(200) }),
  },
  {
    name: 'John Doe',
    hobbies: ['Play'],

    jobs: [{ name: 200 }],
  }
)

l(
  l.tuple(
    l.string('BD'),

    l.array(
      l.tuple(
        l.array(
          l.tuple({
            hi: l.string("l.string('hello')"),
          })
        )
      )
    ),

    l.tuple({
      name: l.string('hello'),
      ages: l.tuple(10),
    })
  ),
  [
    'BD',

    [
      [
        [
          [
            {
              hi: "l.string('hello')",
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
