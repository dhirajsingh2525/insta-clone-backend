const { uploadFile } = require("../services/storage.services");
const storyModel = require("../models/story.model");


async function createStory(req,res) {
  try {
      const { caption } = req.body;

    const uploadFiles = await Promise.all(
        req.files.map(async (file) => {
        const uploaded = await uploadFile(file.buffer, file.originalName)
         return {
            mediaUrl: uploaded.url
        }
    })
    )


    const uploadStory = await storyModel.create({
        user_id: req.user._id,
        media: uploadFiles,
        caption,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    return res.status(201).json({
        message: "story create successfully",
        uploadStory
    })
  } catch (error) {
    console.log(error,"error in story")
    return res.status(500).json({
        message: "internal server error"
    })
  }
}

async function viewStories(req, res) {
  try {
    const storyId = req.params.id; 

    if (!storyId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const story = await storyModel.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (!story.viewedBy.includes(req.user._id)) {
      story.viewedBy.push(req.user._id);
      await story.save();
    }

    return res.status(200).json({ message: "You have seen the story" });
  } catch (error) {
    return res.status(500).json({
       message: "Internal server error" 
      });
  }
}

async function getAllStories(req,res) {
try {
    const allStories = await storyModel.find({});

  return res.status(200).json({
    message: "all stories",
    allStories
  })
} catch (error) {
    return res.status(500).json({
       message: "Internal server error" 
      });
}

}


module.exports = {
    createStory,
    viewStories,
    getAllStories
}