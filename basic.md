---
title: 基础能力 - PicoServer
description: PicoServer 基础能力详解，包括路由、参数、响应、静态文件、CORS、Cookie
prev:
  text: 快速入门
  link: /guide
next:
  text: 数据与文件
  link: /data-file
---

# ⚡ 基础能力

> 涵盖路由定义、参数解析、响应处理、静态文件托管、CORS跨域和Cookie管理等核心HTTP服务能力。

## 1. 路由控制与请求参数解析

PicoServer 支持四种路由解析风格：**精准路由、星号通配路由、RESTful 风格路由、特性路由**。

::: code-group

```csharp [C#]
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    // 1. 精准路由（优先级最高）
    MyAPI.AddRoute("/api/user/query", QueryUser, "GET");
    MyAPI.AddRoute("/api/user/save", SaveUser, "POST");
    MyAPI.AddRoute("/api/user/json", SaveUserJson, "POST");

    // 2. 星号通配符路由（每段 URL 仅支持一个 *，支持多段通配，内置防目录遍历攻击）
    MyAPI.AddRoute("/api/*/posts", HandleWildcardPost, "POST");
    MyAPI.AddRoute("/api/*/user/*/detail", HandleMultiWildcard, "GET");

    MyAPI.StartServer();
    Console.WriteLine("服务已启动 http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

// 📥 处理 GET 查询参数：/api/user/query?name=xyz&age=18
private static async Task QueryUser(HttpListenerRequest request, HttpListenerResponse response)
{
    string name = request.GetQuery("name");
    int age = request.GetQuery<int>("age");
    bool isVip = request.GetQuery<bool>("isVip");

    await response.WriteAsync($"{{\"code\": 1, \"msg\": \"参数解析成功\", \"data\": {{ \"name\": \"{name}\", \"age\": {age} }} }}");
}

// 📥 处理 POST Form 表单：Content-Type: application/x-www-form-urlencoded
private static async Task SaveUser(HttpListenerRequest request, HttpListenerResponse response)
{
    var formData = request.ParseForm();
    string userName = formData["userName"];

    await response.WriteAsync($"{{\"code\":1, \"msg\":\"表单保存成功\",\"userName\":\"{userName}\"}}");
}

// 📥 处理 POST JSON 请求：Content-Type: application/json
private static async Task SaveUserJson(HttpListenerRequest request, HttpListenerResponse response)
{
    string bodyJson = await request.ReadBodyAsStringAsync();
    await response.WriteAsync($"{{\"code\":1, \"msg\":\"JSON保存成功\",\"data\":{bodyJson}}}");
}

// 处理单层星号通配符 POST 请求
private static async Task HandleWildcardPost(HttpListenerRequest request, HttpListenerResponse response)
{
    string requestUrl = request.Url.AbsolutePath;
    string bodyJson = await request.ReadBodyAsStringAsync();
    await response.WriteAsync($@"{{""code"":1,""msg"":""通配符匹配成功"",""requestUrl"":""{requestUrl}"",""data"":{bodyJson}}}");
}

// 处理多层星号通配符 GET 请求
private static async Task HandleMultiWildcard(HttpListenerRequest request, HttpListenerResponse response)
{
    string requestUrl = request.Url.AbsolutePath;
    await response.WriteAsync($@"{{""code"":1,""msg"":""多层通配匹配成功"",""requestUrl"":""{requestUrl}""}}");
}
```

```vb
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    ' 1. 精准路由（优先级最高）
    MyAPI.AddRoute("/api/user/query", AddressOf QueryUser, "GET")
    MyAPI.AddRoute("/api/user/save", AddressOf SaveUser, "POST")
    MyAPI.AddRoute("/api/user/json", AddressOf SaveUserJson, "POST")

    ' 2. 星号通配符路由（每段 URL 仅支持一个 *，支持多段通配，内置防目录遍历攻击）
    MyAPI.AddRoute("/api/*/posts", AddressOf HandleWildcardPost, "POST")
    MyAPI.AddRoute("/api/*/user/*/detail", AddressOf HandleMultiWildcard, "GET")

    MyAPI.StartServer()
    Console.WriteLine("服务已启动 http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

' 📥 处理 GET 查询参数：/api/user/query?name=xyz&age=18
Private Async Function QueryUser(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim name As String = request.GetQuery("name")
    Dim age As Integer = request.GetQuery(Of Integer)("age")
    Dim isVip As Boolean = request.GetQuery(Of Boolean)("isVip")

    Await response.WriteAsync($"{{""code"": 1, ""msg"": ""参数解析成功"", ""data"": {{ ""name"": ""{name}"", ""age"": {age} }} }}")
End Function

' 📥 处理 POST Form 表单：Content-Type: application/x-www-form-urlencoded
Private Async Function SaveUser(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim formData = request.ParseForm()
    Dim userName As String = formData("userName")

    Await response.WriteAsync($"{{""code"":1, ""msg"":""表单保存成功"",""userName"":""{userName}""}}")
End Function

' 📥 处理 POST JSON 请求：Content-Type: application/json
Private Async Function SaveUserJson(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim bodyJson As String = Await request.ReadBodyAsStringAsync()
    Await response.WriteAsync($"{{""code"":1, ""msg"":""JSON保存成功"",""data"":{bodyJson}}}")
End Function

' 处理单层星号通配符 POST 请求
Private Async Function HandleWildcardPost(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim requestUrl As String = request.Url.AbsolutePath
    Dim bodyJson As String = Await request.ReadBodyAsStringAsync()
    Await response.WriteAsync($"{{""code"":1,""msg"":""通配符匹配成功"",""requestUrl"":""{requestUrl}"",""data"":{bodyJson}}}")
End Function

' 处理多层星号通配符 GET 请求
Private Async Function HandleMultiWildcard(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim requestUrl As String = request.Url.AbsolutePath
    Await response.WriteAsync($"{{""code"":1,""msg"":""多层通配匹配成功"",""requestUrl"":""{requestUrl}""}}")
End Function
```

:::

### 参数解析相关扩展方法

::: code-group

```csharp [C#]
request.GetQuery();              // 获取查询字符串，不存在返回 null
request.GetQuery<T>();           // 自动转型读取查询字符串，失败返回默认值
request.ParseForm();             // 强类型解析 Form 表单字典
request.ReadBodyAsStringAsync(); // 流式读取 Body 文本（常用于 JSON）
request.Items();                 // 请求上下文属性字典，用于中间件传值
```

```vb
request.GetQuery()              ' 获取查询字符串，不存在返回 null
request.GetQuery(Of T)()        ' 自动转型读取查询字符串，失败返回默认值
request.ParseForm()             ' 强类型解析 Form 表单字典
request.ReadBodyAsStringAsync() ' 流式读取 Body 文本（常用于 JSON）
request.Items()                 ' 请求上下文属性字典，用于中间件传值
```

:::

## 2. RESTful 风格与 MIME 类型决议

通过判断请求的 `HttpMethod`，可在单一路由内完成完整的 RESTful 资源分发。

::: code-group

```csharp [C#]
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/users", Users);
    MyAPI.StartServer();
    Console.WriteLine("服务已启动：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private static async Task Users(HttpListenerRequest request, HttpListenerResponse response)
{
    response.ContentType = GetContentType(".json"); // 自动获取标准 MIME 类型

    switch (request.HttpMethod)
    {
        case "GET":
            await response.WriteAsync(@"{""code"":1,""msg"":""获取用户成功""}");
            break;
        case "POST":
            response.StatusCode = 201;
            await response.WriteAsync(@"{""code"":1,""msg"":""创建用户成功""}");
            break;
        default:
            response.StatusCode = 405;
            await response.WriteAsync(@"{""code"":0,""msg"":""Method Not Allowed""}");
            break;
    }
}
```

```vb
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/users", AddressOf Users)
    MyAPI.StartServer()
    Console.WriteLine("服务已启动：http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function Users(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.ContentType = GetContentType(".json")

    Select Case request.HttpMethod
        Case "GET"
            Await response.WriteAsync("{""code"":1,""msg"":""获取用户成功""}")
        Case "POST"
            response.StatusCode = 201
            Await response.WriteAsync("{""code"":1,""msg"":""创建用户成功""}")
        Case Else
            response.StatusCode = 405
            Await response.WriteAsync("{""code"":0,""msg"":""Method Not Allowed""}")
    End Select
End Function
```

:::

::: tip MIME 类型内置决议
跨平台通用方法 `GetContentType(".ext")` 在 Windows/Linux/Docker 容器下的解析结果行为严格一致。默认针对文本资源追加 `charset=UTF-8`。支持多达 30+ 种常用扩展名（如视频流 `.m3u8`、`.ts`，字体 `.woff2` 等），未知类型默认回退为安全流 `application/octet-stream`。
:::

## 3. 静态文件托管与 CORS 跨域

> 静态文件（HTML/CSS/JS/图片/视频）托管配置，适配前端页面直接访问、静态资源服务等场景。

::: code-group

```csharp [C#]
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    // 添加静态文件服务（默认开启 ETag 智能缓存协商机制）
    MyAPI.AddStaticFiles("/", "wwwroot");
    // 自定义缓存周期：托管 "www" 文件夹至 "/web" 路由，浏览器缓存 30 天
    // MyAPI.AddStaticFiles("/web", "www", 2592000);

    // 开启全域 CORS 跨域支持
    MyAPI.AddCors();
    // MyAPI.AddCors("picoserver.cn"); // 亦可指定特定安全域名

    MyAPI.StartServer();
    Console.WriteLine("静态文件服务已启动：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}
```

```vb
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    ' 添加静态文件服务（默认开启 ETag 智能缓存协商机制）
    MyAPI.AddStaticFiles("/", "wwwroot")
    ' 自定义缓存周期：托管 "www" 文件夹至 "/web" 路由，浏览器缓存 30 天
    ' MyAPI.AddStaticFiles("/web", "www", 2592000)

    ' 开启全域 CORS 跨域支持
    MyAPI.AddCors()
    ' MyAPI.AddCors("picoserver.cn") ' 亦可指定特定安全域名

    MyAPI.StartServer()
    Console.WriteLine("静态文件服务已启动：http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub
```

:::

**相关方法**

```csharp
MyAPI.AddStaticFiles("/", "wwwroot");              // 默认开启自动识别缓存
MyAPI.AddStaticFiles("/web", "www", 2592000);      // 缓存30天
MyAPI.AddCors();                                   // 启用跨域
MyAPI.AddCors("picoserver.cn");                    // 指定域名跨域
```

## 4. 语义化路由与服务控制

### 语义化路由（1.7+）

::: code-group

```csharp [C#]
MyAPI.MapGet("/api/user", GetUser);         // GET 请求
MyAPI.MapPost("/api/user", CreateUser);     // POST 请求
MyAPI.MapPut("/api/user/{id}", UpdateUser); // PUT 请求
MyAPI.MapDelete("/api/user/{id}", DeleteUser); // DELETE 请求
```

```vb
MyAPI.MapGet("/api/user", AddressOf GetUser)
MyAPI.MapPost("/api/user", AddressOf CreateUser)
MyAPI.MapPut("/api/user/{id}", AddressOf UpdateUser)
MyAPI.MapDelete("/api/user/{id}", AddressOf DeleteUser)
```

:::

### 服务控制方法

```csharp
MyAPI.StartServer();                      // 开启服务，默认端口 8090
MyAPI.StartServer(8891);                  // 开启服务，指定端口
MyAPI.StartServer("127.0.0.1");           // 限定本机访问
MyAPI.StartServer("127.0.0.1", 8891);     // 限定本机+指定端口
MyAPI.StopServer();                       // 停止服务
```

## 5. Cookie 管理

内置防空指针引用的安全读写机制。

::: code-group

```csharp [C#]
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/cookie/set", SetCookie, "GET");
    MyAPI.AddRoute("/cookie/get", GetCookie, "GET");
    MyAPI.AddRoute("/cookie/delete", DeleteCookie, "GET");
    MyAPI.AddRoute("/cookie/clear", ClearCookies, "GET");

    MyAPI.StartServer(8090);
    Console.WriteLine("Cookie 测试服务已启动：http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

// 设置 Cookie（支持过期时间、路径、HttpOnly）
private static async Task SetCookie(HttpListenerRequest request, HttpListenerResponse response)
{
    response.AppendCookie("token", "pico_1234567", new CookieOptions
    {
        Expires = DateTimeOffset.Now.AddHours(1),
        Path = "/",
        HttpOnly = true
    });
    response.BuildCookie(); // 多 Cookie 需调用拼接
    await response.WriteAsync(@"{""code"":1, ""msg"":""Cookie 设置成功""}");
}

// 读取 Cookie
private static async Task GetCookie(HttpListenerRequest request, HttpListenerResponse response)
{
    string token;
    request.TryGetCookieValue("token", out token);
    await response.WriteAsync($@"{{""code"":1, ""token"":""{token}""}}");
}

// 删除指定 Cookie
private static async Task DeleteCookie(HttpListenerRequest request, HttpListenerResponse response)
{
    response.DeleteCookie("token", new CookieOptions { Path = "/" });
    await response.WriteAsync(@"{""code"":1, ""msg"":""Token Cookie 删除成功""}");
}

// 批量清理所有 Cookie
private static async Task ClearCookies(HttpListenerRequest request, HttpListenerResponse response)
{
    response.ClearCookies();
    await response.WriteAsync(@"{""code"":1, ""msg"":""所有 Cookie 已清理""}");
}
```

```vb
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/cookie/set", AddressOf SetCookie, "GET")
    MyAPI.AddRoute("/cookie/get", AddressOf GetCookie, "GET")
    MyAPI.AddRoute("/cookie/delete", AddressOf DeleteCookie, "GET")
    MyAPI.AddRoute("/cookie/clear", AddressOf ClearCookies, "GET")

    MyAPI.StartServer(8090)
    Console.WriteLine("Cookie 测试服务已启动：http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function SetCookie(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.AppendCookie("token", "pico_1234567", New CookieOptions With {
        .Expires = DateTimeOffset.Now.AddHours(1),
        .Path = "/",
        .HttpOnly = True
    })
    response.BuildCookie()
    Await response.WriteAsync("{""code"":1, ""msg"":""Cookie 设置成功""}")
End Function

Private Async Function GetCookie(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String
    request.TryGetCookieValue("token", token)
    Await response.WriteAsync($"{{\""code\"":1, \""token\"":\""{token}\""}}")
End Function

Private Async Function DeleteCookie(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.DeleteCookie("token", New CookieOptions With { .Path = "/" })
    Await response.WriteAsync("{""code"":1, ""msg"":""Token Cookie 删除成功""}")
End Function

Private Async Function ClearCookies(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.ClearCookies()
    Await response.WriteAsync("{""code"":1, ""msg"":""所有 Cookie 已清理""}")
End Function
```

:::

## 6. 跨域配置（CORS）

> 解决前后端分离跨域限制，支持极简配置。

::: code-group

```csharp [C#]
MyAPI.AddCors();                    // 启用跨域，默认允许所有来源/方法/请求头
MyAPI.AddCors("picoserver.cn");     // 指定允许的域名
```

```vb [VB.NET]
MyAPI.AddCors()                    ' 启用跨域，默认允许所有来源/方法/请求头
MyAPI.AddCors("picoserver.cn")     ' 指定允许的域名
```

:::