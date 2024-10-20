import r from '../index'

const commonUserFields = {
  name: r.string(),
  password: r.string(),
  accountType: r.string('admin', 'user'),
  bloodGroup: r.string('A+', 'B+', 'O+', 'AB+'),
} as const

const userType = r.or(
  r.object({
    ...commonUserFields,
    nidNumber: r.number(),
  }),
  r.object({
    ...commonUserFields,
    nidNumber: r.number(),
  }),
  r.object({
    ...commonUserFields,
    birthCertificateNumber: r.number(),
  })
)

try {
  const user = userType.parse({
    name: 'John',
    password: '123',
    accountType: 'admin',
    bloodGroup: 'A+',
    // nidNumber: 123456789,
    // birthCertificateNumber: 987654321,
  })
  console.log(user)
} catch (err: any) {
  console.log(err.message)
}
const main = r
  .object({
    name: r.string().input('super').optional().default('John'),
  })
  .partial()

type input = r.inferInput<typeof main>
type out = r.inferOutput<typeof main>

console.log(main.parseTyped({}))
