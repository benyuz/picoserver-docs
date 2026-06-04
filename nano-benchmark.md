---
prev:
  text: ESP32 快速上手
  link: /nano-guide
next:
  text: 集成案例
  link: /examples
---

# 📊 PicoServer.Nano 性能测试

## 测试环境

| 项目 | 规格 |
| ---- | ---- |
| 硬件 | ESP32-S3 N16R8 |
| 网络 | 局域网 WiFi |
| PicoServer.Nano | v0.8.0 |

## 测试命令

```bash
# 6 并发短时压力测试
hey -n 50 -c 6 http://192.168.2.67
```

## 测试结果

| 配置 | 稳定并发 | QPS | 平均延迟 | 成功率 |
|------|---------|-----|---------|--------|
| 无 PSRAM | 6 | **~8** | ~220ms | 100% |
| 有 PSRAM | 6 | **~26** | ~210ms | 100% |

> 启用 PSRAM 后 QPS 提升明显。STM32 配合以太网或硬件协议栈，预期性能更高。并发建议控制在 6 以内，过高会导致底层 lwIP 协议栈丢包。
