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

### Bundlephobia results:

![image](https://github.com/NazmusSayad/rype/assets/87106526/7e607aef-5e39-4ba9-8a69-dc959fd72589)

Note: This information may be outdated; please refer to the latest version of [Bundlephobia(rype)](https://bundlephobia.com/package/rype@latest) for the most current data.

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
const result1 = schema.parseTyped('My String') // Valid

// Attempt to validate a number (will result in a validation error)
const result2 = schema.parseTyped(100_100_100) // Error - In both runtime and TypeScript type level
```

### Example 1: Primitive

```ts
const schema = r.string('String')
const result = schema.parseTyped('My String')
// Error (TypeScript also provides type-level error)
// 'My String' is not assignable to 'String'
```

```ts
const schema = r.string('String', 'Your String')
const result = schema.parseTyped('My String')
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

schema.parseTyped({
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

schema.parseTyped({
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

schema.parseTyped({
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

schema.parseTyped({
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

const result = schema.parseTyped({
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

const result = schema.parseTyped({ name: 0 })
// Error: Name for user is invalid
```

#### Set custom error when input is null or undefined

```ts
const schema = r.object({
  name: r.string().setRequiredErrMsg('User must have a name'),
  age: r.number().default(18),
})

const result = schema.parseTyped({})
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

### Different Parsing Methods

Rype offers a range of parsing methods that allow you to tailor your data validation process to various scenarios. These methods provide flexibility in handling validation errors and extracting validated data.

#### `.parse`: Runtime Error on Type Mismatch or Missing Schema Type

```ts
const result1 = schema.parse('My String') // Generates a runtime error if types don't match
const result2 = schema.parseTyped('My String') // Generates both runtime and type errors
```

- The `.parse` method triggers a runtime error if there is a type mismatch between the validated value and the schema, or if a type is specified in the schema but the input doesn't match it.
- The `.parseTyped` method additionally provides TypeScript type checking, ensuring type correctness in your codebase.

#### `.filter`: Returns Matched Value or Undefined on Validation Failure

```ts
const result3 = schema.filter('My String') // Returns the validated value or undefined on failure
const result4 = schema.filterTyped('My String') // Generates only a type error
```

- The `.filter` method returns the value if it matches the schema, and returns `undefined` if validation fails for a specific field.
- The `.filterTyped` method performs type checking, providing a TypeScript type error if the validation fails.

#### `.safeParse`: Returns Array with Data and Error

```ts
const result3 = schema.safeParse('My String') // Returns [data, undefined] on success
const result4 = schema.safeParseTyped('My String') // Generates only a type error
```

- The `.safeParse` method returns an array where the first element is the validated data and the second element is `undefined` on successful validation.
- If validation fails, the second element becomes the error output, and the first element is `undefined`.
- The `.safeParseTyped` method provides TypeScript type checking for error handling.

#### `.safeParseList`: Returns Array with Data and Errors

```ts
const result3 = schema.safeParseList('My String') // Returns [data, undefined] on success
const result4 = schema.safeParseListTyped('My String') // Generates only a type error
```

- The `.safeParseList` method returns an array where the first element is the validated data and the second element is `undefined` on successful validation.
- If validation fails, the second element becomes the error output as an array of `RypeError`, and the first element is `undefined`.
- The `.safeParseListTyped` method provides TypeScript type checking for error handling.

These parsing methods empower you to choose the appropriate approach for your validation needs, enhancing the precision and control over your data validation process.

### Super Advanced Example

⚠️: Wear glasses before watching this

```ts
// Import the updated validation library
const { r } = require('./index')

// Example 1
r.number(1).parseTyped(1)

// Example 2
r.boolean().parseTyped(true)

// Example 3
r.boolean().parseTyped(false)

// Example 4
r.string('Boom', 'Fire').parseTyped('Boom')

// Example 5
r.or(r.boolean()).parseTyped(false)

// Example 6
r.tuple().parseTyped([])

// Example 7
r.array(r.string('World')).parseTyped(['World'])

// Example 8
r.string('string').parseTyped('string')

// Example 9
r.string('string', 'String').parseTyped('String')

// Example 10
r.number(1, 2, 3).parseTyped(1)
r.number(1, 2, 3).parseTyped(2)
r.number(1, 2, 3).parseTyped(3)

// Example 11
r.boolean(true).parseTyped(true)
r.boolean(false).parseTyped(false)
r.boolean(true, false).parseTyped(true)
r.boolean(true, false).parseTyped(false)

// Example 12
r.object({
  name: r.string('John Doe'),
  age: r.o.number(),
  hobbies: r.tuple(r.string('Play')),
  intro: r.object({ address: r.string('BD') }),
  jobs: r.tuple(r.object({ name: r.number(200) })),
  asdf: r.tuple(r.string()),
}).parseTyped({
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
    .parseTyped([
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

## Performance Comparison with Zod

![image](https://github.com/NazmusSayad/rype/assets/87106526/894cef17-77d6-4475-bbc7-8f0df90eb9d8)

![image](https://github.com/NazmusSayad/rype/assets/87106526/b42f5bc4-8f16-409d-a567-1beab6112e44)

![image](https://github.com/NazmusSayad/rype/assets/87106526/95e64117-1de7-49b3-9659-54ac77ecb6c3)

![image](https://github.com/NazmusSayad/rype/assets/87106526/a432916c-749d-45d0-a8d3-4ba8c785af59)

Note: Please note that this benchmark may not accurately represent real-world scenarios. Actual performance may vary, and in some cases, both packages have demonstrated similar speeds. It's worth highlighting that both packages are optimized for speed.

<br/>
<br/>

# 🚧 More will be added soon

Stay tuned for updates as we enhance and improve the Schema Core library. We appreciate your support in making this tool more powerful and user-friendly.
