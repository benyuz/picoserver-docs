---
prev:
  text: Advanced Features
  link: /en/advanced
next:
  text: Benchmark
  link: /en/benchmark
---

# 🔧 Custom Middleware

> PicoServer provides **middleware** functionality for secondary development, encapsulation, and integrated solutions.
>
> Using `AddMiddleware()`, you can develop your own middleware. For example: parameter routing, rate limiting, blacklists, etc.
>
> **Note: Middleware executes in the order it is added.**

---

## 1. Minimal File Server

A complete file server example demonstrating how to combine routing with `SendFileAsync` for file browsing, preview, and download.

::: code-group

```csharp [C#]
using PicoServer;

var MyAPI = new WebAPIServer();
string rootPath = @"D:\MyFiles";

// Home page: list all files
MyAPI.AddRoute("/files", async (req, resp) => {
    var files = Directory.GetFiles(rootPath).Select(Path.GetFileName);
    var html = "<h1>File List</h1><ul>";
    foreach (var f in files)
        html += $"<li><a href='/view?name={f}'>{f}</a></li>";
    html += "</ul>";
    await resp.WriteAsync(html, WebAPIServer.ContentType.TextHtml);
}, "GET");

// View/preview: supports video seeking
MyAPI.AddRoute("/view", (req, resp) => {
    string fileName = req.ParseGetQueryString("name");
    string fullPath = Path.Combine(rootPath, fileName);
    return resp.SendFileAsync(fullPath, asAttachment: false);
}, "GET");

// Forced download
MyAPI.AddRoute("/download", (req, resp) => {
    string fileName = req.ParseGetQueryString("name");
    return resp.SendFileAsync(Path.Combine(rootPath, fileName));
}, "GET");

MyAPI.StartServer(8090);
Console.WriteLine("File server started: http://127.0.0.1:8090");
```

```vb [VB.NET]
Imports PicoServer

Dim MyAPI = New WebAPIServer()
Dim rootPath = "D:\MyFiles"

' Home page: list all files
MyAPI.AddRoute("/files", Async Function(req, resp)
    Dim files = Directory.GetFiles(rootPath).[Select](Function(f) Path.GetFileName(f))
    Dim html = "<h1>File List</h1><ul>"
    For Each f In files
        html += $"<li><a href='/view?name={f}'>{f}</a></li>"
    Next
    html += "</ul>"
    Await resp.WriteAsync(html, WebAPIServer.ContentType.TextHtml)
End Function, "GET")

' View/preview: supports video seeking
MyAPI.AddRoute("/view", Function(req, resp)
    Dim fileName = req.ParseGetQueryString("name")
    Dim fullPath = Path.Combine(rootPath, fileName)
    Return resp.SendFileAsync(fullPath, False)
End Function, "GET")

' Forced download
MyAPI.AddRoute("/download", Function(req, resp)
    Dim fileName = req.ParseGetQueryString("name")
    Return resp.SendFileAsync(Path.Combine(rootPath, fileName))
End Function, "GET")

MyAPI.StartServer(8090)
Console.WriteLine("File server started: http://127.0.0.1:8090")
```

:::

---

## 2. Custom Middleware — Dynamic Route Handler

This example demonstrates how to use custom middleware's extension functionality to implement **dynamic routing**, completing **path matching**, **method dispatch**, and **request termination** within a single logic block, allowing flexible middleware customization.

::: code-group

```csharp [C#]
using PicoServer;
using System.Text.RegularExpressions;

var MyAPI = new WebAPIServer();

// 【Tip】Pre-authentication/logging middleware should be registered here

// Minimal dynamic routing: recommended as the last handler
MyAPI.AddMiddleware(async (req, resp) => {
    var match = Regex.Match(req.Url.AbsolutePath, @"^/product/(?<id>\d+)$");

    if (match.Success) {
        string id = match.Groups["id"].Value;

        switch (req.HttpMethod) {
            case "GET":
                await resp.WriteAsync($"{{\"action\":\"Query product\", \"id\":{id}}}");
                break;
            case "POST":
                await resp.WriteAsync($"{{\"action\":\"Update product\", \"id\":{id}, \"result\":\"Success\"}}");
                break;
            default:
                resp.StatusCode = 405;
                await resp.WriteAsync("{\"msg\":\"Unsupported operation\"}");
                break;
        }

        return false; // ⭐ Match successful, return false to terminate request
    }

    return true; // No match, proceed to next logic or 404
});

MyAPI.StartServer(8090);
```

```vb [VB.NET]
Imports PicoServer
Imports System.Text.RegularExpressions

Dim MyAPI = New WebAPIServer()

' Minimal dynamic routing: recommended as the last handler
MyAPI.AddMiddleware(Async Function(req, resp)
    Dim match = Regex.Match(req.Url.AbsolutePath, "^/product/(?<id>\d+)$")

    If match.Success Then
        Dim id = match.Groups("id").Value

        Select Case req.HttpMethod
            Case "GET"
                Await resp.WriteAsync($"{{\"action\":\"Query product\", \"id\":{id}}}")
            Case "POST"
                Await resp.WriteAsync($"{{\"action\":\"Update product\", \"id\":{id}, \"result\":\"Success\"}}")
            Case Else
                resp.StatusCode = 405
                Await resp.WriteAsync("{\"msg\":\"Unsupported operation\"}")
        End Select

        Return False ' ⭐ Match successful, return False to terminate request
    End If

    Return True ' No match, proceed to next logic
End Function)

MyAPI.StartServer(8090)
```

:::
