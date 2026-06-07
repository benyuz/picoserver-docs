---
prev:
  text: ESP32 Quick Start
  link: /en/nano-guide
next:
  text: Integration Examples
  link: /en/examples
---

# 📊 PicoServer.Nano Benchmark

## Test Environment

| Item | Specification |
| ---- | ---- |
| Hardware | ESP32-S3 N16R8 |
| Network | LAN WiFi |
| PicoServer.Nano | v0.8.0 |

## Test Commands

```bash
# 6 concurrent short stress test
hey -n 50 -c 6 http://192.168.2.67
```

## Test Results

| Configuration | Stable Concurrency | QPS | Avg Latency | Success Rate |
|------|---------|-----|---------|--------|
| Without PSRAM | 6 | **~8** | ~220ms | 100% |
| With PSRAM | 6 | **~26** | ~210ms | 100% |

> QPS improves significantly with PSRAM enabled. STM32 with Ethernet or hardware protocol stack is expected to perform better. Concurrency is recommended to be controlled within 6, as higher values may cause packet loss in the underlying lwIP stack.