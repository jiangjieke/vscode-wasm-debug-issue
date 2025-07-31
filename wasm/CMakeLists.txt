# wasm/CMakeLists.txt
cmake_minimum_required(VERSION 3.13)
project(wasm_module)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Create the dist directory
file(MAKE_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/dist)

# Custom target to build WASM using emcc directly
add_custom_target(main
    COMMAND emcc 
        -g -O0 -std=c++17
        -lembind
        -s EXPORT_NAME='createModule'
        -s MODULARIZE=1
        -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]'
        -s ASSERTIONS=1
        -fno-exceptions
        -sLLD_REPORT_UNDEFINED
        -sINITIAL_MEMORY=512MB
        -sMAXIMUM_MEMORY=1GB
        -sALLOW_MEMORY_GROWTH=1
        -sFORCE_FILESYSTEM=0
        -sNO_EXIT_RUNTIME=1
        -sEXPORT_ES6=1
        -sWASM=1
        -sENVIRONMENT='web,node'
        -sNODERAWFS=1
        -sSTACK_SIZE=8MB
        -sGLOBAL_BASE=1024
        -o ${CMAKE_CURRENT_SOURCE_DIR}/dist/main.js
        ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    COMMENT "Building large WASM module (~400MB) with emcc"
)

# Debug target
add_custom_target(debug
    COMMAND emcc 
        -g -O0 -DDEBUG -s SAFE_HEAP=1 -std=c++23
        -lembind
        -s EXPORT_NAME='createModule'
        -s MODULARIZE=1
        -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]'
        --no-entry
        -fno-exceptions
        -sLLD_REPORT_UNDEFINED
        -sINITIAL_MEMORY=512MB
        -sALLOW_MEMORY_GROWTH=1
        -sFORCE_FILESYSTEM=0
        -sNO_EXIT_RUNTIME=1
        -sEXPORT_ES6=1
        -sWASM=1
        -sMODULARIZE=1
        -sMAX_WEBGL_VERSION=2
        -sUSE_WEBGPU=1
        -sASSERTIONS=1
        -sGL_ASSERTIONS=1
        -sFETCH=1
        -sMAXIMUM_MEMORY=4GB
        -sENVIRONMENT=web,node
        -sGL_WORKAROUND_SAFARI_GETCONTEXT_BUG=0
        -sSTACK_SIZE=1MB
        -Wno-error=js-compiler
        -sEXPORTED_FUNCTIONS=[${_exported_methods}]
        -sEXPORTED_RUNTIME_METHODS=[${_exported_runtime_methods}]
        -sWASM_BIGINT
        -gdwarf-4
        -o ${CMAKE_CURRENT_SOURCE_DIR}/dist/main.js
        ${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    COMMENT "Building WASM module in debug mode"
)

# Clean target
add_custom_target(clean-dist
    COMMAND ${CMAKE_COMMAND} -E remove_directory ${CMAKE_CURRENT_SOURCE_DIR}/dist
    COMMENT "Cleaning dist directory"
)

# Rebuild target
add_custom_target(rebuild
    COMMAND ${CMAKE_COMMAND} --build ${CMAKE_BINARY_DIR} --target clean-dist
    COMMAND ${CMAKE_COMMAND} --build ${CMAKE_BINARY_DIR} --target main
    COMMENT "Rebuilding everything"
)