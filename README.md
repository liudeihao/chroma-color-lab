# CHROMA 本地开发与部署

独立静态网页，无 ChatGPT 服务、账户或 API 依赖。不需要安装 npm 依赖或构建。

## 本地调试

安装 Node.js 20 或更高版本。在项目目录运行：

```powershell
npm run dev
```

打开 http://127.0.0.1:5173 。编辑 `dist/index.html`、`dist/style.css` 或 `dist/app.js`，保存后浏览器自动刷新。按 Ctrl+C 停止服务器。

如果 PowerShell 禁止运行 npm.ps1，可使用 `npm.cmd run dev`，或直接执行 `node server.mjs --dev`。

指定端口或供局域网设备预览：

```powershell
$env:PORT = '8080'
$env:HOST = '0.0.0.0'
npm.cmd run dev
```

收藏保存在浏览器 localStorage，按站点地址隔离。换端口或迁移域名后不会自动转移收藏。

## 文件

- `dist/index.html`：页面结构。
- `dist/style.css`：视觉与动画。
- `dist/app.js`：色环、格式转换、命名色库、感知匹配、复制及收藏。
- `dist/colors.js`：独立的颜色转换、格式解析及命名色数据模块。
- `test/`：基于 Node.js 内置测试框架的颜色计算与服务器测试。
- `server.mjs`：零依赖本地服务器，开发模式附带自动刷新。
- `Dockerfile`、`nginx.conf`：云服务器静态部署配置。

字体采用系统字体，无需访问 Google Fonts。颜色转换与匹配均在浏览器内运行。

## 云服务器

推荐将整个 `dist/` 的内容放入 Nginx 的站点根目录，配好域名和 HTTPS 即可，无需 Node.js。也可以在项目目录使用 Docker：

```bash
docker build -t chroma .
docker run -d --name chroma --restart unless-stopped -p 8080:80 chroma
```

然后由反向代理将域名转发至 8080，并配置 HTTPS。浏览器剪贴板 API 在 HTTPS 或 localhost 下工作；普通远程 HTTP 下会尝试兼容复制，仍可能受浏览器限制。

也可使用 `HOST=0.0.0.0 PORT=8080 npm start` 直接运行 Node 静态服务器（Linux），再用进程管理器及 HTTPS 反向代理对外提供服务。`npm start` 不启用自动刷新。

## 当前范围

内置 155 个色名条目（含部分英文别名），候选展示时按色值去重。中文译名与传统色的参考值在详情中区分。匹配使用 Oklab 距离；RYB 是艺术家色相映射；HSI 超出 sRGB 的结果会裁切。

## 验证

```bash
npm test
```

不需要安装测试依赖。测试覆盖已知原色、HSV / HSL / HSI / Oklab 转换、125 组 RGB 样本、格式解析、非法输入、超色域、命名色精确匹配和服务器行为。CI 模板见 `ci/github-actions.yml`，覆盖 Windows / Linux、Node.js 20 / 22。需要启用时，将它复制到 `.github/workflows/ci.yml` 后提交（上传凭据需要 workflow 权限）。

`dist/index.html` 使用 ES modules，请通过本地服务器访问，不要直接双击 HTML。

## 数据说明

CSS 色名参考 [W3C CSS Color](https://www.w3.org/TR/css-color-4/#named-colors)。Oklab 实现采用该规范的转换矩阵。中国传统色为小型参考色表；传统色名没有唯一的跨媒介 RGB 定义，页面中的英文为参考译名。候选排序反映数值感知距离，不代表颜色名称的唯一归属。
