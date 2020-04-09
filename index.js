let secureEnv = require("secure-env");
global.env = secureEnv({ secret: "password" });

const express = require("express");

const postsRouter = require("./data/router");

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

const message = global.env.MESSAGE;

server.get("/", (req, res) => {
  res.send(`
        <h2>This is a test API - Enjoy</h2>
        ${message}
    `);
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`server listening on port - ${port}`);
});
