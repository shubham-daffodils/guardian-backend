const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    console.log(req.files);
    const newPostData = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      address: req.body.address,
      owner: req.user._id,
      images: req.files
        ? req.files.map((file) => {
            return {
              url: file.path,
              public_id: file.filename,
            };
          })
        : [],
    };

    const post = await Post.create(newPostData);
    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    console.log(post);

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
    await Post.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.recipientPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.recipients.find(
        (recipient) => recipient.user.toString() === req.user._id.toString()
      )
    ) {
      return res.status(200).json({
        success: true,
        message: "Already Viewed",
      });
    } else {
      post.recipients.push({
        user: req.user._id,
      });
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Interest Added",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.find(
        (like) => like.user.toString() === req.user._id.toString()
      )
    ) {
      post.likes.pull({
        user: req.user._id,
      });
      return res.status(200).json({
        success: true,
        message: "Disliked"
      });
    } else {
      post.likes.push({
        user: req.user._id,
      });
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let commentExits = post.comments.find(
      (comment) => comment.user.toString() === req.user._id.toString()
    );

    if (commentExits) {
      commentExits.comment = req.body.comment;

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment updated",
      });
    }

    const comment = {
      user: req.user._id,
      comment: req.body.comment,
    };

    post.comments.push(comment);
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() === req.user._id.toString()) {
      if (!req.body.commentId) {
        let commentExits = post.comments.find(
          (comment) => comment.user.toString() === req.user._id.toString()
        );

        if (!commentExits) {
          return res.status(404).json({
            success: false,
            message: "Comment Id is Required",
          });
        }

        post.comments.pull(commentExits._id);

        await post.save();

        return res.status(200).json({
          success: true,
          message: "Comment deleted",
        });
      }

      let commentExits = post.comments.find(
        (comment) => comment._id.toString() === req.body.commentId.toString()
      );

      if (!commentExits) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }
      post.comments.pull(req.body.commentId);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment deleted",
      });
    } else {
      let commentExits = post.comments.find(
        (comment) => comment.user.toString() === req.user._id.toString()
      );

      if (!commentExits) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      post.comments.pull(commentExits._id);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment deleted",
      });
    }
  } catch {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("owner", "name avatar.url")
      .populate("comments.user", "name avatar.url")
      .populate("likes.user", "name avatar.url");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("owner", "name avatar.url")
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.user._id })
      .populate("owner", "name avatar.url")
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }

    post.title = req.body.title;
    post.description = req.body.description;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
