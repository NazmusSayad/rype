## Rype: Ultra-Fast Type-Optimized Data Validation

**Rype** is not just another validation package; it's a lightning-fast, type-optimized solution designed specifically for TypeScript projects. Unlike other libraries, Rype has been fine-tuned to fully harness the power of TypeScript, providing unparalleled performance and type safety.

### Requirements

- **TypeScript v5+**: Rype is optimized for TypeScript version 5 and above, ensuring compatibility with the latest TypeScript features and improvements.
- **"strictNullChecks": true**: To ensure robust type checking, please set `"strictNullChecks": true` inside your `tsconfig.json` configuration.

### Key Features

- **Blazing Speed**: Rype is optimized for speed, delivering rapid validation results.
- **Minimalistic**: With a compact footprint, it's easy to integrate into your project.
- **Robust Validation**: Comprehensive validation rules for precise data validation.
- **TypeScript Integration**: Rype's type system integration ensures type safety throughout your codebase.
- **Flexibility**: Adaptable to simple data structures or complex objects.
- **Intuitive API**: Developer-friendly API for defining validation schemas.
- **Type Safety**: Rype prioritizes type safety by minimizing the use of "any" types in the codebase, resulting in a more robust and bug-free experience.

### Why Rype?

In today's fast-paced development landscape, every millisecond counts, and type safety is paramount. Rype offers rapid validation with a small footprint, making it ideal for high-performance TypeScript applications, microservices, and projects where efficiency and type correctness are crucial. Elevate your project's performance while keeping your codebase lean and mean with Rype. Try it today and experience the future of type-optimized validation in TypeScript!

### Installation

- with npm

```shell
npm i rype
```

- with yarn

```shell
yarn add rype
```

- with pnpm

```shell
pnpm add rype
```

### Example

```js
import { r } from 'rype'

const schema = r.string()

const result = r(schema, 'My String') // Fine
const result = r(schema, 100_100_100) // Error & You will get also error in type level(ts)
```

### Available Schema Types

```js
r.string()
r.number()
r.boolean()
r.tuple()
r.array()
r.object()
r.or()

r.optional.string()
r.optional.number()
r.optional.boolean()
r.optional.tuple()
r.optional.array()
r.optional.object()
r.optional.or()

// Shorthand for optional
r.o.string()
r.o.number()
r.o.boolean()
r.o.tuple()
r.o.array()
r.o.object()
r.o.or()

r.opt.string()
r.opt.number()
r.opt.boolean()
r.opt.tuple()
r.opt.array()
r.opt.object()
r.opt.or()
```

### Let's try some advanced types

```js
const schema = r.string('String')

const result = r(schema, 'My String')
// Error (TypeScript also provides type-level error)
// 'My String' is not assignable to 'String'
```

```js
const schema = r.string('String', 'Your String')

const result = r(schema, 'My String')
// 'My String' is not assignable to 'String' | 'Your String'
```

Note:
**_You can apply similar checks to `r.number()` and `r.boolean()` as well_**

### Disabling Type-Level Checks while using Runtime Checks

In some scenarios, you may want to disable type-level checks while keeping the runtime checks enabled in the Schema Core library. We've added a feature that allows you to achieve this.

```js
const schema = r.string('String', 'Your String')

const result1 = r(schema)('My String') // Runtime and type level check
const result2 = r.onlyError(schema, 'My String') // Only runtime error
const result3 = r.onlyError(schema)('My String') // Only runtime error
```

#### Additional Options

```js
r.noCheck
// No type level check, no error thrown. Useful for filtering user input based on the schema.

r.checkAll
// Both runtime and type level check (default behavior).

r.onlyType
// Only type level check, no runtime error.

r.onlyError
// Only runtime error, no type level check.
```

<br/>
<br/>

### Experiment 1: Object

```js
const schema = r.object({
  name: r.string(),
  age: r.number(),
})

r(schema, {
  name: 'John Doe',
  age: 10,
})
```

### Experiment 2: Object with Array

```js
const schema = r.object({
  name: r.string(),
  age: r.number(),
  hobbies: r.array(r.string()),
})

r(schema, {
  name: 'John Doe',
  age: 10,
  hobbies: ['Cricket', 'Football'],
})
```

### Experiment 3: Object with Array and Tuple

```js
const schema = r.object({
  name: r.string(),
  age: r.number(),
  hobbies: r.array(r.string()),
  unknown: r.tuple(r.string(), r.number()),
})

r(schema, {
  name: 'John Doe',
  age: 10,
  hobbies: ['Cricket', 'Football'],
  unknown: ['string', 100],
})
```

### Experiment 4: Object with Array, Tuple, and Or

```js
const schema = r.object({
  name: r.string(),
  age: r.number(),
  hobbies: r.array(r.string()),
  unknown: r.tuple(r.string(), r.number()),
  country: r.or(
    r.string('Bangladesh'),
    r.object({ name: r.string(), coords: r.number() })
  ),
})

r(schema, {
  name: 'John Doe',
  age: 10,
  hobbies: ['Cricket', 'Football'],
  unknown: ['string', 100],
  country: { name: 'Arab', coords: 100 },
})
```

### Super Advanced Example ⚠️

```js
r(r.number(1), 1)
r(r.boolean(), true)
r(r.boolean(), false)
r(r.string('Boom', 'Fire'), 'Boom')

r(r.or(r.boolean()))

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
```

# 🚧 More will be added soon

Stay tuned for updates as we enhance and improve the Schema Core library. We appreciate your support in making this tool more powerful and user-friendly.
