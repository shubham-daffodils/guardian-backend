const moongose = require("mongoose");

const chatSchema = new moongose.Schema({
  message: String,
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

  recipient: {
    user: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
    },
    reciptedAt: {
      type: Date,
      default: Date.now,
    },
  },

  roomName: {
    type: String,
  },
});

module.exports = moongose.model("Chat", chatSchema);
