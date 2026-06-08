---
prev:
  text: 集成案例
  link: /examples
next:
  text: 更新日志
  link: /changelog
---

# 🏷️ 版本说明

PicoServer 采用双版本发行策略。**Pro 版 = 免费版 + 企业级特性**，API 完全兼容，可无缝升级。

***

## 📌 版本标识

| 维度        | 免费版               | Pro 版                 |
| :-------- | :---------------- | :-------------------- |
| **版本号格式** | 数字版本号（如 `v1.2.3`） | 日期版本号（如 `v2026.4.25`） |
| **许可证**   | 免费可商用             | 商业授权                  |
| **发行渠道**  | NuGet 公开包         | 授权后分发                 |
| **技术支持**  | GitHub Issues     | 优先响应 + 定制支持           |

***

## 📊 运行时与平台支持

| 运行时                         | 操作系统                      | 支持情况 |
| --------------------------- | ------------------------- | ---- |
| .NET Framework 4.6.1+       | Windows 7+ / Server 2008+ | ✅    |
| .NET Core 2.0+              | Windows / Linux / macOS   | ✅    |
| .NET 5 / 6 / 7 / 8 / 9 / 10 | Windows / Linux / macOS   | ✅    |

***

## 🔍 功能对比

### 核心能力（两版一致）

| 特性                    | 免费版 | Pro 版 |
| :-------------------- | :-: | :---: |
| 一行代码启动 Web 服务器        |  ✅  |   ✅   |
| 精准路由 / 通配路由 / RESTful |  ✅  |   ✅   |
| WebSocket / SSE       |  ✅  |   ✅   |
| 静态文件托管                |  ✅  |   ✅   |
| 大文件异步上传下载             |  ✅  |   ✅   |
| 中间件管道（CORS / 鉴权）      |  ✅  |   ✅   |
| Token / JWT 鉴权        |  ✅  |   ✅   |
| Native AOT 支持         |  ✅  |   ✅   |
| 特性路由                  |  ✅  |   ✅   |

> 免费版通过安装扩展包 [PicoServer.Extensions](https://www.nuget.org/packages/PicoServer.Extensions) 使用特性路由。Pro 版内置特性路由，且支持 AOT 编译。

### Pro 版功能

| 特性              | 说明                                             |
| :-------------- | :--------------------------------------------- |
| 国密 SM3 哈希       | `PicoServer.Crypto.SM3`                        |
| JWT HMAC-SM3 签名 | `AddJwtTokenVerify(secret, HashType.SM3)`      |
| SM3 密码哈希（拉伸）    | `SM3.HashPassword(password, salt, iterations)` |
| 公开 JWT 验证方法     | `JwtHelper.VerifyToken(token)` 按需定制认证逻辑 |
| 限定 IP 访问        | `MyAPI.StartServer("127.0.0.1", 8891)`         |
| 请求上下文 Items     | `request.Items()` 中间件传值                        |
| 更多企业级特性 | - |


***

## ⚖️ 选择建议

| 场景                 | 推荐        |
| :----------------- | :-------- |
| 内部工具、个人项目、学习试用     | **免费版**   |
| 商用需书面授权、国密合规、企业级特性 | **Pro 版** |

***

## 📥 获取与联系

- **免费版**：[NuGet](https://www.nuget.org/packages/PicoServer) 搜索 `PicoServer`
- **Pro 版授权**：QQ `1035675066` / 邮箱 `picoserver@qq.com`

> 💡 文档 [快速入门](/guide)、[基础能力](/basic)中配有可运行的代码示例。

