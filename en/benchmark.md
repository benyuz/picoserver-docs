---
prev:
  text: Custom Middleware
  link: /en/middleware
next:
  text: PicoServer.Nano
  link: /en/nano-guide
---

# 📊 PicoServer Benchmark

> 💖 **Test Notes**: Test results are based on PicoServer in **out-of-the-box state**, tested on a **laptop in balanced mode**. Results are for reference only. Verified for high concurrency, low CPU, and low memory consumption.
>
> 💡 **About "Developer Benchmark"**
>
> PicoServer publishes **performance data based on daily development environments** — developer laptops, battery-powered, balanced mode, entry-level I3 10th gen office computers, all zero tuning. This is not extreme stress testing in data centers, but results that any developer can reproduce with their own computer. Complementary to traditional "industrial benchmarks" (server hardware + expert tuning).

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