---
prev:
  text: 集成案例
  link: /examples
next:
  text: 更新日志
  link: /changelog
---

# 🏷️ 版本对比：免费版 vs Pro版

PicoServer 采用双版本发行策略，**Pro 版本 ≡ 免费版 + 增强特性**，二者同代码线维护，API 完全兼容。

---

## 📌 版本标识速览

| 维度 | PicoServer（免费版） | PicoServer.Pro（专业版） |
| :--- | :--- | :--- |
| **版本号格式** | 数字版本号（如 `v1.2.3`） | 日期版本号（如 `v2026.4.25`） |
| **许可证** | **MIT**，免费可商用 | 商业授权（按项目/开发者计费） |
| **发行渠道** | NuGet 公开包 | 授权后分发 |
| **技术支持** | GitHub Issues，社区互助 | 优先响应 + 定制支持 |
| **包含免费版全部功能** | ✅ | ✅ |

---

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
| 简单 Token 鉴权 | ✅ | ✅ |
| 基础 JWT 鉴权（HMAC-SHA） | ✅ | ✅ |
| Native AOT 编译（核心库） | ✅ | ✅ |
| .NET Standard 2.0 跨平台兼容 | ✅ | ✅ |

### 增强能力（仅 Pro 版）

| 特性 | 免费版 | Pro版 | 说明 |
| :--- | :---: | :---: | :--- |
| **国密 SM3 哈希** | ❌ | ✅ | `PicoServer.Crypto.SM3` 命名空间 |
| **JWT HMAC-SM3 国密签名** | ❌ | ✅ | `AddJwtTokenVerify(secret, HashType.SM3)` |
| **SM3 密码哈希（带迭代拉伸）** | ❌ | ✅ | `SM3.HashPassword(password, salt, iterations)` |
| **Source Generator 特性路由** | ⚠️（反射） | ✅（编译期） | Pro 版 100% 完美适配 Native AOT |
| **限定本机访问** | ❌ | ✅ | `MyAPI.StartServer("127.0.0.1")` |
| **指定端口启动** | ❌ | ✅ | `MyAPI.StartServer("127.0.0.1", 8891)` |
| **请求上下文属性字典** | ❌ | ✅ | `request.Items()` 中间件传值 |

---

## 💡 Native AOT 适配对比表

| 项目 | 免费版 | Pro版 |
| :--- | :---: | :---: |
| 核心库 `PicoServer` | ✅ 完美支持 | ✅ 完美支持 |
| 扩展包 `PicoServer.Extensions`（特性路由） | ⚠️ 运行时反射，破坏 AOT | —（Pro 无需此包） |
| Pro 版特性路由（Source Generator） | — | ✅ 编译期生成，100% AOT |

> 💡 **免费版建议**：如果你的项目不使用特性路由（仅用 `AddRoute` 手动注册），免费版核心库即可完美 AOT 编译。如需特性路由 + AOT，请选择 Pro 版。

---

## ⚖️ 选择建议

| 你的场景 | 推荐版本 |
| :--- | :--- |
| 个人项目 / 学习研究 / 商业项目 | 免费版 ✅ |
| 内部工具 / 轻量 WebAPI / 无需国密 | 免费版 ✅ |
| 商业项目 + 国密合规要求（SM3 签名/哈希） | Pro版 ✅ |
| 商业项目 + Native AOT + 特性路由 | Pro版 ✅ |
| 需要限定本机访问（防止外部连接） | Pro版 ✅ |
| 需要优先技术支持 / 定制开发 | Pro版 ✅ |

---

## 📥 获取与联系

* **免费版**：直接在 [NuGet](https://www.nuget.org/packages/PicoServer) 搜索 `PicoServer` 安装
* **Pro版授权**：通过 [GitHub Issues](https://github.com/benyuz/picoserver-cn) 或项目联系方式获取商业授权报价

> 关于「代码即文档」：本页所有功能点均在 [快速入门](/guide)、[高级特性](/advanced)、[鉴权](/auth) 中配有可直接运行的 C# / VB.NET 示例，无单独 API 参考文档。
