## Rype: Ultra-Fast Type-Optimized Data Validation

**Rype** is not just another validation package; it's a lightning-fast, type-optimized solution designed specifically for TypeScript projects. Unlike other libraries, Rype has been fine-tuned to fully harness the power of TypeScript, providing unparalleled performance and type safety.

### Requirements

- **TypeScript v5+**: Rype is optimized for TypeScript version 5 and above, ensuring compatibility with the latest TypeScript features and improvements.
- **"strictNullChecks": true**: To ensure robust type checking, please set `"strictNullChecks": true` inside your `tsconfig.json` configuration.

## Key Features

- **Blazing Speed**: Rype is optimized for speed, delivering rapid validation results.
- **Minimalistic**: With a compact footprint, it's easy to integrate into your project.
- **Robust Validation**: Comprehensive validation rules for precise data validation.
- **TypeScript Integration**: Rype's type system integration ensures type safety throughout your codebase.
- **Flexibility**: Adaptable to simple data structures or complex objects.
- **Intuitive API**: Developer-friendly API for defining validation schemas.
- **Type Safety**: Rype prioritizes type safety by minimizing the use of "any" types in the codebase, resulting in a more robust and bug-free experience.
- **Bundlephobia results**:

![image](https://github.com/NazmusSayad/rype/assets/87106526/f38f4462-0d7a-4759-b8a4-58a654d4d14d)

## Why Rype?

In today's fast-paced development landscape, every millisecond counts, and type safety is paramount. Rype offers rapid validation with a small footprint, making it ideal for high-performance TypeScript applications, microservices, and projects where efficiency and type correctness are crucial. Elevate your project's performance while keeping your codebase lean and mean with Rype. Try it today and experience the future of type-optimized validation in TypeScript!

## Installation

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

## Example

Here's a simple example demonstrating how to use Rype for data validation in TypeScript.

```ts
import { r } from 'rype'

// Define a schema for a string
const schema = r.string()

// Validate a string
const result1 = schema.typedParse('My String') // Valid

// Attempt to validate a number (will result in a validation error)
const result2 = schema.typedParse(100_100_100) // Error - In both runtime and TypeScript type level
```

### Example 1: Primitive

```ts
const schema = r.string('String')
const result = schema.typedParse('My String')
// Error (TypeScript also provides type-level error)
// 'My String' is not assignable to 'String'
```

```ts
const schema = r.string('String', 'Your String')
const result = schema.typedParse('My String')
// 'My String' is not assignable to 'String' | 'Your String'
```

Note:
**_You can apply similar checks to `r.number()` and `r.boolean()` as well_**

### Example 2: Object

```ts
const schema = r.object({
  name: r.string(),
  age: r.number(),
})

schema.typedParse({
  name: 'John Doe',
  age: 10,
})
```

### Example 3: Object with Array

```ts
const schema = r.object({
  name: r.string(),
  age: r.number(),
  hobbies: r.array(r.string()),
  someValues: r.array(r.string(), r.number()),
})

schema.typedParse({
  name: 'John Doe',
  age: 10,
  hobbies: ['Cricket', 'Football'],
  someValues: ['Cricket', 100],
})
```

### Example 4: Object with Tuple

```ts
const schema = r.object({
  name: r.string(),
  age: r.number(),
  unknown: r.tuple(r.string(), r.number()),
})

schema.typedParse({
  name: 'John Doe',
  age: 10,
  unknown: ['string', 100],
})
```

### Example 5: Object with Or

```ts
const schema = r.object({
  name: r.string(),
  age: r.number(),
  country: r.or(
    r.string('Bangladesh'),
    r.object({ name: r.string(), coords: r.number() })
  ),
})

schema.typedParse({
  name: 'John Doe',
  age: 10,
  country: { name: 'Arab', coords: 100 },
})
```

### Example 6: Setting Default Values

You can use the `default` method to set default values for fields in your Rype schema.

```ts
const schema = r.object({
  name: r.string(),
  age: r.number().default(18),
})

const result = schema.typedParse({
  name: 'John Doe',
})

/* Result:
{
  name: 'John Doe',
  age: 18 // Default value applied
}
*/
```

Note: **_You can use default with everything :)_**

### Example 7: Customizing Error Messages

You can easily set custom error messages for specific cases during runtime checking using Rype.

#### Set custom error when invalid type error occurs

```ts
const schema = r.object({
  name: r.string().setTypeErrMsg('Name for user is invalid'),
  age: r.number().default(18),
})

const result = schema.typedParse({})
// Error: Name for user is invalid
```

#### Set custom error when input is null or undefined

```ts
const schema = r.object({
  name: r.string().setRequiredErrMsg('User must have a name'),
  age: r.number().default(18),
})

const result = schema.typedParse({})
// Error: User must have a name
```

### Available Schema Types

```ts
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
r.o //...
r.opt //...

// Example (All of them are same):
r.o.string()
r.opt.string()
r.optional.string()
```

### Disabling Type-Level Checks while using Runtime Checks

In some scenarios, you may want to disable type-level checks while keeping the runtime checks enabled in the Schema Core library. We've added a feature that allows you to achieve this.

```ts
const result1 = schema.parse('My String') // Only runtime error
const result2 = schema.typedParse('My String') // Both Error
const result3 = schema.safeParse('My String') // No Error
const result4 = schema.typedSafeParse('My String') // Only type error
```

### Super Advanced Example ⚠️

```ts
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
```

<br/>

## Comparing with 'Zod'

![image](https://github.com/NazmusSayad/rype/assets/87106526/aa53bc63-0fd7-4f4f-937e-b38ad251ada8)
![image](https://github.com/NazmusSayad/rype/assets/87106526/2d031f4d-9ec8-4f72-b1a8-ba79e6d73147)

<br/>
<br/>

# 🚧 More will be added soon

Stay tuned for updates as we enhance and improve the Schema Core library. We appreciate your support in making this tool more powerful and user-friendly.
