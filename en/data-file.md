---
title: Data & Files - PicoServer
description: PicoServer file upload/download, streaming capabilities
prev:
  text: Basic Features
  link: /en/basic
next:
  text: Real-time Communication
  link: /en/realtime
---

# 📁 Data & Files

> Provides file upload/download, streaming capabilities with fully async streaming architecture and minimal memory overhead.

## 1. File Upload & Download

PicoServer uses fully async streaming non-blocking architecture for file handling, with extremely low memory overhead.

### File Download/Preview

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/file/download", DownloadFile, "GET");
    MyAPI.StartServer();
    Console.WriteLine("File service started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

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
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/file/download", AddressOf DownloadFile, "GET")
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
```

:::

### File Upload (with progress callback)

::: code-group

```csharp [C#]
private async Task UploadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string fname = request.Headers["filename"];
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
response.SendFileAsync(); // Stream send, low memory for large files
response.SendFileAsync(filePath); // Preview documents/videos
response.SendFileAsync(filePath, true); // Force download
response.SendFileAsync(Mp4Path, false, request); // Video playback with seek

request.SaveFileAsync(); // Stream save, low memory for large files
request.SaveFileAsync(filePath); // Save to specified path
request.SaveFileAsync(filePath, onProgress); // With progress callback
```

---

## 2. Streaming / Live Streaming

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/stream/live", LiveStream, "GET");
    MyAPI.StartServer();
    Console.WriteLine("Streaming service started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private async Task LiveStream(HttpListenerRequest request, HttpListenerResponse response)
{
    string LiveFile = "D:\\test.mp4";
    if (!File.Exists(LiveFile))
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""Source not found""}");
        return;
    }

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
        Await response.WriteAsync("{""code"":0, ""msg"":""Source not found""}")
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
response.SendStreamAsync(fs, GetContentType(".mp4"), true); // No cache, Chunked transfer for real-time streams
```