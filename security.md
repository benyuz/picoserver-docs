---
title: 安全与鉴权 - PicoServer
description: PicoServer 白名单、Token、JWT、黑名单、加密等安全能力
prev:
  text: 实时通信
  link: /realtime
next:
  text: 高级定制
  link: /advanced
---

# 🔐 安全与鉴权

> 一旦添加鉴权，默认所有路由都需要鉴权。不需要鉴权的路由需要添加到路由白名单。
>
> 白名单只针对精准路由（路径），不支持星号路由。

## 1. 路由白名单

```csharp
MyAPI.RouteWhiteList; //储存路由白名单的集合
MyAPI.RouteWhiteList.Add("/api/login"); //添加接口到白名单，无需验证
```

## 2. 简单 Token 鉴权

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
    await response.WriteAsync($@"{{""code"":1, ""msg"":""登录成功"",""token"":""{_testToken}""}}");
}

private async Task GetUserInfo(HttpListenerRequest request, HttpListenerResponse response)
{
    string token = request.GetToken();
    await response.WriteAsync($@"{{""code"":1, ""msg"":""获取信息成功"",""token"":{token}}}");
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
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""登录成功\"",\""token\"":\""{_testToken}\""}}")
End Function

Private Async Function GetUserInfo(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String = request.GetToken()
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""获取信息成功\"",\""token\"":{token}}}")
End Function
```

:::

**相关方法**

```csharp
MyAPI.AddSimpleTokenVerify(testToken); //添加简单 token 验证中间件
request.GetToken(); //获取请求头中的 token 值
```

---

## 3. JWT 鉴权

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
    await response.WriteAsync($@"{{""code"":1, ""msg"":""登录成功"",""token"":""{_testToken}""}}");
}

private async Task GetUserInfo(HttpListenerRequest request, HttpListenerResponse response)
{
    string token = request.GetToken();
    string payload = MyAPI.Jwt.DecodePayload(token);
    await response.WriteAsync($@"{{""code"":1, ""msg"":""获取信息成功"",""userInfo"":{payload}}}");
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
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""登录成功\"",\""token\"":\""{_testToken}\""}}")
End Function

Private Async Function GetUserInfo(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Dim token As String = request.GetToken()
    Dim payload As String = MyAPI.Jwt.DecodePayload(token)
    Await response.WriteAsync($"{{\""code\"":1, \""msg\"":\""获取信息成功\"",\""userInfo\"":{payload}}}")
End Function
```

:::

**相关方法**

::: code-group

```csharp [C#]
MyAPI.AddJwtTokenVerify("pico_secret_779"); //添加 JWT 鉴权中间件，HS256 加密，不启用自动清理
MyAPI.AddJwtTokenVerify("pico_secret_779", 5); //每5分钟自动清理过期token

request.GetToken(); //获取请求头中的 token 值
MyAPI.Jwt.DecodePayload(token); //解码 JWT 负载
MyAPI.Jwt.GenerateToken(payload); //创建 JWT token
MyAPI.Jwt.VerifyToken(token); //完整验证 JWT token（验签 + 验 exp）

MyAPI.GetTimeStamp10(3600); // 获取10位时间戳，追加3600秒（1小时）
MyAPI.GetTimeStamp10();     // 获取当前10位时间戳
MyAPI.GetTimeStamp13();     // 获取13位时间戳（毫秒）
MyAPI.GetTimeStamp13(500);  // 获取13位时间戳，追加500毫秒
```

```vb [VB.NET]
MyAPI.AddJwtTokenVerify("pico_secret_779") '添加 JWT 鉴权中间件，HS256 加密，不启用自动清理
MyAPI.AddJwtTokenVerify("pico_secret_779", 5) '每5分钟自动清理过期token

request.GetToken() '获取请求头中的 token 值
MyAPI.Jwt.DecodePayload(token) '解码 JWT 负载
MyAPI.Jwt.GenerateToken(payload) '创建 JWT token
MyAPI.Jwt.VerifyToken(token) '完整验证 JWT token（验签 + 验 exp）

MyAPI.GetTimeStamp10(3600) '获取10位时间戳，追加3600秒（1小时）
MyAPI.GetTimeStamp10() '获取当前10位时间戳
MyAPI.GetTimeStamp13() '获取13位时间戳（毫秒）
MyAPI.GetTimeStamp13(500) '获取13位时间戳，追加500毫秒
```

:::

---

## 4. JWT Token 黑名单

`AddJwtTokenVerify` 会自动启用黑名单检查，无需额外配置。

**应用场景**：用户主动退出登录、修改密码、账号被封禁等场景下，需要立即使已颁发的 Token 失效，防止被滥用。

### 将 Token 加入黑名单（注销）

::: code-group

```csharp [C#]
MyAPI.MapPost("/api/logout", async (req, resp) =>
{
    var token = req.GetToken();
    if (string.IsNullOrEmpty(token))
    {
        resp.StatusCode = 401;
        await resp.WriteAsync("未提供Token");
        return;
    }

    var payload = MyAPI.Jwt.DecodePayload(token);
    var exp = ExtractExp(payload);
    if (exp.HasValue)
    {
        MyAPI.Jwt.Blacklist.Add(token, exp.Value);
        await resp.WriteAsync("注销成功");
    }
});
```

```vb [VB.NET]
MyAPI.MapPost("/api/logout", Async Function(req, resp)
    Dim token = req.GetToken()
    If String.IsNullOrEmpty(token) Then
        resp.StatusCode = 401
        Await resp.WriteAsync("未提供Token")
        Return
    End If

    Dim payload = MyAPI.Jwt.DecodePayload(token)
    Dim exp = ExtractExp(payload)
    If exp.HasValue Then
        MyAPI.Jwt.Blacklist.Add(token, exp.Value)
        Await resp.WriteAsync("注销成功")
    End If
End Function)
```

:::

### 自动清理

黑名单支持自动清理已过期的条目，需在 `AddJwtTokenVerify` 时传入清理间隔时间启用（单位：分钟）。默认为 `0`，表示不启动自动清理。

::: code-group

```csharp [C#]
MyAPI.AddJwtTokenVerify("pico_secret_779");      //不启用自动清理（默认）
MyAPI.AddJwtTokenVerify("pico_secret_779", 5);   //每5分钟自动清理过期token
MyAPI.AddJwtTokenVerify("pico_secret_779", 30);  //每30分钟自动清理过期token
```

```vb [VB.NET]
MyAPI.AddJwtTokenVerify("pico_secret_779")      '不启用自动清理（默认）
MyAPI.AddJwtTokenVerify("pico_secret_779", 5)   '每5分钟自动清理过期token
MyAPI.AddJwtTokenVerify("pico_secret_779", 30)  '每30分钟自动清理过期token
```

:::

### 手动管理

::: code-group

```csharp [C#]
bool isBlacklisted = MyAPI.Jwt.Blacklist.IsBlacklisted(token); //检查是否在黑名单
MyAPI.Jwt.Blacklist.Remove(token);                            //手动移除
MyAPI.Jwt.Blacklist.CleanExpired();                           //手动清理过期条目
```

```vb [VB.NET]
Dim isBlacklisted = MyAPI.Jwt.Blacklist.IsBlacklisted(token) '检查是否在黑名单
MyAPI.Jwt.Blacklist.Remove(token)                            '手动移除
MyAPI.Jwt.Blacklist.CleanExpired()                           '手动清理过期条目
```

:::

**黑名单相关方法**

```csharp
MyAPI.Jwt.Blacklist.Add(token, exp); //将 Token 加入黑名单
MyAPI.Jwt.Blacklist.IsBlacklisted(token); //检查是否在黑名单
MyAPI.Jwt.Blacklist.Remove(token); //从黑名单移除
MyAPI.Jwt.Blacklist.CleanExpired(); //清理过期条目
MyAPI.Jwt.Blacklist.StartAutoCleanup(); //启动自动清理（默认30分钟）
MyAPI.Jwt.Blacklist.StopAutoCleanup(); //停止自动清理
```

---

## 5. 加密工具

> PicoServer 内置加密工具集，支持 HMAC256 签名和 Base64Url 编解码。

### HMAC256 签名

::: code-group

```csharp [C#]
string signature = MyAPI.ComputeHmac256(data, key);
```

```vb [VB.NET]
Dim signature As String = MyAPI.ComputeHmac256(data, key)
```

:::

### Base64Url 编解码

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

