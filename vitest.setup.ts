// vitest.setup.ts
import { vi } from 'vitest'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Mock fetch for WASM file loading
global.fetch = vi.fn().mockImplementation((url) => {
  if (url.endsWith('.wasm')) {
    const wasmPath = resolve(__dirname, './wasm/dist/main.wasm')
    const wasmBuffer = readFileSync(wasmPath)
    return Promise.resolve({
      arrayBuffer: () => Promise.resolve(wasmBuffer)
    })
  }
  return Promise.reject(new Error(`Unexpected fetch request: ${url}`))
})