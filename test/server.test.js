import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

async function start(dev, t) {
  const child = spawn(
    process.execPath,
    ["server.mjs", ...(dev ? ["--dev"] : [])],
    {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      env: { ...process.env, HOST: "127.0.0.1", PORT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  t.after(() => child.kill());
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(
      () => reject(Error("Server startup timed out")),
      10000,
    );
    child.once("error", (e) => {
      clearTimeout(timeout);
      reject(e);
    });
    child.stdout.on("data", (data) => {
      output += data;
      let match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[0]);
      }
    });
    child.once("exit", (code) => {
      clearTimeout(timeout);
      reject(Error("Server exited " + code));
    });
  });
}
test("production serves only static assets with correct headers", async (t) => {
  const url = await start(false, t);
  let r = await fetch(url);
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /text\/html/);
  assert.doesNotMatch(await r.text(), /EventSource/);
  r = await fetch(url + "/colors.js");
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-type"), /javascript/);
  r = await fetch(url + "/package.json");
  assert.equal(r.status, 404);
  r = await fetch(url + "/%2e%2e%2fpackage.json");
  assert.equal(r.status, 403);
  r = await fetch(url + "/missing");
  assert.equal(r.status, 404);
  r = await fetch(url, { method: "POST" });
  assert.equal(r.status, 405);
  r = await fetch(url, { method: "HEAD" });
  assert.equal(r.status, 200);
  assert.equal(await r.text(), "");
});
test("development injects reload and establishes an SSE connection", async (t) => {
  const url = await start(true, t);
  let r = await fetch(url);
  assert.match(await r.text(), /EventSource/);
  assert.equal(r.headers.get("cache-control"), "no-store");
  const abort = new AbortController();
  t.after(() => abort.abort());
  r = await fetch(url + "/__reload", { signal: abort.signal });
  assert.match(r.headers.get("content-type"), /text\/event-stream/);
  const reader = r.body.getReader();
  const chunk = await reader.read();
  assert.match(new TextDecoder().decode(chunk.value), /connected/);
  await reader.cancel();
});
