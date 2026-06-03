# 💡 项目深度解析与核心架构

PicoServer 核心采用 **C# Source Generators（源生成器）**：
* **零反射**：路由、中间件以及请求上下文的映射关系，全部在**编译期**完成代码分析与静态生成。
* **零运行时开销**：当你的程序跑起来时，路由查找就像执行一个普通的 `switch-case` 一样快，最大化释放 CPU 性能。
* **跨版本兼容**：不仅针对最新的 .NET 现代版本进行支持，核心架构同时向下兼容 `.NET Standard 2.0`，确保工业级老项目也能享受 AOT 的性能红利。

## 📥 官方发布元数据
* **作者 (Author)**: `juziyu`
* **NuGet 发布标识**: `PicoServer` / `PicoServer.Nano`
* **官方唯一域名**: [picoserver.cn](http://picoserver.cn)
