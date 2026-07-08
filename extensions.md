---
title: 扩展包 - PicoServer
description: PicoServer.Extensions 扩展包使用说明
prev:
  text: 高级定制
  link: /advanced
next:
  text: 性能测试
  link: /benchmark
---

# 📦 扩展包

> [PicoServer.Extensions](https://www.nuget.org/packages/PicoServer.Extensions) 扩展包提供特性路由和 API 文档生成两大核心功能。

## 安装

```bash
dotnet add package PicoServer.Extensions
```

---

## 特性路由

通过在控制器上打标签实现自动路由扫描，更加直观和集中。

### 快速开始

::: code-group

```csharp [C#]
using PicoServer.Extensions;

[ApiController]
public class UserController
{
    [ApiRoute("/api/user", "GET")]
    public async Task GetUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"id\":1,\"name\":\"张三\"}", WebAPIServer.ContentType.ApplicationJson);
    }

    [ApiRoute("/api/user", "POST")]
    public async Task SaveUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"code\":1,\"msg\":\"saved\"}", WebAPIServer.ContentType.ApplicationJson);
    }
}

private static readonly WebAPIServer MyAPI = new WebAPIServer();
MyAPI.AutoRegisterRoutes();
MyAPI.StartServer();
```

```vb [VB.NET]
Imports PicoServer.Extensions

<ApiController>
Public Class UserController
    <ApiRoute("/api/user", "GET")>
    Public Async Function GetUser(req As HttpListenerRequest, res As HttpListenerResponse) As Task
        Await res.WriteAsync("{""id"":1,""name"":""张三""}", WebAPIServer.ContentType.ApplicationJson)
    End Function

    <ApiRoute("/api/user", "POST")>
    Public Async Function SaveUser(req As HttpListenerRequest, res As HttpListenerResponse) As Task
        Await res.WriteAsync("{""code"":1,""msg"":""saved""}", WebAPIServer.ContentType.ApplicationJson)
    End Function
End Class

Private Shared ReadOnly MyAPI As New WebAPIServer()
MyAPI.AutoRegisterRoutes()
MyAPI.StartServer()
```

:::

---

## API 文档生成

支持自动生成 API 文档，只需要在代码中写好 `///` 注释，即可生成美观的在线文档页面。

### 快速开始

```csharp
var app = new WebAPIServer();

app.MapGet("/api/user", ListUsers);
app.MapPost("/api/user", CreateUser);

app.EnableApiDocs();

app.StartServer();
```

启动后访问 `http://localhost:8090/docs` 即可查看。

### 用法示例

```csharp
// 默认在线文档路由为"/docs"
app.EnableApiDocs();
// 自定义文档路由为"/api-docs"
app.EnableApiDocs(route: "/api-docs");
// 保存文档为静态 HTML 文件
app.EnableApiDocs(saveToPath: "./docs/api.html");
// 自定义文档路由为"/api-docs"，并保存为静态 HTML 文件
app.EnableApiDocs(route: "/api-docs", saveToPath: "./docs/api.html");
```

> `route` 为文档页面路由，默认 `"/docs"`；`saveToPath` 为静态 HTML 保存路径，不传则不保存。

### 注释写法

**基础注释**

```csharp
/// <summary>
/// 获取用户列表
/// </summary>
/// <returns>返回用户列表</returns>
```

**请求参数**

```csharp
/// <request name="page" type="int" required="false" from="query">页码，默认1</request>
/// <request name="name" type="string" required="true" from="body">用户名</request>
```

| 属性 | 说明 | 可选值 |
|------|------|--------|
| `name` | 参数名 | 必填 |
| `type` | 参数类型 | `string`、`int`、`bool`、`array`、`object` |
| `required` | 是否必选 | `true` / `false`，默认 `false` |
| `from` | 参数来源 | `query` / `body` / `path`，默认 `query` |

**返回示例**

```csharp
/// <response>
/// { "id": 1, "name": "张三" }
/// </response>
```

### 完整示例

::: code-group

```csharp [C#]
/// <summary>
/// 创建用户
/// </summary>
/// <returns>返回创建的用户信息</returns>
/// <request name="name" type="string" required="true" from="body">用户名</request>
/// <request name="email" type="string" required="true" from="body">邮箱</request>
/// <response>
/// {
///   "id": 1,
///   "name": "张三",
///   "email": "zhangsan@example.com"
/// }
/// </response>
[ApiRoute("/api/user", "POST")]
public async Task CreateUser(HttpListenerRequest req, HttpListenerResponse resp)
{
    // ...
}
```

```vb [VB.NET]
''' <summary>
''' 创建用户
''' </summary>
''' <returns>返回创建的用户信息</returns>
''' <request name="name" type="string" required="true" from="body">用户名</request>
''' <request name="email" type="string" required="true" from="body">邮箱</request>
''' <response>
''' {
'''   "id": 1,
'''   "name": "张三",
'''   "email": "zhangsan@example.com"
''' }
''' </response>
<ApiRoute("/api/user", "POST")>
Public Async Function CreateUser(req As HttpListenerRequest, resp As HttpListenerResponse) As Task
    ' ...
End Function
```

:::

### 页面功能

文档页面支持在线测试，点击"试一下"可直接发起请求并查看响应。参数在表格中填写后会自动拼接到请求中。页面顶部可按控制器分组筛选，也支持按路径或描述搜索。BaseURL 支持在顶部直接编辑，方便切换不同环境。返回的 JSON 响应会自动格式化并高亮显示。此外，通过 `saveToPath` 参数可将文档导出为静态 HTML 文件。

### 注意事项

启用文档功能前，需确保项目已开启 XML 文档生成（`GenerateDocumentationFile`），否则无法读取注释信息。`EnableApiDocs` 必须在所有路由注册完毕后调用。另外，使用 Lambda 表达式注册的路由无法获取注释，建议改用显式方法。免费版支持星号（`*`）通配符路由。