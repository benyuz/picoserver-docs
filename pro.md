---
prev:
  text: 集成案例
  link: /examples
next:
  text: 更新日志
  link: /changelog
---

# 🏷️ 版本对比
**免费版** vs **Pro版**。PicoServer 采用双版本发行策略。**Pro 版本 = 免费版 + 企业级特性和更多优化**，Pro 版本 API 完全兼容免费版，可无缝升级。


## 📌 版本标识速览

| 维度 | PicoServer（免费版） | PicoServer.Pro（专业版） |
| :--- | :--- | :--- |
| **版本号格式** | 数字版本号（如 `v1.2.3`） | 日期版本号（如 `v2026.4.25`） |
| **许可证** | 免费可商用 | 商业授权 |
| **发行渠道** | NuGet 公开包 | 授权后分发 |
| **技术支持** | GitHub Issues，社区互助 | 优先响应 + 定制支持 |
| **包含免费版全部功能** | ✅ | ✅ |


## 🔍 功能特性对比

### 核心能力（两版一致）

| 特性 | 免费版 | Pro版 |
| :--- | :---: | :---: |
| 一行代码启动 Web 服务器 | ✅ | ✅ |
| 精准路由 / 星号通配 / RESTful 路由 | ✅ | ✅ |
| WebSocket 实时通信 | ✅ | ✅ |
| SSE 服务端事件推送 | ✅ | ✅ |
| 静态文件托管（目录浏览 / Range / gzip） | ✅ | ✅ |
| 大文件异步上传下载（流式非阻塞） | ✅ | ✅ |
| 中间件管道（鉴权 / CORS / 自定义） | ✅ | ✅ |
| 特性路由 | ✅ | ✅ |
| 简单 Token 鉴权 | ✅ | ✅ |
| 基础 JWT 鉴权（HMAC-SHA） | ✅ | ✅ |
| Native AOT 编译（核心库） | ✅ | ✅ |
| .NET Standard 2.0 跨平台兼容 | ✅ | ✅ |

> 免费版特性路由需要安装扩展包 [PicoServer.Extensions](https://www.nuget.org/packages/PicoServer.Extensions)
>
> Pro 版内置特性路由，且完美支持 AOT

### 增强能力（仅 Pro 版）

| 特性 | 免费版 | Pro版 | 说明 |
| :--- | :---: | :---: | :--- |
| **国密 SM3 哈希** | ❌ | ✅ | `PicoServer.Crypto.SM3` 命名空间 |
| **JWT HMAC-SM3 国密签名** | ❌ | ✅ | `AddJwtTokenVerify(secret, HashType.SM3)` |
| **SM3 密码哈希（带迭代拉伸）** | ❌ | ✅ | `SM3.HashPassword(password, salt, iterations)` |
| **限定IP访问** | ❌ | ✅ | `MyAPI.StartServer("127.0.0.1", 8891)` 端口可选 |
| **请求上下文属性字典** | ❌ | ✅ | `request.Items()` 中间件传值 |


## ⚖️ 选择建议
日常开发内部工具、轻量化WebAPI且无国密相关需求时选用免费版即可；若项目为商用需要出具书面授权与开票、存在SM3国密哈希签名合规需求，特性路由 + AOT、IP本机访问限制等企业级能力，则推荐使用Pro版本。


## 📥 获取与联系

* **免费版**：直接在 [NuGet](https://www.nuget.org/packages/PicoServer) 搜索 `PicoServer` 安装
* **Pro版授权**：在线购买，联系 QQ 1035675066 邮箱 picoserver@qq.com 获取商业合作和支持。

> 关于「代码即文档」：本页所有功能点均在 [快速入门](/guide)、[高级能力](/advanced) 中配有可直接运行的 C# / VB.NET 示例，无单独 API 参考文档。
