---
prev:
  text: Basic Features
  link: /en/basic
next:
  text: Custom Middleware
  link: /en/middleware
---

# 🚀 Advanced Features

## 1. Large File Upload/Download

When handling large file uploads and downloads, PicoServer uses a **fully async streaming non-blocking (Producer-Consumer) architecture** with extremely low memory overhead.

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/file/download", DownloadFile, "GET");  // File download/preview
    MyAPI.AddRoute("/file/upload", UploadFile, "POST");   // File upload

    MyAPI.StartServer();
    Console.WriteLine("File service started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

// File download/preview (asAttachment=false for preview, true for forced download)
private async Task DownloadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string TestFile = "D:\\test.mp4";
    if (!File.Exists(TestFile))
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""File not found""}");
        return;
    }
    await response.SendFileAsync(TestFile, true);
}

// File upload (with progress callback)
private async Task UploadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string fname = request.Headers["filename"]; // Get filename from request header
    bool isSuccess = await request.SaveFileAsync(fname, (current, total) =>
    {
        Console.WriteLine($"Upload progress: { current * 100 / total}%");
    });

    if (isSuccess)
    {
        await response.WriteAsync(@"{""code"":1, ""msg"":""File uploaded successfully""}");
    }
    else
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""File upload failed""}");
    }
}
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/file/download", AddressOf DownloadFile, "GET")
    MyAPI.AddRoute("/file/upload", AddressOf UploadFile, "POST")

    MyAPI.StartServer()
    Console.WriteLine("File service started: http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function DownloadFile(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim TestFile As String = "D:\test.mp4"
    If Not File.Exists(TestFile) Then
        Await response.WriteAsync("{""code"":0, ""msg"":""File not found""}")
        Return
    End If
    Await response.SendFileAsync(TestFile, True)
End Function

Private Async Function UploadFile(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim fname As String = request.Headers("filename")
    Dim isSuccess As Boolean = Await request.SaveFileAsync(fname, Sub(current, total)
        Console.WriteLine($"Upload progress: { current * 100 / total}%")
    End Sub)

    If isSuccess Then
        Await response.WriteAsync("{""code"":1, ""msg"":""File uploaded successfully""}")
    Else
        Await response.WriteAsync("{""code"":0, ""msg"":""File upload failed""}")
    End If
End Function
```

:::

**Related Methods**

```csharp
// Send file, supports resumable download
response.SendFileAsync(); // Streaming send, low memory for large files
response.SendFileAsync(filePath); // Supports direct preview of documents/videos
response.SendFileAsync(filePath, true); // Forced download
response.SendFileAsync(Mp4Path, false, request); // Video playback, supports seeking

// Accept file upload, supports resumable upload
request.SaveFileAsync(); // Streaming save, low memory for large files
request.SaveFileAsync(filePath); // Save file to specified path
request.SaveFileAsync(filePath, onProgress); // Progress callback
```

---

## 2. Streaming Media/Live Stream Push

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/stream/live", LiveStream, "GET"); // Live stream push
    MyAPI.StartServer();
    Console.WriteLine("Streaming service started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private async Task LiveStream(HttpListenerRequest request, HttpListenerResponse response)
{
    string LiveFile = "D:\\test.mp4"; // Live source file (can be replaced with real-time stream)
    if (!File.Exists(LiveFile))
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""Live source not found""}");
        return;
    }

    // Open file stream (FileShare.ReadWrite allows other programs to write to the file)
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
    Console.WriteLine("Streaming service started: http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function LiveStream(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim LiveFile As String = "D:\test.mp4"
    If Not File.Exists(LiveFile) Then
        Await response.WriteAsync("{""code"":0, ""msg"":""Live source not found""}")
        Return
    End If

    Using fs As New FileStream(LiveFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)
        Await response.SendStreamAsync(fs, GetContentType(".mp4"), True)
    End Using
End Function
```

:::

**Related Methods**

```csharp
response.SendStreamAsync(fs, GetContentType(".mp4"), true); // No cache, Chunked transfer, suitable for real-time streams
```

---

## 3. Advanced Server Push (SSE & Long Connection)

For high-frequency, low-latency one-way push scenarios like industrial IoT, HMI monitoring and alerting, providing second-level response support.

### SSE (Server-Sent Events)

Complete server implementation:

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/iot/notify", Notify, "GET"); // SSE push route
    MyAPI.StartServer(8090);
    Console.WriteLine("SSE push service started: http://127.0.0.1:8090/iot/notify");
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
            string msg = $"data: Message push {i} Time: {DateTime.Now}\n\n";
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
    Console.WriteLine("SSE push service started: http://127.0.0.1:8090/iot/notify")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Public Async Function Notify(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.ContentType = "text/event-stream"
    response.Headers.Add("Cache-Control", "no-cache")
    response.SendChunked = True

    Try
        For i As Integer = 0 To 4
            Dim msg As String = $"data: Message push {i} Time: {DateTime.Now}" & vbLf & vbLf
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

Frontend JavaScript example:

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

> 🛠️ **PicoServer SSE Online Test Tool** [/tools/ssetest.html](/tools/ssetest.html)

### Long Connection Low Memory Chunk Push

::: code-group

```csharp [C#]
private async Task LongConnectionPush(HttpListenerRequest request, HttpListenerResponse response)
{
    try
    {
        for (int i = 0; i <= 29; i++)
        {
            await response.WriteChunkAsync($"Device alert {i}: Temperature abnormal {DateTime.Now:HH:mm:ss}" + "\r\n");
            await Task.Delay(1000);
        }
        await response.WriteChunkAsync("Push ended");
    }
    finally
    {
        response.Close(); // 📌 Must manually Close in WriteChunkAsync mode
    }
}
```

```vb [VB.NET]
Private Async Function LongConnectionPush(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Try
        For i As Integer = 0 To 29
            Await response.WriteChunkAsync($"Device alert {i}: Temperature abnormal {DateTime.Now:HH:mm:ss}" & vbCrLf)
            Await Task.Delay(1000)
        Next
        Await response.WriteChunkAsync("Push ended")
    Finally
        response.Close()
    End Try
End Function
```

:::

---

## 4. Full-Duplex WebSocket Bidirectional Communication

> WebSocket server can coexist with WebAPI and share the same port. WebSocket is not affected by route address, generally use a custom `ws` as identifier.
>
> **WebSocket Online Test Tool: https://wstool.js.org/**

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

**Server Related Methods**

```csharp
MyAPI.enableWebSocket = true; // Enable WebSocket support
MyAPI.WsOnConnectionChanged; // Event: client connection status changed
MyAPI.WsOnMessage; // Event: received client message
MyAPI.WsBroadcastAsync(); // Broadcast message to all online clients
MyAPI.WsGetOnlineClients; // Get list of online clients
MyAPI.WsSendToClientAsync(client, message); // Send message to specified client
MyAPI.WsEnableHeartbeat = true; // Enable heartbeat detection, default false
MyAPI.WsHeartbeatTimeout = 60; // Set heartbeat timeout, default 30 seconds
MyAPI.WsMaxConnections = 200; // Set max connections, default 100
MyAPI.WsPingString = "hi"; // Set ping message, default "ping"
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
    Console.WriteLine($"Received message: {message}");
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
    Console.WriteLine($"Received message: {message}")
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

**Client Related Methods**

```csharp
private WebSocketClient wsClient = new WebSocketClient(); // Instantiate client
private WebSocketClient wsClient = new WebSocketClient("wss://echo.websocket.org/"); // Specify address, default 5s timeout
private WebSocketClient wsClient = new WebSocketClient("wss://echo.websocket.org/", 10); // Custom timeout

wsClient.StartConnect(); // Connect to server
wsClient.StopConnect();  // Disconnect
wsClient.SendMessageAsync(message); // Send message
wsClient.SendPingAsync(); // Send ping message, default "ping"
```

---

## 5. Authentication

> Once authentication is added, all routes require authentication by default. Routes that don't need authentication should be added to the route whitelist.
>
> Whitelist only applies to exact routes (paths), wildcard routes are not supported.

### Route Whitelist

```csharp
MyAPI.RouteWhiteList; // Collection that stores route whitelist
MyAPI.RouteWhiteList.Add("/api/login"); // Add route to whitelist, no verification needed
```

### Simple Token Authentication

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
    await response.WriteAsync($@"{{""code"":1, ""msg"":""Login successful"",""token"":""{_testToken}""}}");
}

private async Task GetUserInfo(HttpListenerRequest request, HttpListenerResponse response)
{
    string token = request.GetToken();
    await response.WriteAsync($@"{{""code"":1, ""msg"":""Get info successful"",""token"":{token}}}");
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
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""Login successful\"",\""token\"":\""{_testToken}\""}}")
End Function

Private Async Function GetUserInfo(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String = request.GetToken()
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""Get info successful\"",\""token\"":{token}}}")
End Function
```

:::

**Related Methods**

```csharp
MyAPI.AddSimpleTokenVerify(testToken); // Add simple token verification middleware
request.GetToken(); // Get token value from request header
```

### JWT Authentication

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
    await response.WriteAsync($@"{{""code"":1, ""msg"":""Login successful"",""token"":""{_testToken}""}}");
}

private async Task GetUserInfo(HttpListenerRequest request, HttpListenerResponse response)
{
    string token = request.GetToken();
    string payload = MyAPI.Jwt.DecodePayload(token);
    await response.WriteAsync($@"{{""code"":1, ""msg"":""Get info successful"",""userInfo"":{payload}}}");
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
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""Login successful\"",\""token\"":\""{_testToken}\""}}")
End Function

Private Async Function GetUserInfo(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String = request.GetToken()
    Dim payload As String = MyAPI.Jwt.DecodePayload(token)
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""Get info successful\"",\""userInfo\"":{payload}}}")
End Function
```

:::

**Related Methods**

::: code-group

```csharp
MyAPI.AddJwtTokenVerify("pico_secret_779"); // Add JWT authentication middleware, HS256 encryption
MyAPI.AddJwtTokenVerify("pico_secret_779", PicoServer.Crypto.HashType.SM3); // HMAC-SM3 GM encryption

request.GetToken(); // Get token value from request header
MyAPI.Jwt.DecodePayload(token); // Decode JWT payload
MyAPI.Jwt.GenerateToken(payload); // Create JWT token

MyAPI.GetTimeStamp10(3600); // Get 10-digit timestamp, add 3600 seconds (1 hour)
MyAPI.GetTimeStamp10();     // Get current 10-digit timestamp
MyAPI.GetTimeStamp13();     // Get 13-digit timestamp (milliseconds)
MyAPI.GetTimeStamp13(500);  // Get 13-digit timestamp, add 500 milliseconds
```

```vb
MyAPI.AddJwtTokenVerify("pico_secret_779") ' Add JWT authentication middleware, HS256 encryption
MyAPI.AddJwtTokenVerify("pico_secret_779", PicoServer.Crypto.HashType.SM3) ' HMAC-SM3 GM encryption

request.GetToken() ' Get token value from request header
MyAPI.Jwt.DecodePayload(token) ' Decode JWT payload
MyAPI.Jwt.GenerateToken(payload) ' Create JWT token

MyAPI.GetTimeStamp10(3600) ' Get 10-digit timestamp, add 3600 seconds (1 hour)
MyAPI.GetTimeStamp10() ' Get current 10-digit timestamp
MyAPI.GetTimeStamp13() ' Get 13-digit timestamp (milliseconds)
MyAPI.GetTimeStamp13(500) ' Get 13-digit timestamp, add 500 milliseconds
```

:::

## 6. Encryption Tools (PicoServer.Crypto)

> Encryption toolkit provided by Pro version, supports GM/SM3 algorithm.
