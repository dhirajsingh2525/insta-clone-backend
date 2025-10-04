

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  { 
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    imageUrl: {
      type: [String],
      required: true
    },
    caption: {
      type: String
    },
    location: {
      type: String
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }],
    tags: [{ type: String }]      
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);
