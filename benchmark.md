---
title: 性能测试 - PicoServer
description: PicoServer 性能测试报告，包含 QPS、内存占用、CPU 使用率等指标
prev:
  text: 扩展包
  link: /extensions
next:
  text: PicoServer.Nano
  link: /nano-guide
---

# 📊 PicoServer 性能测试

::: tip 💖 测试说明
测试报告基于 PicoServer **开箱即用状态**、**笔记本平衡模式**测试所得，基于开发环境，结果仅供参考。已验证其高并发、低 CPU、低内存消耗的特点。
:::

::: info 💡 关于"开发者基准"
PicoServer 公开的是**基于日常开发环境的性能数据**——开发笔记本、电池供电、平衡模式，I3 10代入门办公电脑，均为零调优。这不是数据中心里的极限压测，而是任何开发者用自己的电脑就能复现的结果。与传统"工业基准"（服务器硬件 + 专家调优）形成互补。
:::

## 核心指标速览

<div class="metric-grid">

<div class="metric-card">
<div class="metric-value">69,487</div>
<div class="metric-label">峰值 QPS</div>
<div class="metric-desc">50并发 / 15秒稳定性测试</div>
</div>

<div class="metric-card">
<div class="metric-value">1.9ms</div>
<div class="metric-label">P99 延迟</div>
<div class="metric-desc">50并发稳定性测试</div>
</div>

<div class="metric-card">
<div class="metric-value">0%</div>
<div class="metric-label">错误率</div>
<div class="metric-desc">高并发零错误</div>
</div>

<div class="metric-card">
<div class="metric-value">~16 MB</div>
<div class="metric-label">内存占用</div>
<div class="metric-desc">控制台程序常驻内存</div>
</div>

<div class="metric-card">
<div class="metric-value">10,000</div>
<div class="metric-label">WebSocket 连接</div>
<div class="metric-desc">服务器内存仅 398MB</div>
</div>

<div class="metric-card">
<div class="metric-value">几十 KB</div>
<div class="metric-label">交付体积</div>
<div class="metric-desc">单 DLL，零依赖</div>
</div>

</div>

## 测试环境

| 项目 | 规格 |
| ---- | ---- |
| 设备 | 荣耀笔记本电脑 |
| 处理器 | Intel Core Ultra 5 125H（1.20 GHz 基础频率） |
| 内存 | 24GB RAM |
| 电源模式 | 平衡模式（电池供电） |
| 系统 | Windows 11 64位 |
| 运行时 | .NET Framework 4.7.2 |
| 测试程序 | 控制台应用（Release 模式编译） |
| PicoServer 版本 | 1.5.3 |

## 测试命令

```bash
# 1. 100并发压力测试（5万请求）
hey -n 50000 -c 100 http://127.0.0.1:8090

# 2. 50并发稳定性测试（15秒持续）
hey -c 50 -z 15s http://127.0.0.1:8090
```

预期响应：`{"code": 1, "msg": "Hello WebAPI"}`

## 测试结果

| 测试类型 | 总请求数 | 耗时 | QPS（每秒请求） | P99 延迟 | 错误率 |
|---------|---------|------|---------------|---------|-------|
| 100并发压力测试 | 5万 | 0.9071秒 | **55,117** | 5.3ms | 0% |
| 50并发稳定性测试 | 100万 | 15秒 | **69,487** | 1.9ms | 0% |

### WebSocket 万连接测试

| 项目 | 数据 |
|------|------|
| 连接数 | 10,000 |
| 服务端内存 | 398MB |
| 客户端内存 | 172MB |
| 丢包 | 0 |

## 多环境性能画像

| 部署场景 | 条件 | QPS |
|---------|------|-----|
| Linux 云服务器 2+2 | Debian 12 / .NET 10 / 零调优 | **~2 万** |
| i3 10 代入门电脑 | Windows 10 / .NET 10 / 零调优 | **~1.8 万** |

## 资源效率对比

| 维度 | PicoServer | ASP.NET Core |
|------|-----------|-------------|
| 控制测试程序内存 | **~16 MB** | ~100 MB+ |
| 交付体积 | **几十 KB** | 百 MB 级运行时 |
| .NET FX 兼容 | **4.6.1+** | 不支持 |
| 框架内核开销 | **几乎为零** | 宿主/DI/管道/端点/元数据 |

## 关键亮点

- **性能上限**：Windows 11 本地环境 QPS 峰值最高突破 **7万**，高并发表现优异
- **资源友好**：CPU/内存消耗始终保持低位 7% 以下，内存 16MB 左右，测试结束后快速回落，无内存泄漏
- **稳定可靠**：高并发场景下零错误率，P99 延迟低至 1.9ms
- **开箱即用**：无额外调优配置，默认状态即可实现高性能

> 🛠️ 压测工具：[hey](https://github.com/rakyll/hey) HTTP 负载测试工具

<style>
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

.metric-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--vp-c-shadow);
  border-color: var(--vp-c-brand);
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-brand);
  line-height: 1.2;
  word-break: break-all;
}

.metric-label {
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  color: var(--vp-c-text-1);
}

.metric-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}
</style>
