const userModel = require("../models/user.model");
const PostModel = require("../models/post.model");
const storageServices = require("../services/storage.services");
const postModel = require("../models/post.model");

async function createPost(req,res) {
    try {
       const {  caption, location,tags } = req.body;
      

    if(!req.files){
        return res.status(404).json({
            message: "image is required"
        })
    }


    const files = await Promise.all(req.files.map(async function (file) {
        return await storageServices.uploadFile(file.buffer)
    }))

    const uploadedPost = await PostModel.create({
            user_id: req.user._id,
            imageUrl: files.map(file => file.url),
            caption,
            location,
            tags
    })

   const user = await userModel.findById(req.user._id);
    user.posts.push(uploadedPost._id);
    await user.save();

    return res.json({ message: "Post created", post: uploadedPost }); 
    } catch (error) {
       console.log(error,"error in controller") 
    }
}

async function getAllPost(req,res) {
  try {
      const allPosts = await PostModel.find({})
                      .populate("user_id", "fullName profilePic") 
                      .populate("comments")
                      .sort({ createdAt: -1 })
     
    if (!allPosts)
      return res.status(404).json({
        message: "Posts not found",
      });                  

    return res.status(200).json({
        message: "Posts fetched successfully",
            allPosts
   })   
  } catch (error) {
       return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }                
}

async function getUserPost(req,res) {
   try {
     const user_id = req.user._id;

    
    if (!user_id)
      return res.status(404).json({
        message: "User Id not found",
      });

   const userPosts = await userModel.findById(user_id).populate("posts")

     return res.status(200).json({
      message: "User posts found",
      userPost: userPosts,
    });
   } catch (error) {
       return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
   }

}

async function updatePost(req,res) {
  try {

   const { caption,location,imageUrl,tags } = req.body;
   const post_id = req.params._id;

   if(!post_id){
      return res.status(400).json({
       message: "bad request"
     })
   }

   const existingPost = await postModel.findById(post_id);
   if(!existingPost){
     return res.status(404).json({
      message: "post not found"
     })
   }

   const updatedPost = await postModel.findByIdAndUpdate(post_id, {
      caption: caption || existingPost.caption,
      location: location || existingPost.location,
      imageUrl: imageUrl || existingPost.imageUrl,
      tags: tags || existingPost.tags
   }, { new: true} )

   return res.status(200).json({
    message: "post update successfully",
    updatedPost
   })

  } catch (error) {
    return res.status(500).json({
      message: "internal server error"
    })
  }
}

async function deletePost(req,res) {
try {

    const post_id = req.params._id;

  if(!post_id){
     return res.status(400).json({
      message: "post_id not found"
     })
  }

  const post = await postModel.findById(post_id);
  if(!post){
    return res.status(404).json({
      message: "post not found"
    })
  }

  await postModel.findByIdAndDelete(post_id)

  
   await userModel.findByIdAndUpdate(
  post.user_id,
  { $pull: { posts: post_id } }
);


  return res.status(200).json({
    message: "post deleted successfully"
  })

} catch (error) {
  return res.status(500).json({
    message: "internal server error"
  })
}
}

async function likePostByUser(req,res) {
try {
    const post_id = req.params.post_id;
  const user_id = req.user._id

  if(!post_id){
     return res.status(404).json({
      message: "postId not found"
     })
  }

  const currentPost = await postModel.findById(post_id);

  if(!currentPost){
     return res.status(404).json({
      messgae: 'post not found'
     })
  }

  if(currentPost.likes.includes(user_id)){
    return res.status(400).json({
      message: "post already liked"
    })
  }

  currentPost.likes.push(user_id)
  currentPost.save();

 return res.status(200).json({
  messasge: "post liked",
   likes: currentPost.likes
 })

} catch (error) {
  return res.status(500).json({
    message: "internal server error"
  })
}

}

async function unLikendPost(req,res) {
try {
    const post_id = req.params.post_id;
  const user_id = req.user._id

  if(!post_id){
    return res.status(404).json({
      message: "postId not found"
    })
  }

  const post = await postModel.findByIdAndUpdate(post_id, {
    $pull: { likes: user_id }},
      { new: true } 
  )

  return res.status(200).json({
    message: "post unliked",
     likes: post.likes
  })
} catch (error) {
  return res.status(500).json({
    message: "internal server error"
  })
}

 

  
}


module.exports = {
    createPost,
    getAllPost,
    getUserPost,
    updatePost,
    deletePost,
    likePostByUser,
    unLikendPost
}

