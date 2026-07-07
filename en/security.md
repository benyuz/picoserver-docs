---
title: Security & Auth - PicoServer
description: PicoServer whitelist, Token, JWT, blacklist, encryption security features
prev:
  text: Real-time Communication
  link: /en/realtime
next:
  text: Advanced Customization
  link: /en/advanced
---

# 🔐 Security & Auth

> Once auth is added, all routes require auth by default. Routes that don't need auth must be added to whitelist.
>
> Whitelist only works for exact routes, not wildcard routes.

## 1. Route Whitelist

```csharp
MyAPI.RouteWhiteList; // Whitelist collection
MyAPI.RouteWhiteList.Add("/api/login"); // Add route to whitelist
```

## 2. Simple Token Auth

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
MyAPI.AddSimpleTokenVerify(testToken); // Add simple token middleware
request.GetToken(); // Get token from header
```

---

## 3. JWT Auth

::: code-group

```csharp [C#]
private readonly WebAPIServer MyAPI = new WebAPIServer();
private string _testToken;

static void Main()
{
    MyAPI.AddRoute("/api/login", Login, "POST");
    MyAPI.AddRoute("/api/user/info", GetUserInfo, "GET");

    MyAPI.RouteWhiteList.Add("/api/login");
    MyAPI.AddJwtTokenVerify("pico_secret_779", 5);

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
    MyAPI.AddJwtTokenVerify("pico_secret_779", 5)

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

```csharp [C#]
MyAPI.AddJwtTokenVerify("pico_secret_779"); // Add JWT middleware, HS256, no auto cleanup
MyAPI.AddJwtTokenVerify("pico_secret_779", 5); // Auto cleanup every 5 minutes

request.GetToken(); // Get token from header
MyAPI.Jwt.DecodePayload(token); // Decode JWT payload
MyAPI.Jwt.GenerateToken(payload); // Create JWT token
MyAPI.Jwt.VerifyToken(token); // Complete JWT validation (signature + exp)

MyAPI.GetTimeStamp10(3600); // Get 10-digit timestamp + 3600s
MyAPI.GetTimeStamp10();     // Current 10-digit timestamp
MyAPI.GetTimeStamp13();     // 13-digit timestamp (ms)
MyAPI.GetTimeStamp13(500);  // 13-digit + 500ms
```

```vb [VB.NET]
MyAPI.AddJwtTokenVerify("pico_secret_779") ' Add JWT middleware, HS256, no auto cleanup
MyAPI.AddJwtTokenVerify("pico_secret_779", 5) ' Auto cleanup every 5 minutes

request.GetToken() ' Get token from header
MyAPI.Jwt.DecodePayload(token) ' Decode JWT payload
MyAPI.Jwt.GenerateToken(payload) ' Create JWT token
MyAPI.Jwt.VerifyToken(token) ' Complete JWT validation

MyAPI.GetTimeStamp10(3600) ' Get 10-digit timestamp + 3600s
MyAPI.GetTimeStamp10() ' Current 10-digit timestamp
MyAPI.GetTimeStamp13() ' 13-digit timestamp (ms)
MyAPI.GetTimeStamp13(500) ' 13-digit + 500ms
```

:::

---

## 4. JWT Token Blacklist

`AddJwtTokenVerify` automatically enables blacklist checking.

**Use Cases**: User logout, password change, account ban - scenarios where issued tokens need to be immediately invalidated to prevent abuse.

### Add Token to Blacklist (Logout)

::: code-group

```csharp [C#]
MyAPI.MapPost("/api/logout", async (req, resp) =>
{
    var token = req.GetToken();
    if (string.IsNullOrEmpty(token))
    {
        resp.StatusCode = 401;
        await resp.WriteAsync("Token not provided");
        return;
    }

    var payload = MyAPI.Jwt.DecodePayload(token);
    var exp = ExtractExp(payload);
    if (exp.HasValue)
    {
        MyAPI.Jwt.Blacklist.Add(token, exp.Value);
        await resp.WriteAsync("Logout successful");
    }
});
```

```vb [VB.NET]
MyAPI.MapPost("/api/logout", Async Function(req, resp)
    Dim token = req.GetToken()
    If String.IsNullOrEmpty(token) Then
        resp.StatusCode = 401
        Await resp.WriteAsync("Token not provided")
        Return
    End If

    Dim payload = MyAPI.Jwt.DecodePayload(token)
    Dim exp = ExtractExp(payload)
    If exp.HasValue Then
        MyAPI.Jwt.Blacklist.Add(token, exp.Value)
        Await resp.WriteAsync("Logout successful")
    End If
End Function)
```

:::

### Auto Cleanup

The blacklist supports automatic cleanup of expired entries. Enable it by passing the cleanup interval (in minutes) to `AddJwtTokenVerify`. Default is `0`, meaning no auto cleanup.

::: code-group

```csharp [C#]
MyAPI.AddJwtTokenVerify("pico_secret_779");      // No auto cleanup (default)
MyAPI.AddJwtTokenVerify("pico_secret_779", 5);   // Auto cleanup every 5 minutes
MyAPI.AddJwtTokenVerify("pico_secret_779", 30);  // Auto cleanup every 30 minutes
```

```vb [VB.NET]
MyAPI.AddJwtTokenVerify("pico_secret_779")      ' No auto cleanup (default)
MyAPI.AddJwtTokenVerify("pico_secret_779", 5)   ' Auto cleanup every 5 minutes
MyAPI.AddJwtTokenVerify("pico_secret_779", 30)  ' Auto cleanup every 30 minutes
```

:::

### Manual Management

::: code-group

```csharp [C#]
bool isBlacklisted = MyAPI.Jwt.Blacklist.IsBlacklisted(token);
MyAPI.Jwt.Blacklist.Remove(token);
MyAPI.Jwt.Blacklist.CleanExpired();
```

```vb [VB.NET]
Dim isBlacklisted = MyAPI.Jwt.Blacklist.IsBlacklisted(token)
MyAPI.Jwt.Blacklist.Remove(token)
MyAPI.Jwt.Blacklist.CleanExpired()
```

:::

**Blacklist Methods**

```csharp
MyAPI.Jwt.Blacklist.Add(token, exp); // Add to blacklist
MyAPI.Jwt.Blacklist.IsBlacklisted(token); // Check if blacklisted
MyAPI.Jwt.Blacklist.Remove(token); // Remove from blacklist
MyAPI.Jwt.Blacklist.CleanExpired(); // Clean expired entries
MyAPI.Jwt.Blacklist.StartAutoCleanup(); // Start auto cleanup
MyAPI.Jwt.Blacklist.StopAutoCleanup(); // Stop auto cleanup
```

---

## 5. Encryption Tools

> Built-in encryption tools with HMAC256 signing and Base64Url encoding/decoding.

### HMAC256 Signing

::: code-group

```csharp [C#]
string signature = MyAPI.ComputeHmac256(data, key);
```

```vb [VB.NET]
Dim signature As String = MyAPI.ComputeHmac256(data, key)
```

:::

### Base64Url Encoding/Decoding

::: code-group

```csharp [C#]
string encoded = MyAPI.EnCodeBase64Url(data);
string decoded = MyAPI.DecodeBase64Url(encoded);
```

```vb [VB.NET]
Dim encoded As String = MyAPI.EnCodeBase64Url(data)
Dim decoded As String = MyAPI.DecodeBase64Url(encoded)
```

:::

