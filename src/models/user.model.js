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
        type: Number,
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
    posts: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
   }],
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema);