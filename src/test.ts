import r from './index'

const str = r('false', r.string())
console.log(str)

/* 
r(1, r.number())
r(true, r.boolean())
r(false, r.boolean())
r('2435', r.string())

r(r.any(r.boolean(), r.string('wwe')))('wwe')

r([], r.tuple())
r(r.array(r.string('World')))(['World'])

r('string', r.string('string'))
r('String', r.string('string', 'String'))

r(1, r.number(1, 2, 3))
r(2, r.number(1, 2, 3))
r(3, r.number(1, 2, 3))

r(true, r.boolean(true))
r(false, r.boolean(false))
r(true, r.boolean(true, false))
r(false, r.boolean(true, false))

r([1, 2, 3], r.tuple(1, 2, 3))
r(['1', '2', '3'], r.tuple('1', '2', '3'))

r([1, 2, 3, 3, 1, 2], r.array(1, 2, 3))
r(['1', '2', '3'], r.array('1', '2', '3'))

r(
  {
    name: 'John Doe',
    hobbies: ['Play'],
    image: new ArrayBuffer(0),
    images: new Blob(),
    intro: { address: 'BD' },
    jobs: [{ name: 200 }],
  },

  {
    name: r.string('John Doe'),
    hobbies: r.tuple('Play'),
    image: r.instance(Blob, ArrayBuffer),
    images: r.any(r.instance(Blob), r.instance(ArrayBuffer), r.string('http')),
    intro: { address: r.string('BD') },
    jobs: r.tuple({ name: r.number(200) }),
  }
)

r(
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
  ],

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
      ages: r.tuple(10),
    })
  )
)
 */
