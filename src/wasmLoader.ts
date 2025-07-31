// wasmLoader.ts
let wasmModule: any = null;

/**
 * 检测当前是否在Node.js环境中运行
 * @returns {boolean} 如果在Node.js环境中返回true，否则返回false
 */
export function isNodeEnvironment(): boolean {
  return typeof process !== 'undefined' && 
         process.versions != null && 
         process.versions.node != null;
}

/**
 * 获取WASM文件的绝对路径
 * @returns {string} WASM文件的绝对路径
 */
export function resolveWasmPath(): string {
  if (isNodeEnvironment()) {
    // 在Node.js环境中，使用相对路径解析
    const path = require('path');
    return path.resolve(__dirname, '../wasm/dist/main.wasm');
  } else {
    // 在浏览器环境中，返回相对路径
    return '/wasm/dist/main.wasm';
  }
}

/**
 * 在Node.js环境中加载WASM文件
 * @param wasmPath WASM文件路径
 * @returns Promise<ArrayBuffer> WASM文件的二进制数据
 */
async function loadWasmInNode(wasmPath: string): Promise<ArrayBuffer> {
  const fs = require('fs');
  const buffer = fs.readFileSync(wasmPath);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/**
 * 创建适合当前环境的模块配置
 * @returns 模块配置对象
 */
async function createModuleConfig(): Promise<any> {
  if (isNodeEnvironment()) {
    const wasmPath = resolveWasmPath();
    const wasmBinary = await loadWasmInNode(wasmPath);
    return {
      wasmBinary,
      locateFile: (path: string) => {
        if (path.endsWith('.wasm')) {
          return wasmPath;
        }
        return path;
      }
    };
  } else {
    return {
      locateFile: (path: string) => {
        if (path.endsWith('.wasm')) {
          return '/wasm/dist/' + path;
        }
        return path;
      }
    };
  }
}

export async function loadWasm() {
  if (wasmModule) {
    return wasmModule;
  }

  try {
    // Dynamically import the WASM module
    const moduleFactory = (await import('../wasm/dist/main.js')).default;
    const moduleConfig = await createModuleConfig();
    wasmModule = await moduleFactory(moduleConfig);
    return wasmModule;
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    throw error;
  }
}

export async function getWelcomeMessage(): Promise<string> {
  const module = await loadWasm();
  return module.getWelcomeMessage();
}

export async function add(a: number, b: number): Promise<number> {
  const module = await loadWasm();
  return module.add(a, b);
}