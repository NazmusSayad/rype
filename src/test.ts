import t from './index'

t(t.number(10))(10)

t(1, t.number())
t(true, t.boolean())
t(false, t.boolean())
t('2435', t.string())

t(t.any(t.boolean(), t.string('wwe')))('wwe')

t([], t.tuple())
t(t.array(t.string('World')))(['World'])

t('string', t.string('string'))
t('String', t.string('string', 'String'))

t(1, t.number(1, 2, 3))
t(2, t.number(1, 2, 3))
t(3, t.number(1, 2, 3))

t(true, t.boolean(true))
t(false, t.boolean(false))
t(true, t.boolean(true, false))
t(false, t.boolean(true, false))

t([1, 2, 3], t.tuple(1, 2, 3))
t(['1', '2', '3'], t.tuple('1', '2', '3'))

t([1, 2, 3, 3, 1, 2], t.array(1, 2, 3))
t(['1', '2', '3'], t.array('1', '2', '3'))

t(
  {
    name: 'John Doe',
    hobbies: ['Play'],
    image: new ArrayBuffer(0),
    images: new Blob(),
    intro: { address: 'BD' },
    jobs: [{ name: 200 }],
  },

  {
    name: t.string('John Doe'),
    hobbies: t.tuple('Play'),
    image: t.instance(Blob, ArrayBuffer),
    images: t.any(t.instance(Blob), t.instance(ArrayBuffer), t.string('http')),
    intro: { address: t.string('BD') },
    jobs: t.tuple({ name: t.number(200) }),
  }
)

t(
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

  t.tuple(
    t.string('BD'),

    t.array(
      t.tuple(
        t.array(
          t.tuple({
            hi: t.string("l.string('hello')"),
          })
        )
      )
    ),

    t.tuple({
      name: t.string('hello'),
      ages: t.tuple(10),
    })
  )
)
