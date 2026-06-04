import type { Post } from '../types/post'
import encData from './encryption.json'
import goPlanEncData from './go-plan-encryption.json'

export const posts: Post[] = [
  {
    id: 'fullstack-review',
    date: '2026-06-04',
    title: '从零搭建零端口暴露的个人博客：全链路踩坑复盘',
    content: `把 nosh1ro.top 从"公网端口全开"改成了"零入站端口"，整个过程踩了不少坑，顺便把整个项目的技术栈从头复盘一遍。

## 一、整体架构

\`\`\`
用户 HTTPS
  │
Cloudflare Edge (CDN / WAF / SSL)
  │ QUIC Tunnel（出站长连接，非入站端口）
  │
cloudflared (systemd 守护)
  │ http://127.0.0.1:80
  │
Nginx → /var/www/blog （Vue 3 + Vite 静态站点）
\`\`\`

**关键决策**：服务器不监听任何公网 HTTP/HTTPS 端口，所有流量通过 Cloudflare Tunnel 反向通道进来。

## 二、域名 & 备案绕坑

国内 ECS 绑域名没备案，运营商会直接劫持拦截。接入 Cloudflare 橙色云朵后，访客 DNS 解析到 CF 的海外边缘节点 IP，**流量不经过国内域名白名单校验链路**，绕过了备案拦截。裸 IP 直连反而会被封，这个反直觉的现实是个人静态站最头疼的一关。

## 三、HTTPS 与 Web Crypto 踩坑

\`window.crypto.subtle\` 只在**安全上下文**（HTTPS 或 localhost）下可用。之前在 HTTP 环境调试加密文章功能，\`crypto.subtle\` 一直是 \`undefined\`，\`importKey\` 调用直接报 \`Cannot read properties of undefined\`。

排查过程：
- 自签证书 → HTTPS 通了但浏览器弹警告，生产不可用
- Cloudflare Universal SSL（Google Trust Services 签发）→ 全浏览器信任，API 恢复正常

这不是代码的 bug，是浏览器安全策略在 HTTP 下根本不给你 API。同类受限的还有 Service Worker、Geolocation、Clipboard 高级接口——全部强制安全上下文。

## 四、Nginx 安全加固

生产环境的 Nginx 不是改个 root 就完事的：

**资源防护**
- \`try_files $uri $uri/ =404\` — 杜绝目录浏览
- \`location ~ /\\.\` — 拦截 \`.env\`、\`.git\` 等隐藏文件泄露
- \`server_tokens off\` — 隐藏 Nginx 版本号，不给扫描器提供指纹

**安全响应头**
- \`X-Frame-Options: DENY\` — 防 iframe 点击劫持
- \`X-Content-Type-Options: nosniff\` — 禁止 MIME 类型嗅探
- \`X-XSS-Protection: 1; mode=block\` — 浏览器内置 XSS 防御

**速率限制**
\`\`\`nginx
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
limit_req zone=mylimit burst=20 nodelay;
limit_req_status 429;
\`\`\`
基于真实 IP 的令牌桶算法，单 IP 每秒 10 请求，突发 20，超限直接 429。在公网扫描器 7×24 遍历的环境下，这个配置必不可少。

**最小权限**：Nginx worker 跑在 \`www-data\` 用户，只有 master 是 root。

## 五、云安全组：虚拟化层拦截

华为云安全组在宿主机虚拟化层就丢包，数据包**没到系统网卡就被丢弃了**，优先级高于 iptables。之前踩过一个坑：本机配了全局 \`https_proxy=127.0.0.1:7890\`，用 curl 调华为云 API 被代理劫持导致 SSL 握手失败，加 \`--noproxy\` 绕过才通。

## 六、家庭网络基建：Padavan + FRP

K2P 路由器刷 Padavan，跑 frpc 连到云服务器 frps，实现外网管理路由器和 SSH 内网设备。上线一小时就遭遇境外 IP 全端口扫描——直观感受了一把公网有多"热闹"，这也是后来下决心改用 Tunnel、关闭源站端口的直接原因。

## 七、Cloudflare Tunnel 实战

这是最近一次架构升级。核心思路：**服务器主动出站连 CF，公网不留任何 HTTP 入站口。**

踩坑记录：
- cloudflared 在无头服务器上认证，\`tunnel login\` 需要浏览器打开 URL，但服务器没有 GUI——需要复制 URL 到本地浏览器完成 OAuth
- ARGO TUNNEL TOKEN（PEM 格式）和原生 base64 token 是两种格式，用错直接 "token is not valid"
- systemd \`Type=notify\` 和 cloudflared 的兼容性问题，换成 \`Type=simple\` 才正常启动
- DNS 从 A 记录切到 \`*.cfargotunnel.com\` CNAME，要先删旧记录再建新的，不能直接 PATCH

部署完成后验证：
\`\`\`bash
# 公网端口检测
timeout 3 bash -c 'echo >/dev/tcp/139.159.232.200/80'  # 超时 ✅
timeout 3 bash -c 'echo >/dev/tcp/139.159.232.200/443' # 超时 ✅
\`\`\`
两个端口都关了，网站通过 CF Tunnel 正常运行。

## 八、架构优缺点

**优点**
- 零入站端口：彻底杜绝端口扫描，攻击者连服务器在哪都不知道
- 零成本：Cloudflare 免费 CDN、WAF、DDoS 防护
- 部署轻量：纯静态前端，无后端依赖

**代价**
- 依赖 cloudflared 进程，断连站点就挂（systemd Restart=always 兜底）
- 无法灰云直连源站调试，本地测试只能 \`curl -H "Host: nosh1ro.top" http://127.0.0.1/\`
- 出站带宽受 ECS 实例限制（静态站点基本无感）

## 九、后续路线

1. **Go 后端接入**：Nginx 预留 \`/api/*\` 反向代理，Gin 项目监听 \`127.0.0.1:8080\`，前端不动
2. **加密文章升级**：密钥校验从纯前端 Web Crypto 迁到 Go 后端
3. **监控与告警**：Tunnel 健康检查 + 证书到期提醒

## 十、学习价值

从 DNS 解析、VPC 网络、云防火墙、Nginx 深度配置、TLS 安全规范、浏览器安全策略、CDN 原理、内网穿透到 systemd 服务管理——**全链路实操覆盖了后端运维 + 前端浏览器底层规范**，比只看书扎实得多。`,
  },
  {
    id: 'go-plan',
    date: '2026-06-03',
    title: 'Go 学习路线图',
    content: '',
    encrypted: true,
    encryption: goPlanEncData,
  },
  {
    id: 'cloudflare',
    date: '2026-06-03',
    title: '上了 Cloudflare，顺便修了个 HTTPS 的坑',
    content: `把 nosh1ro.top 接入了 Cloudflare。免费的 CDN + HTTPS + DDoS 防护，对个人博客来说简直白嫖神车。

### 为什么搞 Cloudflare

两个原因：一是国内 ISP 没备案会拦截域名，CF 的 edge 节点在海外，访问者连的是 CF 的 IP，不走国内运营商检测，自然不拦。二是自动 HTTPS——CF 边缘签发 Google Trust Services 证书，浏览器看到的是正经证书。

### 意外收获：修了 crypto.subtle 的 bug

之前那篇加密文章，浏览器一直报 \`Cannot read properties of undefined (reading 'importKey')\`。排查了半天发现不是密码问题——浏览器的 Web Crypto API 有个硬性要求：\`crypto.subtle\` 只能在**安全上下文**里用，也就是 HTTPS 或 localhost。

之前 HTTP 访问，\`crypto.subtle\` 直接是 \`undefined\`。自签名证书虽然 HTTPS 通了但弹警告。现在 CF 一发搞定。

### 教训

Web Crypto API 和 Service Worker、Geolocation 等现代浏览器 API 都要求安全上下文。不是代码写错了，是浏览器不给你 API。`,
  },
  {
    id: 'blog-deploy',
    date: '2026-06-02',
    title: '博客部署：从 DNS 到安全加固的完整链路',
    content: '',
    encrypted: true,
    encryption: encData,
  },
  {
    id: 'domain-up',
    date: '2026-06-02',
    title: '域名上线',
    content: `买了 nosh1ro.top，配了 DNS 指向华为云服务器。顺便把短链接项目也部署上去了。

踩坑记录：MySQL 暴露公网被扫、Docker BuildKit 不走代理拉不下镜像、容器网络配错服务互不通……跑起来就行。`,
  },
  {
    id: 'frp-tunnel',
    date: '2026-06-01',
    title: '路由器 FRP 穿透',
    content: `K2P Padavan 固件，frpc 连到云服务器 frps。现在可以从外网访问路由器管理和 SSH 了。

还被全网扫描器撞了一下——公网 IP 上线不到一小时就有俄罗斯的 IP 来扫端口。学会了什么叫"公网无差别扫描"。`,
  },
]
