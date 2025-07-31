import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 15000, // Increase timeout for WASM loading
  },
  server: {
    fs: {
      allow: ['..'] // Allow serving files from parent directories
    }
  },
  resolve: {
    alias: {
      '/wasm/dist': resolve(__dirname, './wasm/dist')
    }
  }
})