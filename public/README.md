# PicoServer 静态资源目录

此目录用于存放 VitePress 构建时直接复制到站点根目录的静态资源。

## 建议放置的文件

- `favicon.ico` - 浏览器标签页图标
- `logo.svg` - 项目 Logo
- `og-image.png` - 社交分享卡片预览图
- 其他需要直接通过根路径访问的文件

## 如何使用

将文件放入此目录后，VitePress 构建时会自动复制到 `dist/` 根目录，可通过 `/文件名` 直接访问。

例如：
- `public/favicon.ico` → `https://your-domain.com/favicon.ico`
- `public/logo.svg` → `https://your-domain.com/logo.svg`
