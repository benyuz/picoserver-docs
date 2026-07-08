---
title: Extensions - PicoServer
description: PicoServer.Extensions usage, including attribute routing and API documentation generation
prev:
  text: Advanced Customization
  link: /en/advanced
next:
  text: Benchmark
  link: /en/benchmark
---

# 📦 Extensions

## PicoServer.Extensions

Attribute routing is provided by [PicoServer.Extensions](https://www.nuget.org/packages/PicoServer.Extensions) package. Install first before use.

### Installation

```bash
dotnet add package PicoServer.Extensions
```

### Attribute Routing

Define routes with attributes for cleaner and more centralized code.

::: code-group

```csharp [C#]
using PicoServer.Extensions;

[ApiController]
public class UserController
{
    [ApiRoute("/api/user", "GET")]
    public async Task GetUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"id\":1,\"name\":\"Zhang\"}", WebAPIServer.ContentType.ApplicationJson);
    }

    [ApiRoute("/api/user", "POST")]
    public async Task SaveUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"code\":1,\"msg\":\"saved\"}", WebAPIServer.ContentType.ApplicationJson);
    }
}

// Auto scan and register all attribute routes
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
        Await res.WriteAsync("{""id"":1,""name"":""Zhang""}", WebAPIServer.ContentType.ApplicationJson)
    End Function

    <ApiRoute("/api/user", "POST")>
    Public Async Function SaveUser(req As HttpListenerRequest, res As HttpListenerResponse) As Task
        Await res.WriteAsync("{""code"":1,""msg"":""saved""}", WebAPIServer.ContentType.ApplicationJson)
    End Function
End Class

' Auto scan and register all attribute routes
Private Shared ReadOnly MyAPI As New WebAPIServer()
MyAPI.AutoRegisterRoutes()
MyAPI.StartServer()
```

:::

---

## API Documentation Generation

PicoServer supports automatic API documentation generation. Simply write `///` comments in your code, and beautiful online documentation pages will be generated.

### Quick Start

```csharp
var app = new WebAPIServer();

app.MapGet("/api/user", ListUsers);
app.MapPost("/api/user", CreateUser);

app.EnableApiDocs();

app.StartServer();
```

After starting, visit `http://localhost:8090/docs` to view the documentation.

### Usage Examples

```csharp
app.EnableApiDocs();

app.EnableApiDocs(route: "/api-docs");

app.EnableApiDocs(saveToPath: "./docs/api.html");

app.EnableApiDocs(route: "/api-docs", saveToPath: "./docs/api.html");
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `route` | `string` | `"/docs"` | Documentation page route |
| `saveToPath` | `string` | `null` | Static HTML save path. Omit to skip saving. |

### Comment Syntax

**Basic Comment**

```csharp
/// <summary>
/// Get user list
/// </summary>
/// <returns>Returns user list</returns>
```

**Request Parameters**

```csharp
/// <request name="page" type="int" required="false" from="query">Page number, default 1</request>
/// <request name="name" type="string" required="true" from="body">User name</request>
```

| Attribute | Description | Options |
|-----------|-------------|---------|
| `name` | Parameter name | Required |
| `type` | Parameter type | `string`, `int`, `bool`, `array`, `object` |
| `required` | Whether required | `true` / `false`, default `false` |
| `from` | Parameter source | `query` / `body` / `path`, default `query` |

**Response Example**

```csharp
/// <response>
/// { "id": 1, "name": "Zhang" }
/// </response>
```

### Complete Example

```csharp
/// <summary>
/// Create user
/// </summary>
/// <returns>Returns created user info</returns>
/// <request name="name" type="string" required="true" from="body">User name</request>
/// <request name="email" type="string" required="true" from="body">Email</request>
/// <response>
/// {
///   "id": 1,
///   "name": "Zhang",
///   "email": "zhang@example.com"
/// }
/// </response>
[ApiRoute("/api/user", "POST")]
public async Task CreateUser(HttpListenerRequest req, HttpListenerResponse resp)
{
    // ...
}
```

### Page Features

The documentation page supports online testing. Click "Try it" to send requests and view responses. Parameters entered in the table are automatically appended to the request. Routes can be filtered by controller group at the top, or searched by path/description. BaseURL is editable at the top for easy environment switching. JSON responses are automatically formatted and highlighted. Additionally, the documentation can be exported as a static HTML file via the `saveToPath` parameter.

### Notes

Before enabling documentation, ensure XML documentation generation is enabled in your project (`GenerateDocumentationFile`), otherwise comments cannot be read. `EnableApiDocs` must be called after all routes are registered. Routes registered with Lambda expressions cannot retrieve comments, so use explicit methods instead. The free version supports wildcard (`*`) routes.