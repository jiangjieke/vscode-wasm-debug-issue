# VSCode WASM Debug Issue

这个仓库用于演示和说明在 VSCode 中调试 WebAssembly 时遇到的问题。

## 问题描述

调试器无法正确断点到 WASM 代码

## 环境配置

- **前端**: TypeScript + React + Vite
- **WASM 编译**: Emscripten + CMake
- **调试器**: VSCode + Chrome DevTools
- **包管理**: pnpm

## 项目结构

```
├── src/                 # React 应用源码
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 应用入口
│   ├── wasmLoader.ts   # WASM 模块加载器
│   └── *.test.ts       # 测试文件
├── wasm/               # WebAssembly 源码
│   ├── src/            # C/C++ 源码
│   ├── CMakeLists.txt  # CMake 配置
│   └── build/          # 构建输出
├── scripts/            # 构建脚本
└── package.json        # 项目配置
```

## 复现步骤

### 1. 环境准备

```bash
# 安装依赖
pnpm install

# 确保已安装 Emscripten SDK
source /path/to/emsdk/emsdk_env.sh
```

安装 wasm-dwarf-debugging 插件, 对于 vscode 的 fork 例如 cursor 和 kiro, 需要克隆该[仓库](https://github.com/microsoft/vscode-dwarf-debugging-ext.git)手动构建插件并安装, 或者直接安装本仓库已经预先构建好的该插件 wasm-dwarf-debugging-1.0.1.vsix

### 2. 编译 debug 版 wasm 产物

```bash
pnpm build:wasm:debug
```

查看 wasm/dist/ 下产物大小

### 3. 开始 Debug
确保已安装 VSCode 的 vitest 插件

对 src/wasmModule.test.ts 下断点并开始 debug

## WASM 产物大小控制

直接修改 `wasm/src/main.cpp` 第 10 行的静态数组的大小

## 相关资源

- [Emscripten 调试文档](https://emscripten.org/docs/porting/Debugging.html)
- [VSCode WebAssembly 调试指南](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [Chrome DevTools WASM 调试](https://developer.chrome.com/blog/wasm-debugging-2020/)
