const express = require("express");

const postsRouter = require("./data/router");

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
        <h2>This is a test API - Enjoy</h2>
    `);
});

port = 4000;

server.listen(port, () => {
  console.log(`server listening on port - ${port}`);
});
