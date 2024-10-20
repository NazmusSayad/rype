import r from '../index'

const schema = r.string().minLength(3).maxLength(6)
const input = 'it'

// runTask(() => schema.parse(input))
// runTask(() => schema.filter(input))
// runTask(() => schema.safeParse(input))
// runTask(() => schema.safeParseList(input))

function runTask(fn: () => void) {
  try {
    console.log('OK:', fn())
  } catch (err: any) {
    console.error('ERROR:', err.message)
  }
}
