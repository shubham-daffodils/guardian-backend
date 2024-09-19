const express = require("express");
const {
  createPost,
  deletePost,
  addComment,
  deleteComment,
  getPost,
  getPosts,
  getMyPosts,
  updatePost,
  recipientPost,
  likePost,
} = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");
const multerMiddleware = require("../middlewares/multerMiddleware");

const router = express.Router();

router
  .route("/post/upload")
  .post(isAuthenticated, multerMiddleware.array("images", 4), createPost);
router
  .route("/post/:id")
  .put(isAuthenticated, updatePost)
  .delete(isAuthenticated, deletePost)
  .get(isAuthenticated, getPost);
router.get("/post", getPosts);
router.route("/me/post").get(isAuthenticated, getMyPosts);
router.route("/post/like/:id").get(isAuthenticated, likePost);
router.route("/post/recipient/:id").get(isAuthenticated, recipientPost);
router
  .route("/post/comment/:id")
  .put(isAuthenticated, addComment)
  .delete(isAuthenticated, deleteComment);

module.exports = router;
