# AI Card Studio 阿里云轻量应用服务器部署指南

> 本指南将手把手教你将 AI Card Studio 部署到阿里云轻量应用服务器上，全程约 20 分钟即可完成。

---

## 一、整体思路

AI Card Studio 是一个纯前端项目（React + Vite），构建后会生成静态文件（HTML/CSS/JS）。部署到你的阿里云轻量服务器有**两种方案**可选：

| 方案 | 适用场景 | 技术栈 | 难度 |
|------|---------|--------|------|
| **方案 A：Nginx 纯静态托管** | 只需要展示网站，最简单 | Nginx | 简单 |
| **方案 B：Node.js 服务部署** | 后续可能加后端功能 | Node.js + PM2 | 中等 |

**推荐方案 A**，因为你的项目目前是纯前端，Nginx 性能更好、配置更简单。下面两种方案都会详细说明。

---

## 二、准备工作

### 2.1 从 Manus 下载项目代码

在 Manus 的管理界面中，点击右上角的 **「⋯」更多菜单** → **「Download as ZIP」**，将完整项目代码下载到你的电脑上。

### 2.2 确认阿里云服务器信息

你需要准备以下信息：

| 项目 | 说明 | 示例 |
|------|------|------|
| 服务器公网 IP | 在阿里云控制台查看 | `47.xxx.xxx.xxx` |
| 登录用户名 | 一般是 root | `root` |
| 登录密码或密钥 | 创建服务器时设置的 | — |
| 操作系统 | 推荐 Ubuntu 22.04 或 CentOS 7/8 | Ubuntu 22.04 |

### 2.3 开放防火墙端口

在阿里云控制台 → 轻量应用服务器 → **防火墙** 中，确保以下端口已开放：

| 端口 | 用途 |
|------|------|
| 22 | SSH 远程登录 |
| 80 | HTTP 访问 |
| 443 | HTTPS 访问（如需配置域名） |

### 2.4 SSH 登录服务器

在你的电脑终端（Mac/Linux）或 PowerShell（Windows）中执行：

```bash
ssh root@你的服务器公网IP
```

输入密码后即可登录。如果你用的是 Windows，也可以使用 **MobaXterm** 或 **Termius** 等工具。

---

## 三、方案 A：Nginx 纯静态托管（推荐）

### 步骤 1：安装 Node.js 和 pnpm（用于构建）

```bash
# Ubuntu 系统
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs

# CentOS 系统
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# 安装 pnpm
npm install -g pnpm
```

验证安装：

```bash
node -v    # 应显示 v22.x.x
pnpm -v    # 应显示 10.x.x
```

### 步骤 2：安装 Nginx

```bash
# Ubuntu 系统
sudo apt update
sudo apt install -y nginx

# CentOS 系统
sudo yum install -y epel-release
sudo yum install -y nginx
```

启动 Nginx 并设置开机自启：

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

此时在浏览器访问 `http://你的服务器IP`，应该能看到 Nginx 的欢迎页面。

### 步骤 3：上传项目代码到服务器

在**你的电脑**上执行（不是在服务器上）：

```bash
# 将下载的 ZIP 解压后，用 scp 上传整个项目文件夹
scp -r ./ai-card-studio root@你的服务器IP:/home/
```

或者你也可以用更方便的方式——直接在服务器上用 Git 拉取（如果你已经导出到 GitHub）：

```bash
# 在服务器上执行
cd /home
git clone https://github.com/你的用户名/ai-card-studio.git
```

### 步骤 4：构建项目

```bash
cd /home/ai-card-studio

# 安装依赖
pnpm install

# 构建生产版本
pnpm build
```

构建完成后，静态文件会生成在 `/home/ai-card-studio/dist/public/` 目录中。

### 步骤 5：配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/ai-card-studio
```

粘贴以下内容（注意替换 IP 或域名）：

```nginx
server {
    listen 80;
    server_name 你的服务器IP;  # 如果有域名，改成你的域名，如 ai.example.com

    root /home/ai-card-studio/dist/public;
    index index.html;

    # 支持 React 单页应用的路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
}
```

启用配置并重启 Nginx：

```bash
# Ubuntu 系统
sudo ln -s /etc/nginx/sites-available/ai-card-studio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # 移除默认站点
sudo nginx -t                                   # 测试配置是否正确
sudo systemctl reload nginx                     # 重新加载

# CentOS 系统（没有 sites-available 目录，直接编辑主配置）
sudo nano /etc/nginx/nginx.conf
# 将上面的 server 块粘贴到 http 块内，替换掉默认的 server 块
sudo nginx -t
sudo systemctl reload nginx
```

### 步骤 6：访问验证

在浏览器中打开 `http://你的服务器IP`，你应该能看到 AI Card Studio 的页面了。

---

## 四、方案 B：Node.js + PM2 部署

如果你后续计划给项目加后端功能（比如接入 AI API），可以选择这个方案。

### 步骤 1 ~ 4

与方案 A 相同，完成 Node.js 安装、代码上传和构建。

### 步骤 5：安装 PM2 进程管理器

```bash
npm install -g pm2
```

### 步骤 6：用 PM2 启动服务

```bash
cd /home/ai-card-studio

# 启动服务（默认监听 3000 端口）
pm2 start dist/index.js --name ai-card-studio

# 设置开机自启
pm2 save
pm2 startup
```

### 步骤 7：配置 Nginx 反向代理

安装 Nginx（同方案 A 步骤 2），然后配置反向代理：

```bash
sudo nano /etc/nginx/sites-available/ai-card-studio
```

```nginx
server {
    listen 80;
    server_name 你的服务器IP;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置并重启 Nginx（同方案 A 步骤 5 的启用方式）。

### PM2 常用命令速查

| 命令 | 作用 |
|------|------|
| `pm2 list` | 查看所有运行中的服务 |
| `pm2 logs ai-card-studio` | 查看日志 |
| `pm2 restart ai-card-studio` | 重启服务 |
| `pm2 stop ai-card-studio` | 停止服务 |
| `pm2 delete ai-card-studio` | 删除服务 |

---

## 五、绑定域名（可选但推荐）

如果你有自己的域名，可以让网站通过域名访问，而不是 IP 地址。

### 5.1 域名解析

在你的域名服务商（阿里云/腾讯云/Cloudflare 等）的 DNS 管理中，添加一条 A 记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | ai（或你想要的子域名） | 你的服务器公网 IP | 600 |

这样 `ai.你的域名.com` 就会指向你的服务器。

### 5.2 修改 Nginx 配置

将 Nginx 配置中的 `server_name` 改为你的域名：

```nginx
server_name ai.你的域名.com;
```

然后重新加载 Nginx：`sudo systemctl reload nginx`。

### 5.3 配置 HTTPS（免费 SSL 证书）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx   # Ubuntu
# 或
sudo yum install -y certbot python3-certbot-nginx    # CentOS

# 自动配置 SSL（会自动修改 Nginx 配置）
sudo certbot --nginx -d ai.你的域名.com

# 设置自动续期
sudo crontab -e
# 添加这一行：
0 3 * * * certbot renew --quiet
```

完成后，你的网站就可以通过 `https://ai.你的域名.com` 安全访问了。

---

## 六、后续更新网站

当你在 Manus 上修改了网站后，需要重新部署。流程很简单：

```bash
# 登录服务器
ssh root@你的服务器IP

# 进入项目目录
cd /home/ai-card-studio

# 如果用 Git 管理：
git pull

# 如果用 scp 上传：在本地电脑重新 scp 上传文件

# 重新构建
pnpm install
pnpm build

# 方案 A 无需额外操作，Nginx 会自动读取新文件
# 方案 B 需要重启 Node 服务：
pm2 restart ai-card-studio
```

---

## 七、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|------|---------|---------|
| 浏览器访问显示"拒绝连接" | 防火墙未开放 80 端口 | 在阿里云控制台的防火墙中添加 80 端口规则 |
| 显示 Nginx 默认页面 | 配置未生效 | 检查是否已删除 default 站点，执行 `sudo nginx -t` 检查配置 |
| 页面空白 | 构建路径不对 | 确认 Nginx 的 `root` 指向 `dist/public` 目录 |
| 刷新页面 404 | 未配置 `try_files` | 确认 Nginx 配置中有 `try_files $uri $uri/ /index.html;` |
| `pnpm build` 报错 | Node.js 版本太低 | 确保 Node.js 版本 >= 18，推荐 22.x |
| 服务器内存不足导致构建失败 | 轻量服务器内存小 | 可以在本地电脑构建好 `dist` 目录后直接上传到服务器 |

---

## 八、省内存技巧：本地构建后上传

如果你的轻量服务器内存较小（1GB 或 2GB），在服务器上执行 `pnpm install` 和 `pnpm build` 可能会比较吃力。更好的做法是**在本地电脑构建好，只上传构建产物**：

```bash
# 在你的电脑上（确保已安装 Node.js 和 pnpm）
cd ai-card-studio
pnpm install
pnpm build

# 只上传 dist/public 目录到服务器
scp -r dist/public root@你的服务器IP:/var/www/ai-card-studio
```

然后将 Nginx 的 `root` 指向 `/var/www/ai-card-studio` 即可。这种方式服务器上甚至不需要安装 Node.js，只需要 Nginx。

---

*本指南由 Manus AI 生成，如有疑问欢迎随时提问。*
