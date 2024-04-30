const express = require("D:\\nodejs\\node_modules\\express");
const app = express();
const fs = require("fs");
const path = require("path");

const streamFolderPath = "./stream";
app.use("/stream", express.static(streamFolderPath));

app.get("/stream/:folder/:video", function (req, res) {
  const { folder, video } = req.params;
  const videoPath = path.join(streamFolderPath, folder, video);

  fs.access(videoPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("Video not found");
      return;
    }

    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
      return;
    }

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // Create a video read stream, starting from the specified position
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Pipe the video stream to the response stream
    videoStream.pipe(res);
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
