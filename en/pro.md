---
prev:
  text: Examples
  link: /en/examples
next:
  text: Changelog
  link: /en/changelog
---

# 🏷️ Free vs Pro

PicoServer uses a dual-version release strategy. **Pro = Free + Enterprise Features**, with full API compatibility for seamless upgrades.

***

## 📌 Version Identification

| Dimension        | Free Version                    | Pro Version                    |
| :--------------- | :------------------------------ | :----------------------------- |
| **Version Format** | Numeric (e.g., `v1.2.3`)       | Date-based (e.g., `v2026.4.25`) |
| **License**       | Free for commercial use        | Commercial license              |
| **Distribution**  | Public NuGet package           | Authorized distribution         |
| **Support**       | GitHub Issues                  | Priority response + custom support |

***

## 📊 Runtime & Platform Support

| Runtime                      | Operating System                | Support |
| --------------------------- | ------------------------------- | :-----: |
| .NET Framework 4.6.1+      | Windows 7+ / Server 2008+      |   ✅    |
| .NET Core 2.0+             | Windows / Linux / macOS        |   ✅    |
| .NET 5 / 6 / 7 / 8 / 9 / 10 | Windows / Linux / macOS        |   ✅    |

***

## 🔍 Feature Comparison

### Core Features (Same in Both Versions)

| Feature                         | Free | Pro |
| :------------------------------ | :--: | :-: |
| One-line Web server startup    |  ✅  |  ✅  |
| Exact / Wildcard / RESTful routes |  ✅  |  ✅  |
| WebSocket / SSE                |  ✅  |  ✅  |
| Static file hosting            |  ✅  |  ✅  |
| Async file upload/download     |  ✅  |  ✅  |
| Middleware (CORS / Auth)       |  ✅  |  ✅  |
| Token / JWT authentication     |  ✅  |  ✅  |
| Native AOT support             |  ✅  |  ✅  |
| Attribute routing              |  ✅  |  ✅  |

> Free version uses attribute routing via the extension package [PicoServer.Extensions](https://www.nuget.org/packages/PicoServer.Extensions). Pro version has built-in attribute routing with full AOT support.

### Pro Features

| Feature             | Description                                             |
| :------------------ | :------------------------------------------------------ |
| GM/SM3 hashing      | `PicoServer.Crypto.SM3`                                |
| JWT HMAC-SM3 signing | `AddJwtTokenVerify(secret, HashType.SM3)`              |
| SM3 password hashing | `SM3.HashPassword(password, salt, iterations)`          |
| Public JWT verification | `JwtHelper.VerifyToken(token)` for custom auth logic |
| IP restriction      | `MyAPI.StartServer("127.0.0.1", 8891)`                |
| Request context items | `request.Items()` for middleware value passing         |
| More enterprise features | -                                               |

***

## ⚖️ Which to Choose?

| Scenario                              | Recommendation |
| :------------------------------------ | :------------ |
| Internal tools, personal projects, learning | **Free Version** |
| Commercial use, GM compliance, enterprise features | **Pro Version** |

***

## 📥 Get Started & Contact

- **Free Version**: Search `PicoServer` on [NuGet](https://www.nuget.org/packages/PicoServer)
- **Pro License**: QQ `1035675066` / Email `picoserver@qq.com`

> 💡 Check out [Quick Start](/en/guide) and [Basic Features](/en/basic) for runnable code examples.
