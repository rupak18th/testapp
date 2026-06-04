const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const port = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, "public");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function send(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
}

async function serveStaticFile(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname;

  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    send(res, 400, "Bad request");
    return;
  }

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.normalize(path.join(publicDir, pathname));
  const isInsidePublicDir = filePath === publicDir || filePath.startsWith(`${publicDir}${path.sep}`);

  if (!isInsidePublicDir) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, file, mimeTypes[ext] || "application/octet-stream");
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "EISDIR") {
      send(res, 404, "Page not found");
      return;
    }

    console.error(error);
    send(res, 500, "Internal server error");
  }
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed");
    return;
  }

  serveStaticFile(req, res);
});

server.listen(port, () => {
  console.log(`Sample site running at http://localhost:${port}`);
});
