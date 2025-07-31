#include <string>
#include <vector>
#include <emscripten/bind.h>

using namespace emscripten;

// 创建一个大约 400MB 的静态数组
// 400MB = 400 * 1024 * 1024 bytes = 419,430,400 bytes
// 使用 char 数组，每个 char 1 byte
// static const int LARGE_ARRAY_SIZE = 419430400; // 400MB
static const int LARGE_ARRAY_SIZE = 219430400; // 400MB

// 使用全局数组并强制初始化以确保包含在 WASM 中
__attribute__((used)) static char large_data_buffer[LARGE_ARRAY_SIZE] = {1}; // 初始化第一个元素为1，其余为0

// 初始化大数组的函数
void initializeLargeArray() {
    // 填充一些数据模式以防止压缩
    for (int i = 0; i < LARGE_ARRAY_SIZE; i += 4096) {
        large_data_buffer[i] = (char)(i % 256);
    }
}

std::string getWelcomeMessage() {
    int a = 3;
    int b = a + 4; // Example operation
    return "Welcome from WASM! Hello, World! Array size: " + std::to_string(LARGE_ARRAY_SIZE);
}

int add(int a, int b) {
    return a + b;
}

// 获取数组中某个位置的值
int getArrayValue(int index) {
    if (index >= 0 && index < LARGE_ARRAY_SIZE) {
        return (int)large_data_buffer[index];
    }
    return -1;
}

// 设置数组中某个位置的值
void setArrayValue(int index, int value) {
    if (index >= 0 && index < LARGE_ARRAY_SIZE) {
        large_data_buffer[index] = (char)value;
    }
}

// 获取数组大小
int getArraySize() {
    return LARGE_ARRAY_SIZE;
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("getWelcomeMessage", &getWelcomeMessage);
    function("add", &add);
    function("initializeLargeArray", &initializeLargeArray);
    function("getArrayValue", &getArrayValue);
    function("setArrayValue", &setArrayValue);
    function("getArraySize", &getArraySize);
}