const mongoose = require("mongoose");


const reelSchema = new mongoose.Schema(
{
  videoUrl: {
    type: String,
    required: true
  },
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
   }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  caption: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  }
}, {
    timestamps: true
}
)

module.exports = mongoose.model("reel", reelSchema);