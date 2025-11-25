const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
         type: String,
         required: true
        },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
     bio: {
        type: String,
        default: ""
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Prefer not to say"],
        default: "Prefer not to say"
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    followers: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
   }],
    following: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
   }],
   posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
   reels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reel",
      },
    ],
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema);