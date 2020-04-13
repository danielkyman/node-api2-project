const express = require("express");

const Posts = require("./db");

const router = express.Router();

router.post("/", (req, res) => {
  postNew = req.body;

  if (!postNew.hasOwnProperty("title") || !postNew.hasOwnProperty("contents")) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    Posts.insert(postNew)
      .then((post) => {
        res.status(201).json(postNew);
      })
      .catch((err) => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const newComment = req.body;

  Posts.findById(id)
    .then((post) => {
      if (!newComment.hasOwnProperty("text")) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {
        Posts.insertComment(newComment)
          .then((comment) => {
            res.status(201).json(newComment);
          })
          .catch((err) => {
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database",
            });
          });
      }
    })
    .catch((err) => {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(201).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then((post) => {
      if (post.length) {
        res.status(200).json(post);
      } else if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then((post) => {
      Posts.findCommentById(id)
        .then((comment) => {
          res.status(200).json(comment);
        })
        .catch((err) => {
          res.status(500).json({
            error: "The comments information could not be retrieved.",
          });
        });
    })
    .catch((err) => {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then((post) => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        Posts.remove(id).then((p) => {
          res.status(200).json(post);
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const postInfo = req.body;

  Posts.findById(id)
    .then((post) => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (
        !postInfo.hasOwnProperty("title") ||
        !postInfo.hasOwnProperty("contents")
      ) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      } else {
        Posts.update(id, postInfo)
          .then((post) => {
            res.status(200).json(postInfo);
          })
          .catch((err) => {
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
