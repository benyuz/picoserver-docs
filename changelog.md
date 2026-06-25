---
prev:
  text: 集成案例
  link: /examples
next:
  text: 关于我们
  link: /about
---

# 📌 PicoServer 更新日志

PicoServer 作为 Web 能力胶水库，以轻量级 HTTP 服务器核心基础能力为支撑，提供开箱即用和灵活扩展的能力，兼容跨平台与 AOT 编译。

> 推荐使用 PicoServer 最新版本，保障功能完整性，极简设计，没有破坏性更新，可放心升级。

## V1.7.5
- ➕ `JwtHelper` 新增公开方法 `VerifyToken(string token)`，完整验证 JWT token（验签 + 验 exp），方便用户自定义验证中间件。

## V1.7.4
- ➕ `AddStaticFiles` 静态文件中间件新增多级目录自动匹配 `index.html` 功能。访问以 `/` 结尾的路径时，自动返回该目录下的 `index.html`。

## V1.7.3
- ➕ `WebSocket` 服务端新增 `WsCloseClientAsync` 和 `WsCloseAllClientsAsync` 方法，用于服务端主动断开客户端。

## V1.7.2
- 🐛 优化时间戳函数 `GetTimeStamp10` 和 `GetTimeStamp13`，提升不同语言间的协同。

## V1.7.1
- 🐛 修复 `WsMaxConnections` 和 `enableWebSocket` 无效的 bug

## V1.7
- ➕ `WebAPIServer` 主类增加 `MapGet`、`MapPost`、`MapPut`、`MapDelete` 四个语义化方法，封装于 `AddRoute` 基础方法，提升开发体验

> 📚 使用指南（C# / VB.NET）：[基础能力](/basic) · [高级能力](/advanced)

## V1.6.5
- ➕ `AddStaticFiles`（静态文件托管中间件）增加内置缓存功能。采用文件指纹自动校验，确保文件变更时同步更新，同时支持设置强缓存时长，测试和生产环境无缝切换。

## V1.6.4
- 🛠️ 优化，进一步增强 `AddStaticFiles` 静态文件托管中间件原生跨平台安全性，默认即安全，禁止访问隐藏文件（如 `.env`、`.git`、`.config`）

## V1.6.3
- 🛠️ 优化 `AddStaticFiles` 中间件逻辑，没有匹配到文件则回到路由匹配，去掉多余参数。
- ➕ `AddStaticFiles` 中间件新增自动 url 解码，可支持中文等路径。

## V1.6.2
- ➕ JWT 验证中间件 `AddJwtTokenVerify` 新增自动验证 exp 字段。内置方法 `GetTimeStamp10()` 可方便地设置 exp 时间戳。

## V1.6.1
- 🛠️ 优化 WebSocket 服务端订阅事件参数的语义化，适配 VS 自动生成参数的场景，提升开发体验。
- 🛠️ 公开 `GetContentType` 方法，支持开发者直接调用该方法，根据文件扩展名获取对应的 MIME 类型字符串。如：`GetContentType(".html")`

## V1.6
🚀 概念升华：
- .NET 应用 + PicoServer = Web 化应用
- 工控上位机 + PicoServer = 可远程管理的 Web 化上位机
- 桌面应用 + PicoServer = 带 API 接口的桌面服务
- 控制台程序 + PicoServer = 轻量独立 Web 服务
- 边缘设备端 + PicoServer = 具备 Web 能力的边缘节点

> 你的程序 + PicoServer = ？

- 🛠️ 若干细节优化

## V1.5.10
- ➕ 新增内置静态文件服务器中间件 `AddStaticFiles`，兼容 B/S 架构下 Web 前端与 WebAPI 接口共存（示例：`MyAPI.AddStaticFiles("/", "wwwroot", "/api/")`）
- 🛠️ 优化 response 对象的 `SendFileAsync` 方法：`asAttachment` 参数默认值改为 False，默认不强制下载文件。

## V1.5.9
- ➕ 新增内置跨域资源共享（CORS）中间件 `AddCors()`，适配多场景跨域需求，Web 开发更方便：
  - 无参调用：自动匹配请求的前端域名（仅允许发起请求的前端地址跨域）；
  - 传参调用：仅放行指定的前端地址（如 `AddCors("http://127.0.0.1:5500")`）。
- ➖ 移除响应对象（response）的 `EnableCors` 独立方法：跨域场景需全局中间件处理（而非单个响应调用），该方法无实际使用场景。

## V1.5.7
- ➕ 新增自动处理 HTTP OPTIONS 跨域预检请求（返回 204 标准响应）

## V1.5.6
- 🛠️ 增强内置 JWT 中间件的稳定性和安全性

## V1.5.5
- 🛠️ 优化 AOT 编译支持。
- 🛠️ 再次优化性能，星号匹配速度更快，token 验证更快，内存占用更低。
- 🐛 修复获取 url 查询中的中文参数值可能出现的乱码。统一为 UTF-8。

## V1.5.4
- ➕ NuGet 包添加 XML 注释，完善 IDE 智能提示（IntelliSense），提升开发效率。
- ➕ request 对象新增 `GetQuery`、`GetQuery(Of T)`、`ParseForm`、`ParseQuery`、`ReadBodyAsStringAsync`、`ReadBodyAsString` 六个扩展方法，简化 GET 查询参数、POST 表单参数的获取与解析。

## V1.5.3
- ➕ 为了增加辨识度和长远发展，MicroServer 正式更名为 PicoServer，仅名字和根命名空间不同，其余完全一样，只需要替换命名空间为 PicoServer 即可完成切换。

> ❤ 官网升级为顶级域名 picoserver.cn ❤ 感谢大家的喜爱和支持。

## V1.5.2
- ➕ response 对象添加跨域支持方法 `EnableCors`，默认 `*`，支持设置单个域名。由 Alex Chow 提供。

## V1.5.1
- 🛠️ 优化星号匹配、内置简单 token、JWT 验证的速度，性能再次大幅提升。

## V1.5.0
- ➕ 路由新增 `*` 通配符支持（内置防目录遍历），支持多个，但每段 url 只支持一个。实现 `/api/*/posts` 格式 POST 路由，支持匹配 `/api/xxx/posts` 单层通配符请求。
- 🛠️ 优化路由内部结构和匹配逻辑，性能大幅提升。

## V1.4.6
- 🛠️ 路由值统一不区分大小写，自动转换为小写来储存和匹配。

## V1.4.5
- ➕ 新增 `IsRunning` 属性，作为服务重启判断依据，实现主程序不退出情况下的服务安全启停切换。
- 🐛 修复关闭服务后无法再重启服务产生的异常。感谢 Alex Chow 反馈。

## V1.4.4
- ➕ 增加对 Cookie 操作的扩展方法（支持添加、删除、过期等功能），由 Alex Chow 提供。
- 🐛 优化了 C# 调用库可能引发的问题。
