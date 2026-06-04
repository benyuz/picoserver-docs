# PicoServer 官方文档

[PicoServer](https://picoserver.cn) 的官方文档站点，基于 VitePress 构建，中英双语。

## 技术栈

- [VitePress](https://vitepress.dev/) — 静态站点生成器
- GitHub Pages + GitHub Actions — 自动构建部署

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npx vitepress dev

# 构建生产版本
npx vitepress build
```

## 目录结构

```
.vitepress/           # VitePress 配置
  config.js           # 站点配置（导航 / 侧边栏 / 多语言）
  theme/index.js      # 主题自定义
zh/                   # 中文文档
  index.md            # 首页
  guide.md            # 快速入门（含安装）
  basic.md            # 基础能力
  advanced.md         # 高级能力（含鉴权）
  middleware.md       # 自定义中间件
  benchmark.md        # 基准测试
  nano-guide.md       # ESP32 快速上手
  nano-benchmark.md   # Nano 性能测试
  examples.md         # 集成案例
  changelog.md        # 更新日志
  about.md            # 关于我们
  pro.md              # 版本对比
en/                   # 英文文档（待补充）
public/               # 静态资源（Logo 等）
.github/workflows/    # GitHub Actions 部署配置
```

## 部署

推送到 `main` 分支会自动触发 GitHub Actions 构建并发布到 https://picoserver.cn
