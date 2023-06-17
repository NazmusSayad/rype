import rype from './index'

declare global {
  var r: typeof rype
}

try {
  globalThis.r = rype
} catch {
  try {
    // @ts-ignore
    global.r = rype
  } catch {}

  try {
    window.r = rype
  } catch {}
}
