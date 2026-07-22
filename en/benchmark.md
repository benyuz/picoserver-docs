---
title: Benchmark - PicoServer
description: PicoServer performance benchmark report including QPS, memory usage, CPU metrics
prev:
  text: Extensions
  link: /en/extensions
next:
  text: PicoServer.Nano
  link: /en/nano-guide
---

# 📊 PicoServer Benchmark

::: tip 💖 Test Notes
Test results are based on PicoServer in **out-of-the-box state**, tested on a **laptop in balanced mode**. Results are for reference only. Verified for high concurrency, low CPU, and low memory consumption.
:::

::: info 💡 About "Developer Benchmark"
PicoServer publishes **performance data based on daily development environments** — developer laptops, battery-powered, balanced mode, entry-level I3 10th gen office computers, all zero tuning. This is not extreme stress testing in data centers, but results that any developer can reproduce with their own computer. Complementary to traditional "industrial benchmarks" (server hardware + expert tuning).
:::

## Key Metrics at a Glance

<div class="metric-grid">

<div class="metric-card">
<div class="metric-value">69,487</div>
<div class="metric-label">Peak QPS</div>
<div class="metric-desc">50 concurrent / 15s stability test</div>
</div>

<div class="metric-card">
<div class="metric-value">1.9ms</div>
<div class="metric-label">P99 Latency</div>
<div class="metric-desc">50 concurrent stability test</div>
</div>

<div class="metric-card">
<div class="metric-value">0%</div>
<div class="metric-label">Error Rate</div>
<div class="metric-desc">Zero errors under load</div>
</div>

<div class="metric-card">
<div class="metric-value">~16 MB</div>
<div class="metric-label">Memory Usage</div>
<div class="metric-desc">Console app resident memory</div>
</div>

<div class="metric-card">
<div class="metric-value">10,000</div>
<div class="metric-label">WebSocket Connections</div>
<div class="metric-desc">Server memory only 398MB</div>
</div>

<div class="metric-card">
<div class="metric-value">Tens of KB</div>
<div class="metric-label">Delivery Size</div>
<div class="metric-desc">Single DLL, zero deps</div>
</div>

</div>

## Test Environment

| Item | Specification |
| ---- | ---- |
| Device | Honor Laptop |
| Processor | Intel Core Ultra 5 125H (1.20 GHz base frequency) |
| Memory | 24GB RAM |
| Power Mode | Balanced Mode (battery powered) |
| OS | Windows 11 64-bit |
| Runtime | .NET Framework 4.7.2 |
| Test Program | Console Application (Release mode) |
| PicoServer Version | 1.5.3 |

## Test Commands

```bash
# 1. 100 concurrent stress test (50,000 requests)
hey -n 50000 -c 100 http://127.0.0.1:8090

# 2. 50 concurrent stability test (15 seconds)
hey -c 50 -z 15s http://127.0.0.1:8090
```

Expected response: `{"code": 1, "msg": "Hello WebAPI"}`

## Test Results

| Test Type | Total Requests | Duration | QPS (Requests/sec) | P99 Latency | Error Rate |
|---------|---------|------|---------------|---------|-------|
| 100 Concurrent Stress Test | 50,000 | 0.9071 sec | **55,117** | 5.3ms | 0% |
| 50 Concurrent Stability Test | 1,000,000 | 15 sec | **69,487** | 1.9ms | 0% |

### WebSocket 10,000 Connections Test

| Item | Data |
|------|------|
| Connections | 10,000 |
| Server Memory | 398MB |
| Client Memory | 172MB |
| Packet Loss | 0 |

## Multi-Environment Performance Profile

| Deployment Scenario | Conditions | QPS |
|---------|------|-----|
| Linux Cloud Server 2+2 | Debian 12 / .NET 10 / Zero Tuning | **~20,000** |
| i3 10th Gen Entry Computer | Windows 10 / .NET 10 / Zero Tuning | **~18,000** |

## Resource Efficiency Comparison

| Dimension | PicoServer | ASP.NET Core |
|------|-----------|-------------|
| Control Test Program Memory | **~16 MB** | ~100 MB+ |
| Delivery Size | **Tens of KB** | Hundreds of MB runtime |
| .NET FX Compatibility | **4.6.1+** | Not supported |
| Framework Kernel Overhead | **Almost zero** | Host/DI/Pipeline/Endpoint/Metadata |

## Key Highlights

- **Performance Ceiling**: QPS peak breaks **70,000** on Windows 11 local environment, excellent high concurrency performance
- **Resource Friendly**: CPU/memory consumption stays below 7%, memory around 16MB, drops quickly after test, no memory leaks
- **Stable & Reliable**: Zero error rate under high concurrency, P99 latency as low as 1.9ms
- **Out-of-the-box**: No additional tuning required, high performance in default state

> 🛠️ Benchmark Tool: [hey](https://github.com/rakyll/hey) HTTP load testing tool

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
