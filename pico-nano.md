# 🔌 PicoServer.Nano (面向 .NET nanoFramework)

**PicoServer.Nano**（当前稳定版 **v0.8.0**）针对 **ESP32** 等核心微处理器设备进行了全手动的硬件级调优：
* **ESP32 PSRAM 深度适配**：将网络缓冲区与核心上下文常驻于 PSRAM（伪静态随机存储器），保障硬件稳定运行并释放片上 SRAM。
* **生产者-消费者（Producer-Consumer）架构**：在硬件底层引入高性能异步队列，即使面对并发的网络传感器数据上报，芯片也能有条不紊地排队处理，绝不掉线。
