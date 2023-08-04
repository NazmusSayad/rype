import r from './index'

try {
  type a = {} | 'sdfsdf'


  r(r.string())(123, 'password')
} catch (err: any) {
  console.log(err.message)
}

r(r.number(), 1)
r(r.boolean(), true)
r(r.boolean(), false)
r(r.string(), '2435')

r(r.or(r.boolean(), r.string('wwe')))

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
  {
    name: r.string('John Doe'),
    hobbies: r.tuple(r.string('Play')),
    image: r.instance(Blob, ArrayBuffer),
    intro: { address: r.string('BD') },
    jobs: r.tuple({ name: r.number(200) }),
  },

  {
    name: 'John Doe',
    hobbies: ['Play'],
    image: new ArrayBuffer(0),
    intro: { address: 'BD' },
    jobs: [{ name: 200 }],
  }
)

r(
  r.tuple(
    r.string('BD'),

    r.array(
      r.tuple(
        r.array(
          r.tuple({
            hi: r.string("l.string('hello')"),
          })
        )
      )
    ),

    r.tuple({
      name: r.string('hello'),
      ages: r.tuple(r.number(10)),
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
