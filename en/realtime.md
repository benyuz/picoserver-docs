---
title: Real-time Communication - PicoServer
description: PicoServer SSE, long connection, WebSocket real-time communication
prev:
  text: Data & Files
  link: /en/data-file
next:
  text: Security & Auth
  link: /en/security
---

# 🔄 Real-time Communication

> Supports SSE, long connection, and WebSocket for bidirectional/unidirectional real-time data push scenarios.

## 1. SSE (Server-Sent Events)

High-frequency, low-latency one-way push for IoT and monitoring scenarios.

### Server Implementation

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/iot/notify", Notify, "GET");
    MyAPI.StartServer(8090);
    Console.WriteLine("SSE service started: http://127.0.0.1:8090/iot/notify");
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
            string msg = $"data: Message {i} Time: {DateTime.Now}\n\n";
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
    Console.WriteLine("SSE service started: http://127.0.0.1:8090/iot/notify")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Public Async Function Notify(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.ContentType = "text/event-stream"
    response.Headers.Add("Cache-Control", "no-cache")
    response.SendChunked = True

    Try
        For i As Integer = 0 To 4
            Dim msg As String = $"data: Message {i} Time: {DateTime.Now}" & vbLf & vbLf
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

### Frontend JavaScript

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

---

## 2. Long Connection Chunk Push

::: code-group

```csharp [C#]
private async Task LongConnectionPush(HttpListenerRequest request, HttpListenerResponse response)
{
    try
    {
        for (int i = 0; i <= 29; i++)
        {
            await response.WriteChunkAsync($"Alert {i}: Temperature anomaly {DateTime.Now:HH:mm:ss}" + "\r\n");
            await Task.Delay(1000);
        }
        await response.WriteChunkAsync("Push complete");
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
            Await response.WriteChunkAsync($"Alert {i}: Temperature anomaly {DateTime.Now:HH:mm:ss}" & vbCrLf)
            Await Task.Delay(1000)
        Next
        Await response.WriteChunkAsync("Push complete")
    Finally
        response.Close()
    End Try
End Function
```

:::

---

## 3. WebSocket Bidirectional Communication

WebSocket server can coexist with WebAPI on the same port.

### Server

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.enableWebSocket = true;
    MyAPI.WsOnConnectionChanged = WsConnectChanged;
    MyAPI.WsOnMessage = OnMessageReceived;

    MyAPI.StartServer();
    Console.WriteLine("PicoServer WebSocket: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private async Task WsConnectChanged(string clientId, bool connected)
{
    await MyAPI.WsBroadcastAsync($"{clientId} {connected}");
}

private async Task OnMessageReceived(string clientId, string message, Func<string, Task> reply)
{
    await reply("Received!");
    var clients = MyAPI.WsGetOnlineClients();
    foreach (var client in clients)
    {
        await MyAPI.WsSendToClientAsync(client, $"{clientId} says: {message}");
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
    Console.WriteLine("PicoServer WebSocket: http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function WsConnectChanged(clientId As String, connected As Boolean) As Task
    Await MyAPI.WsBroadcastAsync($"{clientId} {connected}")
End Function

Private Async Function OnMessageReceived(clientId As String, message As String, reply As Func(Of String, Task)) As Task
    Await reply("Received!")
    Dim clients = MyAPI.WsGetOnlineClients()
    For Each client In clients
        Await MyAPI.WsSendToClientAsync(client, $"{clientId} says: {message}")
    Next
End Function
```

:::

**Server Methods**

```csharp
MyAPI.enableWebSocket = true; // Enable WebSocket support
MyAPI.WsOnConnectionChanged; // Event: client connection changed
MyAPI.WsOnMessage; // Event: message received
MyAPI.WsBroadcastAsync(); // Broadcast to all clients
MyAPI.WsGetOnlineClients; // Get online clients
MyAPI.WsSendToClientAsync(client, message); // Send to specific client
MyAPI.WsEnableHeartbeat = true; // Enable heartbeat, default false
MyAPI.WsHeartbeatTimeout = 60; // Heartbeat timeout, default 30s
MyAPI.WsMaxConnections = 200; // Max connections, default 100
MyAPI.WsPingString = "hi"; // Ping message, default "ping"
```

### Client

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
    Console.WriteLine("Connected!");
}

private void OnMessageReceived(object sender, string message)
{
    Console.WriteLine($"Received: {message}");
    wsClient.SendMessageAsync($"hi: {DateTime.Now.ToShortTimeString()}");
}

private void OnDisconnected(object sender, EventArgs e)
{
    Console.WriteLine("Disconnected!");
}

private void OnError(object sender, WebSocketErrorEventArgs e)
{
    Console.WriteLine($"Error: {e.ErrorCode}, {e.ErrorMessage}");
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
    Console.WriteLine("Connected!")
End Sub

Private Sub OnMessageReceived(sender As Object, message As String)
    Console.WriteLine($"Received: {message}")
    wsClient.SendMessageAsync($"hi: {DateTime.Now.ToShortTimeString()}")
End Sub

Private Sub OnDisconnected(sender As Object, e As EventArgs)
    Console.WriteLine("Disconnected!")
End Sub

Private Sub OnError(sender As Object, e As WebSocketErrorEventArgs)
    Console.WriteLine($"Error: {e.ErrorCode}, {e.ErrorMessage}")
End Sub
```

:::

**Client Methods**

```csharp
private WebSocketClient wsClient = new WebSocketClient();
private WebSocketClient wsClient = new WebSocketClient("wss://echo.websocket.org/");
private WebSocketClient wsClient = new WebSocketClient("wss://echo.websocket.org/", 10);

wsClient.StartConnect(); // Connect to server
wsClient.StopConnect();  // Disconnect
wsClient.SendMessageAsync(message); // Send message
wsClient.SendPingAsync(); // Send ping
```