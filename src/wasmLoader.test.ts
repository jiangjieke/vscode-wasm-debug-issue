// src/wasmLoader.test.ts
import { describe, it, expect } from 'vitest'
import { loadWasm, getWelcomeMessage, add, isNodeEnvironment, resolveWasmPath } from './wasmLoader'

describe('Environment Detection and Path Resolution', () => {
  describe('isNodeEnvironment', () => {
    it('should return true in Node.js test environment', () => {
      const result = isNodeEnvironment()
      expect(result).toBe(true)
    })

    it('should detect Node.js environment based on process object', () => {
      // Verify that the detection logic works correctly
      expect(typeof process).toBe('object')
      expect(process.versions).toBeDefined()
      expect(process.versions.node).toBeDefined()
    })
  })

  describe('resolveWasmPath', () => {
    it('should return absolute path in Node.js environment', () => {
      const path = require('path')
      const wasmPath = resolveWasmPath()
      expect(path.isAbsolute(wasmPath)).toBe(true)
      expect(wasmPath).toMatch(/main\.wasm$/)
    })

    it('should resolve to correct WASM file location', () => {
      const wasmPath = resolveWasmPath()
      expect(wasmPath).toContain('wasm/dist/main.wasm')
    })
  })
})

describe('wasmLoader', () => {
  it('should load the WASM module', async () => {
    const module = await loadWasm()
    expect(module).toBeDefined()
  }, 10000) // Increase timeout for WASM loading

  it('should return the welcome message', async () => {
    const message = await getWelcomeMessage()
    expect(message).toBe('Welcome from WASM! Hello, World!')
  })

  it('should add two numbers', async () => {
    const result = await add(2, 3)
    expect(result).toBe(5)
  })
})