---
prev:
  text: Integration Examples
  link: /en/examples
next:
  text: About
  link: /en/about
---

# 📌 PicoServer Changelog

PicoServer, as a Web capability glue library, is supported by lightweight HTTP server core capabilities, providing out-of-the-box and flexible extension capabilities, compatible with cross-platform and AOT compilation.

Recommended to use the latest version of PicoServer for complete functionality. Minimalist design with no breaking changes, safe to upgrade.

> Numeric version numbers are free edition (free for commercial use). Date version numbers are Pro edition, which includes all features of the free edition.

## Pro v2026.6.9
- 🔓 `JwtHelper.VerifyToken(string token)` changed to **public**
  Enterprise customers can directly call the verification method, combine or customize authentication middleware as needed, without rewriting algorithms.

## V1.7.4
➕ `AddStaticFiles` middleware adds automatic multi-level directory `index.html` matching. When accessing paths ending with `/`, automatically returns `index.html` under that directory.

## Pro v2026.5.28
➕ New `AddBasicAuth` basic authentication middleware: supports adding username/password protection to **specified route prefix**, browser automatically pops up native login dialog, no login page required; supports configuring authentication-exempt subpaths for internal configuration pages, data dashboards and other scenarios.
- Example 1: Protect `/daping/` path, username `admin`, password `123456`
  `server.AddBasicAuth("/daping/", "admin", "123456");`
- Example 2: Protect `/admin/` path and allow `/admin/preview` without authentication
  `server.AddBasicAuth("/admin/", "admin", "123456", "/admin/preview");`

➕ `AddStaticFiles` middleware adds automatic multi-level directory `index.html` matching, returns corresponding `index.html` when path ends with `/`; examples: accessing `/`, `/admin/`, `/docs/v1/` matches index.html in root, admin, docs/v1 directories respectively. Better static file hosting experience.

## V1.7.3
- ➕ `WebSocket` server adds `WsCloseClientAsync` and `WsCloseAllClientsAsync` methods for server-initiated client disconnection.

## V1.7.2
- 🐛 Optimized timestamp functions `GetTimeStamp10` and `GetTimeStamp13` for better cross-language collaboration.

## Pro v2026.5.8
- 🐛 Optimized timestamp functions `GetTimeStamp10` and `GetTimeStamp13`, unified to rounding method, solves potential time drift in cross-language collaboration with Java, Go, etc.

## V1.7.1
- 🐛 Fixed bug where `WsMaxConnections` and `enableWebSocket` were ineffective

## Pro v2026.4.25
- 🐛 Fixed bug where `WsMaxConnections` and `enableWebSocket` were ineffective
- ➕ `WebSocket` server adds `WsCloseClientAsync` and `WsCloseAllClientsAsync` methods for server-initiated client disconnection.
- 🛠️ Enhanced `WebSocket` broadcast performance, tested with 10000 connections, server memory 398MB, client memory 172MB.

## V1.7
- ➕ `WebAPIServer` main class adds four semantic methods: `MapGet`, `MapPost`, `MapPut`, `MapDelete`, wrapped on top of `AddRoute` base method for better development experience

> 📚 Guide (C# / VB.NET): [Basic Features](/en/basic) · [Advanced Features](/en/advanced)

## Pro v2026.4.16
- 🔐 Encryption Enhancement
- ➕ Built-in `JWT` validation adds national cryptographic `HMAC-SM3` signing and verification
- ➕ New `PicoServer.Crypto` namespace providing unified built-in algorithms
- 📦 New APIs

| Method | Description |
| ---- | ---- |
| HS256.ComputeHmac256 | HMAC-SHA256 signing |
| SM3.ComputeHash | SM3 hash calculation |
| SM3.ComputeHmacSM3 | HMAC-SM3 signing (JWT national crypto support) |
| SM3.HashPassword | SM3-based password hashing (with iteration stretching) |
| Base64Url.Encode | Base64Url encoding (URL safe) |
| Base64Url.Decode | Base64Url decoding (URL safe) |

## V1.6.5
- ➕ AddStaticFiles middleware adds built-in caching. Uses file fingerprint automatic verification to ensure synchronization when files change, while supporting strong cache duration settings, seamless switching between test and production environments.

## Pro v2026.4.5
- ➕ StartServer adds overload for listening on specific IP. Supports locking to localhost (127.0.0.1) or intranet address, effectively solving Android App local service permission convergence and edge security issues during cloud server deployment, preventing accidental exposure of private data.

## Pro v2026.3.10
🚀 Attribute Routing
- ➕ Support automatic route registration via attributes, faster development for advanced applications
- ➕ New `[ApiController]` and `[ApiRoute]` attributes, routes auto-registered when marked

📝 Usage Example
```csharp
[ApiController]
public class UserController
{
    [ApiRoute("/api/user", "GET")]
    public async Task GetUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        // Handle GET request
    }

    [ApiRoute("/api/user", "POST")]
    public async Task CreateUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        // Handle POST request
    }
}
```

⚡ Attribute Routing AOT Support Strategy

| Version | AOT Support | Attribute Routing |
| ---- | -------- | ------------ |
| Free Edition (Core Library) | ✅ Supported | Not included |
| Free Edition + Extensions | ❌ Not supported | Attribute routing available |
| Pro Edition | ✅ Supported | Built-in attribute routing |

> 💡 Free edition core library supports AOT, extension package PicoServer.Extensions (install on demand) doesn't affect self-contained deployment but breaks AOT. For AOT + attribute routing, use Pro edition.

## Pro v2026.2.23
- ➕ Added HTTP request context synchronization, data can be stored and shared via items dictionary within single request.

## V1.6.4
- 🛠️ Optimization, further enhanced AddStaticFiles middleware native cross-platform security, secure by default, blocks access to hidden files (e.g., `.env`, `.git`, `.config`)

## V1.6.3
- 🛠️ Optimized AddStaticFiles middleware logic, falls back to route matching when no file matched, removed redundant parameters.
- ➕ AddStaticFiles middleware adds automatic URL decoding, supports Chinese and other paths.

## V1.6.2
- ➕ Jwt validation middleware AddJwtTokenVerify adds automatic exp field validation. Built-in GetTimeStamp10() method for easy exp timestamp setting

## V1.6.1
- 🛠️ Optimized WebSocket server subscription event parameter semantics, adapts to VS auto-generated parameter scenarios, improving development experience.
- 🛠️ Exposed GetContentType method for developers to directly call and get MIME type string based on file extension. Example: `GetContentType(".html")`

## V1.6
🚀 Concept Upgrade:
- .NET App + PicoServer = Web-enabled App
- Industrial HMI + PicoServer = Web-manageable HMI
- Desktop App + PicoServer = Desktop Service with API
- Console App + PicoServer = Lightweight Independent Web Service
- Edge Device + PicoServer = Edge Node with Web Capabilities
> Your App + PicoServer = ?

- 🛠️ Several minor optimizations

## V1.5.10
- ➕ New built-in static file server middleware AddStaticFiles, compatible with B/S architecture where Web frontend and WebAPI coexist (Example: `MyAPI.AddStaticFiles("/", "wwwroot", "/api/")`)
- 🛠️ Optimized response.SendFileAsync method: asAttachment parameter default changed to False, no forced download by default.

## V1.5.9
- ➕ New built-in CORS middleware AddCors(), adapts to multi-scenario cross-domain requirements, easier Web development:
  - No parameter: automatically matches requesting frontend domain (only allows cross-domain from requesting frontend)
  - With parameter: only allows specified frontend (e.g., `AddCors("http://127.0.0.1:5500")`)
- ➖ Removed response.EnableCors standalone method: cross-domain should be handled by global middleware (not per-response), no practical use case.

## V1.5.7
- ➕ New: automatic handling of HTTP OPTIONS preflight requests (returns 204 standard response)

## V1.5.6
- 🛠️ Enhanced built-in JWT middleware stability and security

## V1.5.5
- 🛠️ Optimized AOT compilation support.
- 🛠️ Further performance optimization, faster wildcard matching, faster token validation, lower memory usage.
- 🐛 Fixed potential garbled characters when getting Chinese parameter values from URL query. Unified to UTF8.

## V1.5.4
- ➕ NuGet package adds XML comments, improves IDE IntelliSense, boosts development efficiency.
- ➕ request object adds six extension methods: `GetQuery`, `GetQuery<T>`, `ParseForm`, `ParseQuery`, `ReadBodyAsStringAsync`, `ReadBodyAsString`, simplifying GET query parameters and POST form parameters retrieval and parsing.

## V1.5.3
- ➕ For better recognition and long-term development, MicroServer is officially renamed to PicoServer. Only the name and root namespace are different, everything else is identical. Just replace the namespace with PicoServer to complete the migration **.
> ❤ Official website upgraded to top-level domain picoserver.cn ❤ Thank you for your love and support.

## V1.5.2
- ➕ response object adds EnableCors method for cross-domain support, default `*`, supports single domain setting. Provided by Alex Chow.

## V1.5.1
- 🛠️ Optimized wildcard matching, built-in simple token, JWT validation speed, significant performance improvement

## V1.5.0
- ➕ Route adds `*` wildcard support (built-in anti-directory traversal), supports multiple wildcards but only one per URL segment. Implements `/api/*/posts` POST route format, matches `/api/xxx/posts` single-level wildcard requests
- 🛠️ Optimized route internal structure and matching logic, significant performance improvement.

## V1.4.6
- 🛠️ Route values are case-insensitive, automatically converted to lowercase for storage and matching.

## V1.4.5
- ➕ New IsRunning property for service restart judgment, enabling safe service start/stop switch without exiting main program.
- 🐛 Fixed exception when restarting service after shutdown. Thanks to Alex Chow for feedback.

## V1.4.4
- ➕ Added Cookie operation extension methods (support add, delete, expire, etc.), provided by Alex Chow.
- 🐛 Optimized potential issues with C# library calls