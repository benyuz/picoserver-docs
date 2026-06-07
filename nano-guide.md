---
prev:
  text: 基准测试
  link: /benchmark
next:
  text: PicoServer.Nano 性能测试
  link: /nano-benchmark
---

<p align="center">
  <img src="/nano-logo.png" alt="PicoServer.Nano" width="200">
</p>

# 🔌 PicoServer.Nano (面向 .NET nanoFramework)

**PicoServer.Nano**（NuGet 包：`PicoServer.Nano`）是 PicoServer 在 **.NET nanoFramework** 生态系统上的轻量化移植版本。它是一个零依赖的"Web 胶水库"，专为资源受限的微控制器设计，特别针对 **ESP32** 进行了适配和优化。

> **什么是 .NET nanoFramework？**
>
> 微软 .NET 基金会下的一个项目，将完整的 .NET 运行时精简到几百 KB，让 C# 代码能跑在 ESP32、STM32 这类微控制器上。你可以用 Visual Studio 开发项目，一键部署到板子上运行。

### 与官方 WebServer 库的区别

PicoServer.Nano **不使用反射**，内存和 CPU 占用更低，把有限的资源留给业务。

---

## 快速开始

### 1. 环境准备

安装 nanoFramework 开发环境：

1. 安装 [nanoFramework Visual Studio 扩展](https://marketplace.visualstudio.com/items?itemName=nanoframework.nanoFrameworkVS)
2. 烧录 nanoFramework 固件到 ESP32：

```bash
nanoff --target ESP32_S3_ALL --serialport COM5 --update --masserase
```

### 2. 添加 NuGet 包

```bash
dotnet add package PicoServer.Nano
```

### 3. 写代码

```csharp
using PicoServer.Nano;
using System.Net;

var server = new WebAPIServer();
server.AddRoute("/hello", (req, res) => res.Write("Hello from MCU!"), "GET");
server.StartServer();
Console.WriteLine($"服务器已启动: http://{server.GetIPAddress()}/");
```

编译部署，浏览器访问 `http://<设备IP>/hello` 即可看到响应。

---

## 核心能力一览

| 能力 | 支持 |
|------|------|
| 路由映射 | ✅ 精准路由 |
| 自定义中间件 | ✅ |
| Token 认证 | ✅ |
| 静态文件托管 | ✅ |
| SSE 长连接 | ✅ |
| 文件上传/下载 | ✅ |

### 路由注册

```csharp
server.AddRoute("/api/user", UserHandler, "GET");

private static void UserHandler(HttpListenerRequest req, HttpListenerResponse res)
{
    string token = req.GetToken();
    res.Write("{\"id\":1}");
}
```

### 中间件

```csharp
server.AddMiddleware((req, res) =>
{
    if (req.Headers["X-Key"] != "secret")
    {
        res.Write("Unauthorized", 401);
        return false;
    }
    return true;
});
```

### 静态文件托管

一行代码托管整个文件夹：

```csharp
server.AddStaticFiles("/web", "I:\\www", maxAge: 3600);
```

访问 `http://设备IP/web/index.html` 即可看到网页。

### 响应扩展

| 方法 | 说明 |
|------|------|
| `res.Write(content, contentType)` | 写入响应并关闭 |
| `res.SendFile(filePath)` | 发送文件（流式） |
| `res.WriteChunk(content)` | 分块推送（SSE/长连接） |

### 请求扩展

| 方法 | 说明 |
|------|------|
| `req.GetToken()` | 获取 Authorization 头中的 Token |
| `req.ReadBodyAsString()` | 读取请求体为字符串 |
| `req.SaveFile(savePath)` | 保存上传文件 |

---

## 一致的 C# 开发体验

**PicoServer** 在 Windows/Linux/macOS 上：

```csharp
server.AddRoute("/hello", async (req, res) => await res.WriteAsync("Hello"));
```

**PicoServer.Nano** 在 ESP32/STM32 上：

```csharp
server.AddRoute("/hello", (req, res) => res.Write("Hello"));
```

几乎是一套 API，让桌面端、云端、嵌入式微控制器拥有一致的 Web 开发体验。

---

## 注意事项

1. **路径格式**：nanoFramework 中使用反斜杠 `\`，如 `"I:\\www"`
2. **静态文件托管**：文件需部署到设备（生成操作设为"内容"），中间件按顺序执行，建议第一个添加
3. **白名单**：路由加入白名单可跳过认证
4. **长连接**：`WriteChunk` 推送结束后必须调用 `res.Close()`

---

## 资源链接

- NuGet：`PicoServer.Nano` [https://www.nuget.org/packages/PicoServer.Nano](https://www.nuget.org/packages/PicoServer.Nano)
- 官网：https://picoserver.cn
- nanoFramework 官网：https://www.nanoframework.net
