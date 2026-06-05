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
推荐使用 PicoServer 最新版本，保障功能完整性,极简设计，没有破坏性更新，可放心升级
> 数字版本号为免费版，免费可商用。日期版本号为 Pro 版，Pro 版本包含免费版所有功能。

## V1.7.4
➕ `AddstaticFiles`静态文件中间件新增多级目录自动匹配`index.html`功能。访问以 `/` 结尾的路径时，自动返回该目录下的`index.html`

## Pro v2026.5.28
➕ 新增`AddBasicAuth`基本身份认证中间件：支持对**指定路由前缀**添加账号密码保护，浏览器自动弹出原生登录框，无需编写登录页面；支持配置免认证子路径，适配内部配置页、数据大屏等场景。
- 示例1：保护`/daping/`路径，用户名`admin`，密码`123456`
  `server.AddBasicAuth("/daping/", "admin", "123456");`
- 示例2：保护`/admin/`路径，并放行`/admin/preview`免认证
  `server.AddBasicAuth("/admin/", "admin", "123456", "/admin/preview");`

➕ `AddstaticFiles`静态文件中间件新增多级目录自动匹配`index.html`功能，路径以`/`结尾时自动返回对应目录下`index.html`；示例：访问`/`、`/admin/`、`/docs/v1/`分别匹配根目录、admin、docs/v1目录下的index.html。让静态文件托管有更好的体验。

## V1.7.3
- ➕ `Websocket` 服务端新增`WsCloseClientAsync`和`WsCloseAllClientsAsync`方法，用于服务端主动断开客户端。

## V1.7.2
- 🐛 优化时间戳函数`GetTimeStamp10`和`GetTimeStamp13`，提升不同语言间的协同。
  
## Pro v2026.5.8
- 🐛 优化时间戳函数`GetTimeStamp10`和`GetTimeStamp13`，统一为四舍五入法，解决与Java、go等跨语言协作可能存在的时间漂移现象。
  
## V1.7.1
- 🐛 修复 `WsMaxConnections` 和 `enableWebSocket` 无效的bug

## Pro v2026.4.25
- 🐛 修复 `WsMaxConnections` 和 `enableWebSocket` 无效的bug
- ➕ `Websocket` 服务端新增`WsCloseClientAsync`和`WsCloseAllClientsAsync`方法，用于服务端主动断开客户端。
- 🛠️ 增强 `Websocket` 广播性能，实测 10000 连接，服务端 398mb 内存，客户端 172mb 内存。

## V1.7
- ➕ `WebAPIServer` 主类增加 `MapGet`、`MapPost`、`MapPut`、`MapDelete` 四个语义化方法，封装于 `AddRoute` 基础方法，提升开发体验

> 📚 使用指南（C# / VB.NET）：[基础能力](/basic) · [高级能力](/advanced)

## Pro v2026.4.16
- 🔐 加密增强
- ➕ 内置 `JWT` 验证新增国密 `HMAC-SM3` 签名和验证
- ➕ 新增 `PicoServer.Crypto` 命名空间，统一提供内置算法
- 📦 新增 API

| 方法 | 说明 |
| ---- | ---- |
| HS256.ComputeHmac256 | HMAC-SHA256 签名 |
| SM3.ComputeHash | SM3 哈希计算 |
| SM3.ComputeHmacSM3 | HMAC-SM3 签名（JWT 国密支持） |
| SM3.HashPassword | 基于 SM3 的密码哈希（带迭代拉伸） |
| Base64Url.Encode | Base64Url 编码（URL 安全） |
| Base64Url.Decode | Base64Url 解码（URL 安全） |



## V1.6.5
- ➕ AddStaticFiles（静态文件托管中间件）增加内置缓存功能。采用文件指纹自动校验，确保文件变更时同步更新，同时支持设置强缓存时长，测试和生产环境无缝切换。

## Pro v2026.4.5
- ➕ StartServer 新增监听指定 IP 的重载功能。支持锁定本地回环（127.0.0.1）或内网地址，有效解决安卓 App 本地服务权限收敛及云服务器部署时的边界安全问题，防止私有数据意外暴露。

## Pro v2026.3.10
🚀 特性路由（Attribute Routing）
- ➕ 支持通过特性自动注册路由，构建高级应用更爽快
- ➕ 新增 `[ApiController]` 和 `[ApiRoute]` 特性，标记特性即可自动注册路由

📝 使用示例
```csharp
[ApiController]
public class UserController
{
    [ApiRoute("/api/user", "GET")]
    public async Task GetUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        // 处理 GET 请求
    }

    [ApiRoute("/api/user", "POST")]
    public async Task CreateUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        // 处理 POST 请求
    }
}
```

⚡ 特性路由 AOT 支持策略

| 版本 | AOT 支持 | 特性路由功能 |
| ---- | -------- | ------------ |
| 免费版（核心库） | ✅ 支持 | 不包含 |
| 免费版 + 扩展包 | ❌ 不支持 | 可用特性路由 |
| Pro 版 | ✅ 支持 | 内置特性路由 |

> 💡 免费版核心库支持 AOT，扩展包 PicoServer.Extensions（按需安装）不影响自包含但会破坏 AOT。如需 AOT + 特性路由，请使用 Pro 版。

## Pro v2026.2.23
- ➕ 增加 HTTP 请求下文同步功能，单请求中可通过 items 字典储存并共享数据。

## V1.6.4
- 🛠️ 优化，进一步增强 AddStaticFiles 静态文件托管中间件原生跨平台安全性，默认即安全，禁止访问隐藏文件 (如 `.env`, `.git`, `.config`)

## V1.6.3
- 🛠️ 优化 AddStaticFiles 中间件逻辑，没有匹配到文件则回到路由匹配，去掉多余参数。
- ➕ AddStaticFiles 中间件新增自动 url 解码，可支持中文等路径。

## V1.6.2
- ➕ Jwt 验证中间件 AddJwtTokenVerify 新增自动验证 exp 字段。内置方法 GetTimeStamp10() 可方便的设置 exp 时间戳

## V1.6.1
- 🛠️ 优化 WebSocket 服务端订阅事件参数的语义化，适配 VS 自动生成参数的场景，提升开发体验。
- 🛠️ 公开 GetContentType 方法，支持开发者直接调用该方法，根据文件扩展名获取对应的 MIME 类型字符串。如：`GetContentType(".html")`

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
- ➕ 新增 内置静态文件服务器中间件 AddStaticFiles，兼容 B/S 架构下 Web 前端与 WebAPI 接口共存（示例：`MyAPI.AddStaticFiles("/", "wwwroot", "/api/")`）
- 🛠️ 优化 response 对象的 SendFileAsync 方法：asAttachment 参数默认值改为 False，默认不强制下载文件。

## V1.5.9
- ➕ 新增 内置跨域资源共享（CORS）中间件 AddCors()，适配多场景跨域需求，Web开发更方便：
  - 无参调用：自动匹配请求的前端域名（仅允许发起请求的前端地址跨域）；
  - 传参调用：仅放行指定的前端地址（如 `AddCors("http://127.0.0.1:5500")`）。
- ➖ 移除 响应对象（response）的 EnableCors 独立方法：跨域场景需全局中间件处理（而非单个响应调用），该方法无实际使用场景。

## V1.5.7
- ➕ 新增：自动处理 HTTP OPTIONS 跨域预检请求（返回 204 标准响应）

## V1.5.6
- 🛠️ 增强内置 JWT 中间件的稳定性和安全性

## V1.5.5
- 🛠️ 优化 AOT 编译支持。
- 🛠️ 再次优化性能，星号匹配速度更快，token验证更快，内存占用更低。
- 🐛 修复 获取url查询中的中文参数值可能出现的乱码。统一为UTF8。

## V1.5.4
- ➕ NuGet 包添加 XML 注释，完善 IDE 智能提示（IntelliSense），提升开发效率。
- ➕ request 对象新增 `GetQuery`、`GetQuery(Of T)`、`ParseForm`、`ParseQuery`、`ReadBodyAsStringAsync`、`ReadBodyAsString` 六个扩展方法，简化 GET 查询参数、POST 表单参数的获取与解析。

## V1.5.3
- ➕ 为了增加辨识度和长远发展，MicroServer 正式更名为 PicoServer，仅名字和根命名空间不同，其余完全一样，只需要替换命名空间为 PicoServer 即可完成切换 **。
> ❤ 官网升级为顶级域名 picoserver.cn ❤ 感谢大家的喜爱和支持。

## V1.5.2
- ➕ response对象添加跨域支持方法 EnableCors ，默认`*`，支持设置单个域名。 由Alex Chow提供

## V1.5.1
- 🛠️ 优化星号匹配、内置简单token、JWT验证的速度，性能再次大幅提升

## V1.5.0
- ➕ 路由新增`*`通配符支持(内置防目录遍历)，支持多个，但每段url只支持一个。 实现 `/api/*/posts` 格式 POST 路由，支持匹配 `/api/xxx/posts` 单层通配符请求
- 🛠️ 优化路由内部结构和匹配逻辑，性能大幅提升。

## V1.4.6
- 🛠️ 路由值统一不区分大小写，自动转换为小写来储存和匹配。

## V1.4.5
- ➕ 新增 IsRunning 属性，作为 服务重启 判断依据，实现主程序不退出情况下的服务安全启停切换。
- 🐛 修复 关闭服务后无法再重启服务产生的异常 感谢Alex Chow反馈

## V1.4.4
- ➕ 增加对Cookie操作的扩展方法（支持添加、删除、过期等功能），由Alex Chow提供。
- 🐛 优化了C#调用库可能引发的问题
