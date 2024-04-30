const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Determine the file path to return based on the request URL
  let filePath = "." + req.url;

  // If the URL is root path, return index.html
  if (filePath === "./") {
    filePath = "./index.html";
  }

  // Get the file extension
  const extname = path.extname(filePath);

  // Determine the Content-Type of the response
  let contentType = "text/html";
  if (extname === ".js") {
    contentType = "text/javascript";
  } else if (extname === ".css") {
    contentType = "text/css";
  }

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File does not exist, return 404 error
        res.writeHead(404);
        res.end("404 Not Found");
      } else {
        // Other errors, return 500 error
        res.writeHead(500);
        res.end("500 Internal Server Error: " + err.code);
      }
    } else {
      // Successfully read the file, return the file content
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
