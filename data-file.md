---
title: 数据与文件 - PicoServer
description: PicoServer 文件上传下载、流媒体推送等数据处理能力
prev:
  text: 基础能力
  link: /basic
next:
  text: 实时通信
  link: /realtime
---

# 📁 数据与文件

## 1. 文件上传与下载

PicoServer 在处理文件上传与下载时，底层全部采用**全异步流式非阻塞（Producer-Consumer 思想）架构**，具备极低的内存开销。

### 文件下载/预览

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/file/download", DownloadFile, "GET");
    MyAPI.StartServer();
    Console.WriteLine("文件服务已启动：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

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
```

```vb [VB.NET]
Private ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/file/download", AddressOf DownloadFile, "GET")
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
```

:::

### 文件上传（带进度回调）

::: code-group

```csharp [C#]
private async Task UploadFile(HttpListenerRequest request, HttpListenerResponse response)
{
    string fname = request.Headers["filename"];
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
response.SendFileAsync(); // 流式发送，大文件低内存消耗
response.SendFileAsync(filePath); // 支持文档/视频等直接预览
response.SendFileAsync(filePath, true); // 强制下载
response.SendFileAsync(Mp4Path, false, request); // 播放视频，支持拖动播放

request.SaveFileAsync(); // 流式保存，大文件低内存消耗
request.SaveFileAsync(filePath); // 保存文件到指定路径
request.SaveFileAsync(filePath, onProgress); // 支持回调进度
```

---

## 2. 流媒体/直播流推送

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/stream/live", LiveStream, "GET");
    MyAPI.StartServer();
    Console.WriteLine("流媒体服务已启动：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private async Task LiveStream(HttpListenerRequest request, HttpListenerResponse response)
{
    string LiveFile = "D:\\test.mp4";
    if (!File.Exists(LiveFile))
    {
        await response.WriteAsync(@"{""code"":0, ""msg"":""直播源不存在""}");
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