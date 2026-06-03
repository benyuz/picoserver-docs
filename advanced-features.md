# ⚡ 进阶特性与中间件生态

## 1. 静态文件托管与 CORS 跨域

提供高性能的静态资源（HTML、CSS、JS、图片及音视频）托管，完美适配现代 B/S 架构独立站点或全分离前端。

```csharp
static void Main()
{
    // 添加静态文件服务（参数 1 为网络路由，参数 2 为本地文件夹。默认开启 ETag 智能缓存协商机制）
    MyAPI.AddStaticFiles("/", "wwwroot");
    
    // 自定义缓存周期：托管 "www" 文件夹至 "/web" 路由，浏览器缓存 30 天
    // MyAPI.AddStaticFiles("/web", "www", 2592000); 

    // 开启全域 CORS 跨域支持（支持前后端分离）
    MyAPI.AddCors(); 
    // MyAPI.AddCors("picoserver.cn"); // 亦可指定特定安全域名跨域
    
    MyAPI.StartServer();
}

```

---

## 2. 工业级 Cookie 管理

内置防空指针引用的安全读写机制。

```csharp
// 写入安全 Cookie（HttpOnly 抵御 XSS 攻击）
response.AppendCookie("token", "pico_123", new CookieOptions 
{
    Expires = DateTimeOffset.Now.AddHours(1),
    Path = "/",
    HttpOnly = true 
});
response.BuildCookie(); // 📌 关键：多 Cookie 写入时必须调用此方法进行 HTTP 头拼接

// 读取安全 Cookie（避免直接操作集合引发空引用危机）
string token;
request.TryGetCookieValue("token", out token);

// 批量清理与单项删除
response.DeleteCookie("token", new CookieOptions { Path = "/" });
response.ClearCookies();

```

---

## 3. 大文件断点续传与视频拖动流

PicoServer 在处理大文件上传与下载时，底层全部采用**全异步流式非阻塞（Producer-Consumer 思想）架构**，具备极低的内存开销。

```csharp
// 📥 大文件预览或强下载（支持 HTTP Range 断点续传，视频拖动秒开）
private async Task DownloadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string filePath = "D:\\industrial_video.mp4";
    
    // asAttachment: false 允许浏览器内联预览/播放；true 强触发浏览器下载
    // 第三个参数传入 request 后，自动解锁视频流任意时间点拖动播放能力
    await response.SendFileAsync(filePath, asAttachment: false, request);
}

// 📤 大文件流式上传（带高频进度回调）
private async Task UploadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string fileName = request.Headers["filename"]; // 建议生产环境对中文进行 Base64 编码
    
    bool isSuccess = await request.SaveFileAsync(fileName, (current, total) => 
    {
        Console.WriteLine($"当前文件上传进度：{ current * 100 / total }%");
    });
    
    await response.WriteAsync(isSuccess ? "{\"code\":1}" : "{\"code\":0}");
}

```

---

## 4. 身份鉴权：简单 Token 与商密 JWT 验证

开启全局验证中间件后，除白名单（精确路径）外，全站路由默认开启安全拦截。

```csharp
static void Main()
{
    MyAPI.RouteWhiteList.Add("/api/login"); // 1. 将登录接口排除在守卫之外
    
    // 方案 A：启用轻量级简单 Token 校验
    MyAPI.AddSimpleTokenVerify("PicoToken123");
    
    // 方案 B：启用标准的 JWT 工业鉴权
    // MyAPI.AddJwtTokenVerify("pico_secret_key");
    
    // 方案 C：【Pro 版独占】解锁国密标准：基于 HMAC-SM3 的国密级安全令牌鉴权
    // MyAPI.AddJwtTokenVerify("pico_secret_key", PicoServer.Crypto.HashType.SM3);
}

```

### 🔐 密码学配套工具链 【PicoServer.Crypto 库】

```csharp
string token = request.GetToken();            // 快速抓取 Header 头中携带的 Token
string payload = MyAPI.Jwt.DecodePayload(token); // 零多余依赖解码 JWT 载荷
string signature = HS256.ComputeHmac256(data, key); // 标准 HMAC-SHA256 计算
string passwordHash = SM3.HashPassword(pwd, salt, 10000); // 生产级防爆破 SM3 密码加盐哈希

```

---

## 5. 高级服务端推送 (SSE & 长连接)

针对工业物联网、上位机监控报警等高频、低延迟单向推送场景，提供秒级响应支持。

:::: code-group
::: code-group-item SSE (Server-Sent Events)

```csharp
public static async Task Notify(HttpListenerRequest request, HttpListenerResponse response)
{
    response.ContentType = "text/event-stream";
    response.Headers.Add("Cache-Control", "no-cache");
    response.SendChunked = true; // 开启分块传输

    for (int i = 0; i < 5; i++)
    {
        string msg = $"data: 传感器异常报警 {i} \n\n";
        byte[] buffer = System.Text.Encoding.UTF8.GetBytes(msg);
        await response.OutputStream.WriteAsync(buffer, 0, buffer.Length);
        await response.OutputStream.FlushAsync();
        await Task.Delay(1000);
    }
    response.Close(); // 推送结束必须显式关闭流
}

```

:::
::: code-group-item 长连接低内存 Chunk 块推送

```csharp
private async Task LongConnectionPush(HttpListenerRequest request, HttpListenerResponse response)
{
    // 循环往响应中以低内存开销追加 Chunk 数据块
    for (int i = 0; i <= 10; i++)
    {
        await response.WriteChunkAsync($"实时数据流水线 {i}\r\n");
        await Task.Delay(1000);
    }
    response.Close(); // 📌 注意：WriteChunkAsync 模式下必须手动 Close 连接防止内存泄露
}

```

:::
::::

> 🛠️ **在线调试工具**：VitePress 站内提供 [SSE 在线测试工具](https://picoserver.cn/tools/ssetest.html)。

---

## 6. 全双工 WebSocket 双向通信

服务端与常规 WebAPI 共用同一套端口与访问地址，支持集群化在线客户端生命周期监控。

### 📡 WebSocket 服务端配置

```csharp
static void Main()
{
    MyAPI.enableWebSocket = true; // 开启 WebSocket 协议接管机制
    MyAPI.WsOnConnectionChanged = WsConnectChanged; // 订阅连接变动事件
    MyAPI.WsOnMessage = OnMessageReceived;           // 订阅接收消息事件

    // 可选高级性能参数调优
    MyAPI.WsEnableHeartbeat = true; // 激活服务端自主心跳保活机制
    MyAPI.WsHeartbeatTimeout = 60;   // 闲置超时关闭机制（秒）
    MyAPI.WsMaxConnections = 500;   // 硬件级最大连接数上限截断

    MyAPI.StartServer();
}

private static async Task OnMessageReceived(string clientId, string message, Func<string, Task> reply)
{
    await reply("服务端已成功捕获数据！"); // 快速响应当前客户端
    
    // 遍历广播给所有连接在当前上位机上的其他客户端
    var clients = MyAPI.WsGetOnlineClients();
    foreach (var client in clients)
    {
        await MyAPI.WsSendToClientAsync(client, $"广播通知：用户 {clientId} 上报了：{message}");
    }
}

```

---

## 7. 自定义中间件 (Pipeline Execution)

PicoServer 完全开放了管道中间件扩展。利用 `AddMiddleware()` 可以非常简单地搓出**动态参数路由、接口限流器、黑名单拦截**等高级功能。中间件严格按照 **代码注册顺序** 执行。

### 🧱 案例：通过中间件自行扩展一个“动态参数路由处理器”

```csharp
MyAPI.AddMiddleware(async (req, resp) => {
    // 捕获类似 /product/12345 这种带有动态 ID 的复杂 REST 路径
    var match = Regex.Match(req.Url.AbsolutePath, @"^/product/(?<id>\d+)$");
    
    if (match.Success) {
        string id = match.Groups["id"].Value;

        if (req.HttpMethod == "GET") {
            await resp.WriteAsync($"{{\"action\":\"FetchProduct\", \"id\":{id}}}");
        }
        
        return false; // ⭐ 核心要点：处理完毕，返回 false 强行截断管道，不再向下游执行默认路由
    }

    return true; // 没匹配上，返回 true 予以放行，交给后置中间件或默认 404
});

```
