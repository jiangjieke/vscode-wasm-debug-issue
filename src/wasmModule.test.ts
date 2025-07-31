// src/wasmModule.test.ts
import { describe, it, expect } from 'vitest'
import { loadWasm } from './wasmLoader'

// This test will run the actual WASM module (requires built WASM)
describe('WASM Module', () => {
  let wasmModule: any;

  it('should load and test the WASM module', async () => {
    // Use our fixed wasmLoader instead of direct import
    wasmModule = await loadWasm()

    // Test getWelcomeMessage function
    expect(typeof wasmModule.getWelcomeMessage).toBe('function')

    // Test welcome message (updated to include array size)
    const message = wasmModule.getWelcomeMessage()
    expect(message).toContain('Welcome from WASM! Hello, World!')
    expect(message).toContain('Array size:')

    // // Test add function
    // expect(typeof wasmModule.add).toBe('function')

    // // Test addition
    // const result = wasmModule.add(2, 3)
    // expect(result).toBe(5)

    // // Test large array functions
    // expect(typeof wasmModule.initializeLargeArray).toBe('function')
    // expect(typeof wasmModule.getArrayValue).toBe('function')
    // expect(typeof wasmModule.setArrayValue).toBe('function')
    // expect(typeof wasmModule.getArraySize).toBe('function')

    // // Test array size
    // const arraySize = wasmModule.getArraySize()
    // expect(arraySize).toBe(419430400) // 400MB

    // // Test array operations
    // wasmModule.initializeLargeArray()

    // // Test setting and getting values
    // wasmModule.setArrayValue(100, 42)
    // const value = wasmModule.getArrayValue(100)
    // expect(value).toBe(42)

    // // Test boundary conditions
    // const invalidValue = wasmModule.getArrayValue(-1)
    // expect(invalidValue).toBe(-1)

    // const largeIndexValue = wasmModule.getArrayValue(arraySize)
    // expect(largeIndexValue).toBe(-1)
  }, 300000) // Increase timeout for WASM loading
})