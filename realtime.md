---
title: 实时通信 - PicoServer
description: PicoServer SSE、长连接、WebSocket 实时通信能力
prev:
  text: 数据与文件
  link: /data-file
next:
  text: 安全与鉴权
  link: /security
---

# 🔄 实时通信

> 支持 SSE、长连接、WebSocket 三种实时通信模式，满足不同场景下的双向/单向数据推送需求。

## 1. SSE (Server-Sent Events)

针对工业物联网、上位机监控报警等高频、低延迟单向推送场景，提供秒级响应支持。

### 服务端实现

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/iot/notify", Notify, "GET");
    MyAPI.StartServer(8090);
    Console.WriteLine("SSE推送服务已启动：http://127.0.0.1:8090/iot/notify");
    Console.ReadKey();
    MyAPI.StopServer();
}

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
Private ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/iot/notify", AddressOf Notify, "GET")
    MyAPI.StartServer(8090)
    Console.WriteLine("SSE推送服务已启动：http://127.0.0.1:8090/iot/notify")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

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

### 前端 JavaScript 示例

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

## 2. 长连接 Chunk 块推送

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
        response.Close();
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

## 3. WebSocket 双向通信

> WebSocket 服务端可以和 WebAPI 同时存在，且共用端口。一般自定义一个 `ws` 作为标识。

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
MyAPI.enableWebSocket = true; // 启用 WebSocket 支持
MyAPI.WsOnConnectionChanged; // 事件：客户端连接状态变化
MyAPI.WsOnMessage; // 事件：收到客户端消息
MyAPI.WsBroadcastAsync(); // 对所有在线客户端广播消息
MyAPI.WsGetOnlineClients; // 获取在线客户端列表
MyAPI.WsSendToClientAsync(client, message); // 给指定客户端发送消息
MyAPI.WsEnableHeartbeat = true; // 启用心跳检测，默认 false
MyAPI.WsHeartbeatTimeout = 60; // 设置心跳超时，默认 30 秒
MyAPI.WsMaxConnections = 200; // 设置最大连接数，默认 100
MyAPI.WsPingString = "hi"; // 设置 ping 消息，默认 "ping"
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