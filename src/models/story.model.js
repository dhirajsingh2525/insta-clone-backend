const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    media: [
        {
        mediaUrl: {
            type: String,
            required: true
        },
        }
    ],
     caption: {
        type: String
     },
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true }
);

storySchema.index({ expiresAt: 1}, { expireAfterSeconds: 0})

module.exports = mongoose.model("story", storySchema)