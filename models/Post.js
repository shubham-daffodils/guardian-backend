const moongose = require("mongoose");

const postSchema = new moongose.Schema({
  title: String,
  description: String,
  slug: String,
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  owner: {
    type: moongose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  recipients: [
    {
      user: {
        type: moongose.Schema.Types.ObjectId,
        ref: "User",
      },
      reciptedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tags: [
    {
      type: String,
    },
  ],

  likes: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: moongose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

postSchema.pre("save", async function (next) {
  if (!this.isModified("title")) {
    next();
  }
  let slug = this.title.split(" ").join("-");
  const slugRegEx = new RegExp(`^(${slug})((-[0-9]*$)?)$`, "i");

  const postsWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (postsWithSlug.length) {
    slug = `${slug}-${postsWithSlug.length + 1}`;
  }

  this.slug = slug;
});

module.exports = moongose.model("Post", postSchema);
