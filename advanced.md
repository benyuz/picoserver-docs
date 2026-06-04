---
prev:
  text: 基础能力
  link: /basic
next:
  text: 自定义中间件
  link: /middleware
---

# 🚀 高级能力（含鉴权）

## 1. 大文件上传/下载

PicoServer 在处理大文件上传与下载时，底层全部采用**全异步流式非阻塞（Producer-Consumer 思想）架构**，具备极低的内存开销。

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/file/download", DownloadFile, "GET");  // 文件下载/预览
    MyAPI.AddRoute("/file/upload", UploadFile, "POST");     // 文件上传

    MyAPI.StartServer();
    Console.WriteLine("文件服务已启动：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

// 文件下载/预览（asAttachment=false 预览，true 强制下载）
private async Task DownloadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string TestFile = "D:\\test.mp4";
    if (!File.Exists(TestFile))
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""文件不存在""}");
        return;
    }
    await response.SendFileAsync(TestFile, true);
}

// 文件上传（带进度回调）
private async Task UploadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string fname = request.Headers["filename"]; //从请求头中获取文件名，中文文件名建议用 BASE64 编码或者 URL 编码
    bool isSuccess = await request.SaveFileAsync(fname, (current, total) =>
    {
        Console.WriteLine($"上传进度：{ current * 100 / total}%");
    });

    if (isSuccess)
    {
        await response.WriteAsync(@"{""code"":1, ""msg"":""文件上传成功""}");
    }
    else
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""文件上传失败""}");
    }
}
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/file/download", AddressOf DownloadFile, "GET")
    MyAPI.AddRoute("/file/upload", AddressOf UploadFile, "POST")

    MyAPI.StartServer()
    Console.WriteLine("文件服务已启动：http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function DownloadFile(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim TestFile As String = "D:\test.mp4"
    If Not File.Exists(TestFile) Then
        Await response.WriteAsync("{""code"":0, ""msg"":""文件不存在""}")
        Return
    End If
    Await response.SendFileAsync(TestFile, True)
End Function

Private Async Function UploadFile(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim fname As String = request.Headers("filename")
    Dim isSuccess As Boolean = Await request.SaveFileAsync(fname, Sub(current, total)
        Console.WriteLine($"上传进度：{ current * 100 / total}%")
    End Sub)

    If isSuccess Then
        Await response.WriteAsync("{""code"":1, ""msg"":""文件上传成功""}")
    Else
        Await response.WriteAsync("{""code"":0, ""msg"":""文件上传失败""}")
    End If
End Function
```

:::

**相关方法**

```csharp
//发送文件，支持断点下载
response.SendFileAsync(); //流式发送，大文件低内存消耗，根据扩展名自动添加文件类型
response.SendFileAsync(filePath); //支持文档/视频等直接预览
response.SendFileAsync(filePath, true); //强制下载
response.SendFileAsync(Mp4Path, false, request); //播放视频，支持拖动播放
//接受文件上传，支持断点续传
request.SaveFileAsync(); //流式保存，大文件低内存消耗
request.SaveFileAsync(filePath); //保存文件到指定路径（相对/绝对皆可），需要包含文件名
request.SaveFileAsync(filePath, onProgress); //保存文件到指定路径，支持回调进度

request.Headers["filename"]; //举例：从请求头中获取文件名，生产中应进行非空判断
```

---

## 2. 流媒体/直播流推送

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/stream/live", LiveStream, "GET"); // 直播流推送
    MyAPI.StartServer();
    Console.WriteLine("流媒体服务已启动：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private async Task LiveStream(HttpListenerRequest request, HttpListenerResponse response)
{
    string LiveFile = "D:\\test.mp4"; // 直播源文件（可替换为实时流）
    if (!File.Exists(LiveFile))
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""直播源不存在""}");
        return;
    }

    // 打开文件流（FileShare.ReadWrite 允许文件被其他程序写入）
    using (FileStream fs = new FileStream(LiveFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
    {
        await response.SendStreamAsync(fs, GetContentType(".mp4"), true);
    }
}
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/stream/live", AddressOf LiveStream, "GET")
    MyAPI.StartServer()
    Console.WriteLine("流媒体服务已启动：http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function LiveStream(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim LiveFile As String = "D:\test.mp4"
    If Not File.Exists(LiveFile) Then
        Await response.WriteAsync("{""code"":0, ""msg"":""直播源不存在""}")
        Return
    End If

    Using fs As New FileStream(LiveFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)
        Await response.SendStreamAsync(fs, GetContentType(".mp4"), True)
    End Using
End Function
```

:::

**相关方法**

```csharp
response.SendStreamAsync(fs, GetContentType(".mp4"), true); //无缓存、Chunked 传输，适配实时流
```

---

## 3. 高级服务端推送 (SSE & 长连接)

针对工业物联网、上位机监控报警等高频、低延迟单向推送场景，提供秒级响应支持。

### SSE (Server-Sent Events)

::: code-group

```csharp [C#]
public static async Task Notify(HttpListenerRequest request, HttpListenerResponse response)
{
    response.ContentType = "text/event-stream";
    response.Headers.Add("Cache-Control", "no-cache");
    response.SendChunked = true;

    try
    {
        for (int i = 0; i < 5; i++)
        {
            string msg = $"data: 消息推送 {i} 时间: {DateTime.Now}\n\n";
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(msg);
            await response.OutputStream.WriteAsync(buffer, 0, buffer.Length);
            await response.OutputStream.FlushAsync();
            await Task.Delay(1000);
        }
    }
    finally
    {
        response.Close();
    }
}
```

```vb [VB.NET]
Public Async Function Notify(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.ContentType = "text/event-stream"
    response.Headers.Add("Cache-Control", "no-cache")
    response.SendChunked = True

    Try
        For i As Integer = 0 To 4
            Dim msg As String = $"data: 消息推送 {i} 时间: {DateTime.Now}" & vbLf & vbLf
            Dim buffer As Byte() = System.Text.Encoding.UTF8.GetBytes(msg)
            Await response.OutputStream.WriteAsync(buffer, 0, buffer.Length)
            Await response.OutputStream.FlushAsync()
            Await Task.Delay(1000)
        Next
    Finally
        response.Close()
    End Try
End Function
```

:::

前端 JavaScript 示例：

```js
function startSSE() {
    const source = new EventSource("/iot/notify");
    source.onmessage = function (event) {
        document.getElementById("result").innerHTML += event.data + "<br>";
    };
    source.onerror = function () {
        source.close();
    };
}
```

> 🛠️ **PicoServer SSE 在线测试工具** https://picoserver.cn/tools/ssetest.html

### 长连接低内存 Chunk 块推送

::: code-group

```csharp [C#]
private async Task LongConnectionPush(HttpListenerRequest request, HttpListenerResponse response)
{
    try
    {
        for (int i = 0; i <= 29; i++)
        {
            await response.WriteChunkAsync($"设备报警 {i}：温度异常 {DateTime.Now:HH:mm:ss}" + "\r\n");
            await Task.Delay(1000);
        }
        await response.WriteChunkAsync("推送结束");
    }
    finally
    {
        response.Close(); // 📌 WriteChunkAsync 模式下必须手动 Close
    }
}
```

```vb [VB.NET]
Private Async Function LongConnectionPush(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Try
        For i As Integer = 0 To 29
            Await response.WriteChunkAsync($"设备报警 {i}：温度异常 {DateTime.Now:HH:mm:ss}" & vbCrLf)
            Await Task.Delay(1000)
        Next
        Await response.WriteChunkAsync("推送结束")
    Finally
        response.Close()
    End Try
End Function
```

:::

---

## 4. 全双工 WebSocket 双向通信

> WebSocket 服务端可以和 WebAPI 同时存在，且共用端口，共用地址。
>
> **WebSocket 在线测试工具 https://wstool.js.org/**

### 服务端

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.enableWebSocket = true;
    MyAPI.WsOnConnectionChanged = WsConnectChanged;
    MyAPI.WsOnMessage = OnMessageReceived;

    MyAPI.StartServer();
    Console.WriteLine("PicoServer WebSocket：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private async Task WsConnectChanged(string clientId, bool connected)
{
    await MyAPI.WsBroadcastAsync($"{clientId} {connected}");
}

private async Task OnMessageReceived(string clientId, string message, Func<string, Task> reply)
{
    await reply("收到！");
    var clients = MyAPI.WsGetOnlineClients();
    foreach (var client in clients)
    {
        await MyAPI.WsSendToClientAsync(client, $"{clientId}说：{message}");
    }
}
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.enableWebSocket = True
    MyAPI.WsOnConnectionChanged = AddressOf WsConnectChanged
    MyAPI.WsOnMessage = AddressOf OnMessageReceived

    MyAPI.StartServer()
    Console.WriteLine("PicoServer WebSocket：http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function WsConnectChanged(clientId As String, connected As Boolean) As Task
    Await MyAPI.WsBroadcastAsync($"{clientId} {connected}")
End Function

Private Async Function OnMessageReceived(clientId As String, message As String, reply As Func(Of String, Task)) As Task
    Await reply("收到！")
    Dim clients = MyAPI.WsGetOnlineClients()
    For Each client In clients
        Await MyAPI.WsSendToClientAsync(client, $"{clientId}说：{message}")
    Next
End Function
```

:::

**服务端相关方法**

```csharp
MyAPI.enableWebSocket = true; //启用WebSocket支持
MyAPI.WsOnConnectionChanged; // 事件：客户端连接状态变化
MyAPI.WsOnMessage; //事件：收到客户端消息
MyAPI.WsBroadcastAsync(); //对所有在线客户端广播消息
MyAPI.WsGetOnlineClients; //获取在线客户端列表
MyAPI.WsSendToClientAsync(client, message); //给指定客户端发送消息
MyAPI.WsEnableHeartbeat = true; //启用心跳检测，默认false
MyAPI.WsHeartbeatTimeout = 60; //设置心跳时间，默认30秒
MyAPI.WsMaxConnections = 200; //设置最大连接数，默认100
MyAPI.WsPingString = "hi"; //设置 ping 消息，默认"ping"
```

### 客户端

::: code-group

```csharp [C#]
private WebSocketClient wsClient = new WebSocketClient("wss://echo.websocket.org/");

static void Main()
{
    wsClient.OnConnected += OnConnected;
    wsClient.OnMessageReceived += OnMessageReceived;
    wsClient.OnDisconnected += OnDisconnected;
    wsClient.OnError += OnError;
    wsClient.StartConnect();
    Console.ReadKey();
    wsClient.StopConnect();
}

private void OnConnected(object sender, EventArgs e)
{
    Console.WriteLine("连接成功！");
}

private void OnMessageReceived(object sender, string message)
{
    Console.WriteLine($"收到消息: {message}");
    wsClient.SendMessageAsync($"hi: {DateTime.Now.ToShortTimeString()}");
}

private void OnDisconnected(object sender, EventArgs e)
{
    Console.WriteLine("连接已断开！");
}

private void OnError(object sender, WebSocketErrorEventArgs e)
{
    Console.WriteLine($"错误: {e.ErrorCode}, {e.ErrorMessage}");
}
```

```vb [VB.NET]
Private wsClient As New WebSocketClient("wss://echo.websocket.org/")

Sub Main()
    AddHandler wsClient.OnConnected, AddressOf OnConnected
    AddHandler wsClient.OnMessageReceived, AddressOf OnMessageReceived
    AddHandler wsClient.OnDisconnected, AddressOf OnDisconnected
    AddHandler wsClient.OnError, AddressOf OnError
    wsClient.StartConnect()
    Console.ReadKey()
    wsClient.StopConnect()
End Sub

Private Sub OnConnected(sender As Object, e As EventArgs)
    Console.WriteLine("连接成功！")
End Sub

Private Sub OnMessageReceived(sender As Object, message As String)
    Console.WriteLine($"收到消息: {message}")
    wsClient.SendMessageAsync($"hi: {DateTime.Now.ToShortTimeString()}")
End Sub

Private Sub OnDisconnected(sender As Object, e As EventArgs)
    Console.WriteLine("连接已断开！")
End Sub

Private Sub OnError(sender As Object, e As WebSocketErrorEventArgs)
    Console.WriteLine($"错误: {e.ErrorCode}, {e.ErrorMessage}")
End Sub
```

:::

**客户端相关方法**

```csharp
private WebSocketClient wsClient = new WebSocketClient(); //实例化客户端
private WebSocketClient wsClient = new WebSocketClient("wss://echo.websocket.org/"); //指定地址，默认5秒超时
private WebSocketClient wsClient = new WebSocketClient("wss://echo.websocket.org/", 10); //自定义超时

wsClient.StartConnect(); //连接服务端
wsClient.StopConnect();  //断开连接
wsClient.SendMessageAsync(message); //发送消息
wsClient.SendPingAsync(); //发送 ping 消息，默认"ping"
```

---

## 5. 鉴权

> 一旦添加鉴权，默认所有路由都需要鉴权。不需要鉴权的路由需要添加到路由白名单。
>
> 白名单只针对精准路由（路径），不支持星号路由。

### 路由白名单

```csharp
MyAPI.RouteWhiteList; //储存路由白名单的集合
MyAPI.RouteWhiteList.Add("/api/login"); //添加接口到白名单，无需验证
```

### 简单 Token 鉴权

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();
private string _testToken = "PicoServer123";

static void Main()
{
    MyAPI.AddRoute("/api/login", Login, "POST");
    MyAPI.AddRoute("/api/user/info", GetUserInfo, "GET");

    MyAPI.RouteWhiteList.Add("/api/login");
    MyAPI.AddSimpleTokenVerify(_testToken);

    MyAPI.StartServer();
    Console.ReadKey();
    MyAPI.StopServer();
}

private async Task Login(HttpListenerRequest request, HttpListenerResponse response)
{
    await response.WriteAsync($@"{{""code"":1, ""msg"":""登录成功"",""token"":""{_testToken}""}}");
}

private async Task GetUserInfo(HttpListenerRequest request, HttpListenerResponse response)
{
    string token = request.GetToken();
    await response.WriteAsync($@"{{""code"":1, ""msg"":""获取信息成功"",""token"":{token}}}");
}
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()
Private _testToken As String = "PicoServer123"

Sub Main()
    MyAPI.AddRoute("/api/login", AddressOf Login, "POST")
    MyAPI.AddRoute("/api/user/info", AddressOf GetUserInfo, "GET")

    MyAPI.RouteWhiteList.Add("/api/login")
    MyAPI.AddSimpleTokenVerify(_testToken)

    MyAPI.StartServer()
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function Login(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""登录成功\"",\""token\"":\""{_testToken}\""}}")
End Function

Private Async Function GetUserInfo(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String = request.GetToken()
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""获取信息成功\"",\""token\"":{token}}}")
End Function
```

:::

**相关方法**

```csharp
MyAPI.AddSimpleTokenVerify(testToken); //添加简单 token 验证中间件
request.GetToken(); //获取请求头中的 token 值
```

### JWT 鉴权

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();
private string _testToken;

static void Main()
{
    MyAPI.AddRoute("/api/login", Login, "POST");
    MyAPI.AddRoute("/api/user/info", GetUserInfo, "GET");

    MyAPI.RouteWhiteList.Add("/api/login");
    MyAPI.AddJwtTokenVerify("pico_secret_779");

    GenerateTestToken();

    MyAPI.StartServer();
    Console.ReadKey();
    MyAPI.StopServer();
}

private void GenerateTestToken()
{
    long exp = MyAPI.GetTimeStamp10(3600);
    string payload = $@"{{""username"":""admin"",""role"":""super"",""exp"":{exp}}}";
    _testToken = MyAPI.Jwt.GenerateToken(payload);
}

private async Task Login(HttpListenerRequest request, HttpListenerResponse response)
{
    await response.WriteAsync($@"{{""code"":1, ""msg"":""登录成功"",""token"":""{_testToken}""}}");
}

private async Task GetUserInfo(HttpListenerRequest request, HttpListenerResponse response)
{
    string token = request.GetToken();
    string payload = MyAPI.Jwt.DecodePayload(token);
    await response.WriteAsync($@"{{""code"":1, ""msg"":""获取信息成功"",""userInfo"":{payload}}}");
}
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()
Private _testToken As String

Sub Main()
    MyAPI.AddRoute("/api/login", AddressOf Login, "POST")
    MyAPI.AddRoute("/api/user/info", AddressOf GetUserInfo, "GET")

    MyAPI.RouteWhiteList.Add("/api/login")
    MyAPI.AddJwtTokenVerify("pico_secret_779")

    GenerateTestToken()

    MyAPI.StartServer()
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Sub GenerateTestToken()
    Dim exp As Long = MyAPI.GetTimeStamp10(3600)
    Dim payload As String = $"{{\""username\"":\""admin\"",\""role\"":\""super\"",\""exp\"":{exp}}}"
    _testToken = MyAPI.Jwt.GenerateToken(payload)
End Sub

Private Async Function Login(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""登录成功\"",\""token\"":\""{_testToken}\""}}")
End Function

Private Async Function GetUserInfo(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String = request.GetToken()
    Dim payload As String = MyAPI.Jwt.DecodePayload(token)
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""获取信息成功\"",\""userInfo\"":{payload}}}")
End Function
```

:::

**相关方法**

```csharp
MyAPI.AddJwtTokenVerify("pico_secret_779"); //添加 JWT 鉴权中间件，HS256 加密
MyAPI.AddJwtTokenVerify("pico_secret_779", PicoServer.Crypto.HashType.SM3); //HMAC-SM3 国密

request.GetToken(); //获取请求头中的 token 值
MyAPI.Jwt.DecodePayload(token); //解码 JWT 负载
MyAPI.Jwt.GenerateToken(payload); //创建 JWT token

MyAPI.GetTimeStamp10(3600); // 获取10位时间戳
MyAPI.GetTimeStamp13(); // 获取13位时间戳

// 加密工具（PicoServer.Crypto）
string signature = HS256.ComputeHmac256(data, key); // HMAC-SHA256 签名
byte[] hash = SM3.ComputeHash(data); // SM3 哈希计算
string hmacSm3 = SM3.ComputeHmacSM3(data, key); // HMAC-SM3 签名
string passwordHash = SM3.HashPassword(password, salt, iterations); // SM3 密码哈希
string encoded = Base64Url.Encode(data); // Base64Url 编码
string decoded = Base64Url.Decode(encoded); // Base64Url 解码
```
