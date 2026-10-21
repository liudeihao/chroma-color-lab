# 生产部署

- 地址：https://liudehao.me/chroma/
- 主机：`ldh@liudehao.me`
- 部署方式：现有 Nginx HTTPS 站点下的静态子目录。
- 入口：`/home/ldh/www/profile/chroma`，软链接指向发布目录。
- 发布目录：`/home/ldh/www/chroma-releases/<commit>`。
- 首次上线：2026-10-21，应用提交 `e4dbddc`。

无需安装依赖、构建或新增服务。保留现有 Nginx 和证书配置。

## 更新

先运行 `npm test`，仅打包 `dist/` 的内容，上传后解压至新的提交目录。发布目录采用只追加方式，不覆盖正在使用的版本。

在服务器上确认新目录中的 `index.html`、`app.js`、`colors.js`、`style.css` 完整后，用临时软链接原子切换：

```bash
# 将 COMMIT 替换为已上传、解压并验证的新版本目录名。
release=/home/ldh/www/chroma-releases/COMMIT
test -f "$release/index.html" && test -f "$release/colors.js" || exit 1
test ! -e /home/ldh/www/profile/chroma.next && test ! -L /home/ldh/www/profile/chroma.next || exit 1
ln -s "$release" /home/ldh/www/profile/chroma.next
mv -Tf /home/ldh/www/profile/chroma.next /home/ldh/www/profile/chroma
```

验证页面及三个静态资源返回 200，并检查选色、近似色匹配与复制。回滚时用相同操作将链接切回保留的旧版本目录。

个人主页若使用清空目录的同步部署（如 `rsync --delete`），必须将 `chroma`、`chroma.next` 排除，避免移除本站入口。

用户收藏存于浏览器，按域名隔离；localhost 的收藏不会自动迁移到生产域名。
