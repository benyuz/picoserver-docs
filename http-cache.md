# 📦 高性能协商缓存机制 (ETag)

PicoServer 内置了高度优化的 **ETag 生成与协商缓存（Negotiated Caching）算法**，在协议层直接拦截不必要的重复传输。若资源未变动，直接切断后续的业务逻辑，不进行数据拷贝，瞬间返回 `304 Not Modified`，帮你的服务器节省每一兆流量和每一周期 CPU。
