---
title: Basic Features - PicoServer
description: PicoServer basic capabilities including routing, parameters, response, static files, CORS, Cookie
prev:
  text: Quick Start
  link: /en/guide
next:
  text: Data & Files
  link: /en/data-file
---

# ⚡ Basic Features

> Covers core HTTP server capabilities including routing, parameter parsing, response handling, static file hosting, CORS, and Cookie management.

## 1. Route Control and Request Parameter Parsing

PicoServer supports four routing styles: **Exact Route, Wildcard Route, RESTful Style Route, and Attribute Routing**.

::: code-group

```csharp [C#]
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    // 1. Exact Route (highest priority)
    MyAPI.AddRoute("/api/user/query", QueryUser, "GET");
    MyAPI.AddRoute("/api/user/save", SaveUser, "POST");
    MyAPI.AddRoute("/api/user/json", SaveUserJson, "POST");

    // 2. Wildcard Route (* in each URL segment, supports multi-segment wildcard, built-in protection against directory traversal attacks)
    MyAPI.AddRoute("/api/*/posts", HandleWildcardPost, "POST");
    MyAPI.AddRoute("/api/*/user/*/detail", HandleMultiWildcard, "GET");

    MyAPI.StartServer();
    Console.WriteLine("Server started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

// 📥 Handle GET query parameters: /api/user/query?name=xyz&age=18
private static async Task QueryUser(HttpListenerRequest request, HttpListenerResponse response)
{
    string name = request.GetQuery("name");
    int age = request.GetQuery<int>("age");
    bool isVip = request.GetQuery<bool>("isVip");

    await response.WriteAsync($"{{\"code\": 1, \"msg\": \"Parameters parsed successfully\", \"data\": {{ \"name\": \"{name}\", \"age\": {age} }} }}");
}

// 📥 Handle POST Form data: Content-Type: application/x-www-form-urlencoded
private static async Task SaveUser(HttpListenerRequest request, HttpListenerResponse response)
{
    var formData = request.ParseForm();
    string userName = formData["userName"];

    await response.WriteAsync($"{{\"code\":1, \"msg\":\"Form saved successfully\",\"userName\":\"{userName}\"}}");
}

// 📥 Handle POST JSON request: Content-Type: application/json
private static async Task SaveUserJson(HttpListenerRequest request, HttpListenerResponse response)
{
    string bodyJson = await request.ReadBodyAsStringAsync();
    await response.WriteAsync($"{{\"code\":1, \"msg\":\"JSON saved successfully\",\"data\":{bodyJson}}}");
}

// Handle single-layer wildcard POST request
private static async Task HandleWildcardPost(HttpListenerRequest request, HttpListenerResponse response)
{
    string requestUrl = request.Url.AbsolutePath;
    string bodyJson = await request.ReadBodyAsStringAsync();
    await response.WriteAsync($@"{{""code"":1,""msg"":""Wildcard matched successfully"",""requestUrl"":""{requestUrl}"",""data"":{bodyJson}}}");
}

// Handle multi-layer wildcard GET request
private static async Task HandleMultiWildcard(HttpListenerRequest request, HttpListenerResponse response)
{
    string requestUrl = request.Url.AbsolutePath;
    await response.WriteAsync($@"{{""code"":1,""msg"":""Multi-level wildcard matched successfully"",""requestUrl"":""{requestUrl}""}}");
}
```

```vb [VB.NET]
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    ' 1. Exact Route (highest priority)
    MyAPI.AddRoute("/api/user/query", AddressOf QueryUser, "GET")
    MyAPI.AddRoute("/api/user/save", AddressOf SaveUser, "POST")
    MyAPI.AddRoute("/api/user/json", AddressOf SaveUserJson, "POST")

    ' 2. Wildcard Route (* in each URL segment, supports multi-segment wildcard, built-in protection against directory traversal attacks)
    MyAPI.AddRoute("/api/*/posts", AddressOf HandleWildcardPost, "POST")
    MyAPI.AddRoute("/api/*/user/*/detail", AddressOf HandleMultiWildcard, "GET")

    MyAPI.StartServer()
    Console.WriteLine("Server started: http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

' 📥 Handle GET query parameters: /api/user/query?name=xyz&age=18
Private Async Function QueryUser(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim name As String = request.GetQuery("name")
    Dim age As Integer = request.GetQuery(Of Integer)("age")
    Dim isVip As Boolean = request.GetQuery(Of Boolean)("isVip")

    Await response.WriteAsync($"{{""code"": 1, ""msg"": ""Parameters parsed successfully"", ""data"": {{ ""name"": ""{name}"", ""age"": {age} }} }}")
End Function

' 📥 Handle POST Form data: Content-Type: application/x-www-form-urlencoded
Private Async Function SaveUser(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim formData = request.ParseForm()
    Dim userName As String = formData("userName")

    Await response.WriteAsync($"{{""code"":1, ""msg"":""Form saved successfully"",""userName"":""{userName}""}}")
End Function

' 📥 Handle POST JSON request: Content-Type: application/json
Private Async Function SaveUserJson(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim bodyJson As String = Await request.ReadBodyAsStringAsync()
    Await response.WriteAsync($"{{""code"":1, ""msg"":""JSON saved successfully"",""data"":{bodyJson}}}")
End Function

' Handle single-layer wildcard POST request
Private Async Function HandleWildcardPost(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim requestUrl As String = request.Url.AbsolutePath
    Dim bodyJson As String = Await request.ReadBodyAsStringAsync()
    Await response.WriteAsync($"{{""code"":1,""msg"":""Wildcard matched successfully"",""requestUrl"":""{requestUrl}"",""data"":{bodyJson}}}")
End Function

' Handle multi-layer wildcard GET request
Private Async Function HandleMultiWildcard(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim requestUrl As String = request.Url.AbsolutePath
    Await response.WriteAsync($"{{""code"":1,""msg"":""Multi-level wildcard matched successfully"",""requestUrl"":""{requestUrl}""}}")
End Function
```

:::

### Parameter Parsing Extension Methods

::: code-group

```csharp [C#]
request.GetQuery();              // Get query string, returns null if not found
request.GetQuery<T>();           // Auto-cast and read query string, returns default value on failure
request.ParseForm();             // Strongly-typed Form dictionary parsing
request.ReadBodyAsStringAsync(); // Stream read body text (commonly used for JSON)
request.Items();                 // Request context property dictionary, for middleware value passing
```

```vb
request.GetQuery()              ' Get query string, returns null if not found
request.GetQuery(Of T)()        ' Auto-cast and read query string, returns default value on failure
request.ParseForm()             ' Strongly-typed Form dictionary parsing
request.ReadBodyAsStringAsync() ' Stream read body text (commonly used for JSON)
request.Items()                 ' Request context property dictionary, for middleware value passing
```

:::

---

## 2. RESTful Style and MIME Type Resolution

By checking the request's `HttpMethod`, you can complete full RESTful resource dispatch within a single route.

::: code-group

```csharp [C#]
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    MyAPI.AddRoute("/users", Users);
    MyAPI.StartServer();
    Console.WriteLine("Server started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

private static async Task Users(HttpListenerRequest request, HttpListenerResponse response)
{
    response.ContentType = GetContentType(".json"); // Auto-get standard MIME type

    switch (request.HttpMethod)
    {
        case "GET":
            await response.WriteAsync(@"{""code"":1,""msg"":""User retrieved successfully""}");
            break;
        case "POST":
            response.StatusCode = 201;
            await response.WriteAsync(@"{""code"":1,""msg"":""User created successfully""}");
            break;
        default:
            response.StatusCode = 405;
            await response.WriteAsync(@"{""code"":0,""msg"":""Method Not Allowed""}");
            break;
    }
}
```

```vb [VB.NET]
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/users", AddressOf Users)
    MyAPI.StartServer()
    Console.WriteLine("Server started: http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub

Private Async Function Users(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.ContentType = GetContentType(".json")

    Select Case request.HttpMethod
        Case "GET"
            Await response.WriteAsync("{""code"":1,""msg"":""User retrieved successfully""}")
        Case "POST"
            response.StatusCode = 201
            Await response.WriteAsync("{""code"":1,""msg"":""User created successfully""}")
        Case Else
            response.StatusCode = 405
            Await response.WriteAsync("{""code"":0,""msg"":""Method Not Allowed""}")
    End Select
End Function
```

:::

::: tip Built-in MIME Type Resolution
The cross-platform method `GetContentType(".ext")` produces strictly consistent results on Windows/Linux/Docker containers. Text resources include `charset=UTF-8` by default. Supports 30+ common extensions (like video streams `.m3u8`, `.ts`, fonts `.woff2`, etc.). Unknown types default to safe stream `application/octet-stream`.
:::

---

## 3. Static File Hosting and CORS

> Configure static file (HTML/CSS/JS/images/video) hosting for frontend page access and static resource serving scenarios.

::: code-group

```csharp [C#]
private static readonly WebAPIServer MyAPI = new WebAPIServer();

static void Main()
{
    // Add static file service (ETag smart cache negotiation enabled by default)
    MyAPI.AddStaticFiles("/", "wwwroot");
    // Custom cache duration: host "www" folder to "/web" route, browser caches for 30 days
    // MyAPI.AddStaticFiles("/web", "www", 2592000);

    // Enable global CORS support
    MyAPI.AddCors();
    // MyAPI.AddCors("picoserver.cn"); // Or specify a specific safe domain

    MyAPI.StartServer();
    Console.WriteLine("Static file service started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}
```

```vb [VB.NET]
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    ' Add static file service (ETag smart cache negotiation enabled by default)
    MyAPI.AddStaticFiles("/", "wwwroot")
    ' Custom cache duration: host "www" folder to "/web" route, browser caches for 30 days
    ' MyAPI.AddStaticFiles("/web", "www", 2592000)

    ' Enable global CORS support
    MyAPI.AddCors()
    ' MyAPI.AddCors("picoserver.cn") ' Or specify a specific safe domain

    MyAPI.StartServer()
    Console.WriteLine("Static file service started: http://127.0.0.1:8090")
    Console.ReadKey()
    MyAPI.StopServer()
End Sub
```

:::

**Related Methods**

```csharp
MyAPI.AddStaticFiles("/", "wwwroot");              // Auto-identified cache enabled by default
MyAPI.AddStaticFiles("/web", "www", 2592000);       // Cache for 30 days
MyAPI.AddCors();                                   // Enable CORS
MyAPI.AddCors("picoserver.cn");                    // Specify domain for CORS
```

---

## 4. Semantic Routes and Service Control

### Semantic Routing (1.7+)

::: code-group

```csharp [C#]
MyAPI.MapGet("/api/user", GetUser);         // GET request
MyAPI.MapPost("/api/user", CreateUser);     // POST request
MyAPI.MapPut("/api/user/{id}", UpdateUser); // PUT request
MyAPI.MapDelete("/api/user/{id}", DeleteUser); // DELETE request
```

```vb [VB.NET]
MyAPI.MapGet("/api/user", AddressOf GetUser)
MyAPI.MapPost("/api/user", AddressOf CreateUser)
MyAPI.MapPut("/api/user/{id}", AddressOf UpdateUser)
MyAPI.MapDelete("/api/user/{id}", AddressOf DeleteUser)
```

:::

### Service Control Methods

```csharp
MyAPI.StartServer();                      // Start server, default port 8090
MyAPI.StartServer(8891);                  // Start server, specify port
MyAPI.StartServer("127.0.0.1");           // Localhost only
MyAPI.StartServer("127.0.0.1", 8891);     // Localhost + specify port
MyAPI.StopServer();                       // Stop server
```

---

## 5. Cookie Management

Built-in safe read/write mechanism that prevents null reference exceptions.

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
    Console.WriteLine("Cookie test server started: http://127.0.0.1:8090");
    Console.ReadKey();
    MyAPI.StopServer();
}

// Set Cookie (supports expiration time, path, HttpOnly)
private static async Task SetCookie(HttpListenerRequest request, HttpListenerResponse response)
{
    response.AppendCookie("token", "pico_1234567", new CookieOptions
    {
        Expires = DateTimeOffset.Now.AddHours(1),
        Path = "/",
        HttpOnly = true
    });
    response.BuildCookie(); // Call for multiple cookies
    await response.WriteAsync(@"{""code"":1, ""msg"":""Cookie set successfully""}");
}

// Read Cookie
private static async Task GetCookie(HttpListenerRequest request, HttpListenerResponse response)
{
    string token;
    request.TryGetCookieValue("token", out token);
    await response.WriteAsync($@"{{""code"":1, ""token"":""{token}""}}");
}

// Delete specified Cookie
private static async Task DeleteCookie(HttpListenerRequest request, HttpListenerResponse response)
{
    response.DeleteCookie("token", new CookieOptions { Path = "/" });
    await response.WriteAsync(@"{""code"":1, ""msg"":""Token Cookie deleted successfully""}");
}

// Clear all Cookies
private static async Task ClearCookies(HttpListenerRequest request, HttpListenerResponse response)
{
    response.ClearCookies();
    await response.WriteAsync(@"{""code"":1, ""msg"":""All cookies cleared""}");
}
```

```vb [VB.NET]
Private Shared ReadOnly MyAPI As New WebAPIServer()

Sub Main()
    MyAPI.AddRoute("/cookie/set", AddressOf SetCookie, "GET")
    MyAPI.AddRoute("/cookie/get", AddressOf GetCookie, "GET")
    MyAPI.AddRoute("/cookie/delete", AddressOf DeleteCookie, "GET")
    MyAPI.AddRoute("/cookie/clear", AddressOf ClearCookies, "GET")

    MyAPI.StartServer(8090)
    Console.WriteLine("Cookie test server started: http://127.0.0.1:8090")
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
    Await response.WriteAsync("{""code"":1, ""msg"":""Cookie set successfully""}")
End Function

Private Async Function GetCookie(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String
    request.TryGetCookieValue("token", token)
    Await response.WriteAsync($"{{\""code\"":1, \""token\"":\""{token}\""}}")
End Function

Private Async Function DeleteCookie(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.DeleteCookie("token", New CookieOptions With { .Path = "/" })
    Await response.WriteAsync("{""code"":1, ""msg"":""Token Cookie deleted successfully""}")
End Function

Private Async Function ClearCookies(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    response.ClearCookies()
    Await response.WriteAsync("{""code"":1, ""msg"":""All cookies cleared""}")
End Function
```

:::

---

## 7. CORS Configuration

> Solve cross-origin restrictions for frontend-backend separation, supports minimal configuration.

::: code-group

```csharp [C#]
MyAPI.AddCors();                    // Enable CORS, allow all origins/methods/headers by default
MyAPI.AddCors("picoserver.cn");     // Specify allowed domain
```

```vb [VB.NET]
MyAPI.AddCors()                    ' Enable CORS, allow all origins/methods/headers by default
MyAPI.AddCors("picoserver.cn")     ' Specify allowed domain
```

:::
