---
title: 高级定制 - PicoServer
description: PicoServer 自定义中间件、动态路由、扩展点等高级定制能力
prev:
  text: 安全与鉴权
  link: /security
next:
  text: 扩展包
  link: /extensions
---

# 🔧 高级定制

> PicoServer 开放了**中间件**，可以借此进行二次开发、封装、集成解决方案等。
>
> 利用 `AddMiddleware()` 可开发属于自己的中间件。比如：参数路由、限流、黑名单等等。
>
> **注意：中间件的执行是按添加顺序执行的。**

## 1. 自定义中间件

### 极简文件服务器

一个完整的文件服务器示例，展示如何组合路由与 `SendFileAsync` 实现文件浏览、预览和下载。

::: code-group

```csharp [C#]
using PicoServer;

var MyAPI = new WebAPIServer();
string rootPath = @"D:\MyFiles";

MyAPI.AddRoute("/files", async (req, resp) => {
    var files = Directory.GetFiles(rootPath).Select(Path.GetFileName);
    var html = "<h1>文件清单</h1><ul>";
    foreach (var f in files)
        html += $"<li><a href='/view?name={f}'>{f}</a></li>";
    html += "</ul>";
    await resp.WriteAsync(html, WebAPIServer.ContentType.TextHtml);
}, "GET");

MyAPI.AddRoute("/view", (req, resp) => {
    string fileName = req.ParseGetQueryString("name");
    string fullPath = Path.Combine(rootPath, fileName);
    return resp.SendFileAsync(fullPath, asAttachment: false);
}, "GET");

MyAPI.AddRoute("/download", (req, resp) => {
    string fileName = req.ParseGetQueryString("name");
    return resp.SendFileAsync(Path.Combine(rootPath, fileName));
}, "GET");

MyAPI.StartServer(8090);
Console.WriteLine("文件服务器已启动: http://127.0.0.1:8090");
```

```vb [VB.NET]
Imports PicoServer

Dim MyAPI = New WebAPIServer()
Dim rootPath = "D:\MyFiles"

MyAPI.AddRoute("/files", Async Function(req, resp)
    Dim files = Directory.GetFiles(rootPath).[Select](Function(f) Path.GetFileName(f))
    Dim html = "<h1>文件清单</h1><ul>"
    For Each f In files
        html += $"<li><a href='/view?name={f}'>{f}</a></li>"
    Next
    html += "</ul>"
    Await resp.WriteAsync(html, WebAPIServer.ContentType.TextHtml)
End Function, "GET")

MyAPI.AddRoute("/view", Function(req, resp)
    Dim fileName = req.ParseGetQueryString("name")
    Dim fullPath = Path.Combine(rootPath, fileName)
    Return resp.SendFileAsync(fullPath, False)
End Function, "GET")

MyAPI.AddRoute("/download", Function(req, resp)
    Dim fileName = req.ParseGetQueryString("name")
    Return resp.SendFileAsync(Path.Combine(rootPath, fileName))
End Function, "GET")

MyAPI.StartServer(8090)
Console.WriteLine("文件服务器已启动: http://127.0.0.1:8090")
```

:::

## 2. 动态路由处理器

利用自定义中间件的扩展功能实现**动态路由**，在一个逻辑块内完成**路径匹配**、**方法分发**和**请求终结**。

::: code-group

```csharp [C#]
using PicoServer;
using System.Text.RegularExpressions;

var MyAPI = new WebAPIServer();

MyAPI.AddMiddleware(async (req, resp) => {
    var match = Regex.Match(req.Url.AbsolutePath, @"^/product/(?<id>\d+)$");

    if (match.Success) {
        string id = match.Groups["id"].Value;

        switch (req.HttpMethod) {
            case "GET":
                await resp.WriteAsync($"{{\"action\":\"查询商品\", \"id\":{id}}}");
                break;
            case "POST":
                await resp.WriteAsync($"{{\"action\":\"更新商品\", \"id\":{id}, \"result\":\"Success\"}}");
                break;
            default:
                resp.StatusCode = 405;
                await resp.WriteAsync("{\"msg\":\"不支持的操作\"}");
                break;
        }

        return false;
    }

    return true;
});

MyAPI.StartServer(8090);
```

```vb [VB.NET]
Imports PicoServer
Imports System.Text.RegularExpressions

Dim MyAPI = New WebAPIServer()

MyAPI.AddMiddleware(Async Function(req, resp)
    Dim match = Regex.Match(req.Url.AbsolutePath, "^/product/(?<id>\d+)$")

    If match.Success Then
        Dim id = match.Groups("id").Value

        Select Case req.HttpMethod
            Case "GET"
                Await resp.WriteAsync($"{{\"action\":\"查询商品\", \"id\":{id}}}")
            Case "POST"
                Await resp.WriteAsync($"{{\"action\":\"更新商品\", \"id\":{id}, \"result\":\"Success\"}}")
            Case Else
                resp.StatusCode = 405
                Await resp.WriteAsync("{\"msg\":\"不支持的操作\"}")
        End Select

        Return False
    End If

    Return True
End Function)

MyAPI.StartServer(8090)
```

:::

## 3. 扩展点

### 中间件注册

```csharp
MyAPI.AddMiddleware(async (req, resp) => {
    // 自定义逻辑
    return true; // 返回 true 继续执行，返回 false 终结请求
});
```

### 服务事件

```csharp
MyAPI.OnServerStarted += () => { Console.WriteLine("服务已启动"); };
MyAPI.OnServerStopped += () => { Console.WriteLine("服务已停止"); };
```