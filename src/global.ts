import rype from './index'

try {
  globalThis.r = rype
} catch {
  try {
    window.r = rype
  } catch {}
  try {
    global.r = rype
  } catch {}
}

declare global {
  var r: typeof rype
}
