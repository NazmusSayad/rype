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

<br/>
<br/>

# 🚧 This is currently under active development.

Stay tuned for updates as we enhance and improve the Schema Core library. We appreciate your support in making this tool more powerful and user-friendly.
