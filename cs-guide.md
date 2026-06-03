# 💡 快速入门与基础路由

> 💡 **提示**：默认监听端口为 `8090`。在 Windows 环境下运行如果绑定失败，请注意赋予应用管理员权限。推荐使用 **PicoServer** 最新版本保障功能完整性。

## 1. 最简 WebAPI

只需三行代码，即可在任意 .NET 原生应用中启动一个轻量级 Web 服务。

```csharp
using System;
using System.Threading.Tasks;
using System.Net;
using PicoServer;

class Program
{
    private static readonly WebAPIServer MyAPI = new WebAPIServer(); // 实例化 PicoServer

    static void Main()
    {
        MyAPI.AddRoute("/", Hello); // 添加根路由映射
        MyAPI.StartServer();        // 启动服务，默认 8090
        
        Console.WriteLine("服务已启动: [http://127.0.0.1:8090](http://127.0.0.1:8090)");
        Console.ReadKey();
        
        MyAPI.StopServer(); // 停止服务
    }

    // 根路由映射的回调方法
    private static async Task Hello(HttpListenerRequest request, HttpListenerResponse response)
    {
        await response.WriteAsync("Hello PicoServer");
    }
}

```

### 🧱 核心控制 API

```csharp
MyAPI.StartServer();                  // 开启服务（默认端口 8090）
MyAPI.StartServer(8891);              // 开启服务并指定端口
MyAPI.StartServer("127.0.0.1");       // 限定仅本机可访问 【Pro版】
MyAPI.StartServer("127.0.0.1", 8891); // 限定本机访问并指定端口 【Pro版】
MyAPI.StopServer();                   // 停止服务

// 语义化路由注册（v1.7+ 支持，使复杂应用开发更爽快）
MyAPI.MapGet("/", Hello);    // 限定 GET
MyAPI.MapPost("/", Hello);   // 限定 POST
MyAPI.MapPut("/", Hello);    // 限定 PUT
MyAPI.MapDelete("/", Hello); // 限定 DELETE

```

---

## 2. 路由控制与请求参数解析

PicoServer 支持四种路由解析风格：**精准路由、星号通配路由、RESTful 风格路由、特性路由（Pro版支持 AOT）**。

```csharp
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    // 1. 精准路由（优先级最高）
    MyAPI.AddRoute("/api/user/query", QueryUser, "GET");
    MyAPI.AddRoute("/api/user/save", SaveUser, "POST");
    MyAPI.AddRoute("/api/user/json", SaveUserJson, "POST");

    // 2. 星号通配符路由（每段 URL 仅支持一个 *，支持多段通配，内置防目录遍历攻击）
    MyAPI.AddRoute("/api/*/posts", HandleWildcardPost, "POST");
    MyAPI.AddRoute("/api/*/user/*/detail", HandleMultiWildcard, "GET");

    MyAPI.StartServer();
}

// 📥 处理 GET 查询参数：/api/user/query?name=xyz&age=18
private static async Task QueryUser(HttpListenerRequest request, HttpListenerResponse response)
{
    string name = request.GetQuery("name");
    int age = request.GetQuery<int>("age");
    bool isVip = request.GetQuery<bool>("isVip");

    await response.WriteAsync($@"{{""code"": 1, ""msg"": ""参数解析成功"", ""data"": {{ ""name"": ""{name}"", ""age"": {age} }} }}");
}

// 📥 处理 POST Form 表单：Content-Type: application/x-www-form-urlencoded
private static async Task SaveUser(HttpListenerRequest request, HttpListenerResponse response)
{
    var formData = request.ParseForm();
    string userName = formData["userName"];
    
    await response.WriteAsync($"{{\"code\":1, \"msg\":\"表单保存成功\",\"userName\":\"{userName}\"}}");
}

// 📥 处理 POST JSON 请求：Content-Type: application/json
private static async Task SaveUserJson(HttpListenerRequest request, HttpListenerResponse response)
{
    string bodyJson = await request.ReadBodyAsStringAsync();
    await response.WriteAsync($"{{\"code\":1, \"msg\":\"JSON保存成功\",\"data\":{bodyJson}}}");
}

```

### ⚙️ 参数解析相关扩展方法

```csharp
request.GetQuery();              // 获取查询字符串，不存在返回 null
request.GetQuery<T>();           // 自动转型读取查询字符串，失败返回默认值
request.ParseForm();             // 强类型解析 Form 表单字典
request.ReadBodyAsStringAsync(); // 流式读取 Body 文本（常用于 JSON）
request.Items();                 // 请求上下文属性字典，用于中间件传值 【Pro版】

```

---

## 3. RESTful 风格与 MIME 类型决议

通过判断请求的 `HttpMethod`，可在单一路由内完成完整的 RESTful 资源分发。

```csharp
private static async Task Users(HttpListenerRequest request, HttpListenerResponse response)
{
    response.ContentType = GetContentType(".json"); // 自动获取标准 MIME 类型
    
    switch (request.HttpMethod)
    {
        case "GET":
            await response.WriteAsync(@"{""code"":1,""msg"":""获取用户成功""}");
            break;
        case "POST":
            response.StatusCode = 201;
            await response.WriteAsync(@"{""code"":1,""msg"":""创建用户成功""}");
            break;
        default:
            response.StatusCode = 405;
            await response.WriteAsync(@"{""code"":0,""msg"":""Method Not Allowed""}");
            break;
    }
}

```

::: tip MIME 类型内置决议
跨平台通用方法 `GetContentType(".ext")` 在 Windows/Linux/Docker 容器下的解析结果行为严格一致。默认针对文本资源追加 `charset=UTF-8`。支持多达 30+ 种常用扩展名（如视频流 `.m3u8`、`.ts`，字体 `.woff2` 等），未知类型默认回退为安全流 `application/octet-stream`。
:::

---

## 4. 特性路由 (Declarative Routing)

通过在控制器上打标签实现自动路由扫描。

::: warning AOT 兼容性提示
免费版特性路由通过扩展包 `PicoServer.Extensions` 基于运行时反射实现；**Pro 版特性路由采用 Source Generator 编译期提前生成，100% 完美适配 Native AOT。**
:::

```csharp
[ApiController]
public class UserController
{
    [ApiRoute("/api/user", "GET")]
    public async Task GetUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"id\":1,\"name\":\"张三\"}", WebAPIServer.ContentType.ApplicationJson);
    }
}

// 在 Main 函数中一键开启自动扫描注册
MyAPI.AutoRegisterRoutes();

```
