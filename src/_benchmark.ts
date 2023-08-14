import r from './rype'

function check(label: string, fn: Function) {
  const start = Date.now()
  for (let i = 0; i < 1000_000; i++) fn()
  const end = Date.now()
  const diff = end - start
  console.log(label + ':', diff + 'ms')
  return diff
}

const input = {
  name: 'John Doe',
}

function test() {
  check('Rype', () => {
    // r.string().parse(input.name)
    r.object({ name: r.string() }).parse(input)
  })
  console.log()
}

test()
test()
test()
