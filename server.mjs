import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./dist/", import.meta.url));
const dev = process.argv.includes("--dev");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 5173);
const clients = new Set();
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};
const reloadScript = `<script>new EventSource('/__reload').onmessage=()=>location.reload();</script>`;
const server = http.createServer(async (req, res) => {
  if (dev && req.url === "/__reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write(": connected\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (pathname === "/favicon.ico") {
      res.writeHead(204).end();
      return;
    }
    if (pathname.endsWith("/")) pathname += "index.html";
    const filename = path.resolve(root, "." + pathname);
    const relative = path.relative(root, filename);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    if (!(await stat(filename)).isFile()) {
      res.writeHead(404).end("Not found");
      return;
    }
    let body = await readFile(filename);
    const ext = path.extname(filename);
    if (dev && ext === ".html")
      body = Buffer.from(
        body.toString().replace("</body>", reloadScript + "</body>"),
      );
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": dev ? "no-store" : "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
let watcher, debounce;
if (dev)
  watcher = watch(root, { recursive: true }, () => {
    clearTimeout(debounce);
    debounce = setTimeout(
      () => clients.forEach((res) => res.write("data: reload\n\n")),
      100,
    );
  });
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `Port ${port} is in use. Set PORT to another port.`
      : error.message,
  );
  process.exit(1);
});
server.listen(port, host, () =>
  console.log(
    `CHROMA ${dev ? "development (auto reload)" : "server"}: http://${host}:${server.address().port}`,
  ),
);
function shutdown() {
  watcher?.close();
  clearTimeout(debounce);
  clients.forEach((res) => res.end());
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
