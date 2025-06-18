import postModel from "../../Model/MessageBoard/postsModel.js"
import User from "../../Model/Users/userSchema.js"

export const getAllPosts = async (req, res)=>{
  try {
      const posts = await User.find()
      return  res.status(200).json({
        messsage: "Success!", 
        data: posts
      })
    } catch (err) {
     return res.status(400).json({
        message: "Error", 
        error: err.message
      })
    }
}
 
export const getPostById = async (req, res)=>{
  try { 
    const post = await User.findById(req.params.postId) 

    if (!post) {
      return res.status(404).json({
         message: "Error", 
         error: "Post not found."
       })
    }

    const userId = req.params.userId
    const user = await User.findById(userId)
     
    if (post.author !== user.firstName) {
      post.views += 1
      await post.save()
    }

   return res.status(200).json({
      messsage: "Success!", 
      data: post
    })
  } catch (err) {
   return res.status(400).json({ 
    message: "Error", 
    error: err.message 
   })
  }
}

export const createPost = async(req, res)=>{
    const {title, content} = req.body
    const id = req.params.id
    try{
        const user = await User.findById(id)
        const author = user.firstName

        const post = new postModel({ author, title, content })
        await post.save()

        return res.status(200).json({
        messsage: "Success!", 
        data: post
      })
    }catch(err){
      return res.status(400).json({ 
      message: "Error", 
      error: err.message 
    })
  }
}

export const createComment = async(req, res)=>{
    const {commentContent} = req.body
    const commenterId = req.params.commenterId
    try {
        const postId = req.params.postId
        const user = await User.findById(commenterId)
        const commentAuthor = user.firstName

        // Check if the user is a doctor
        if (user.role !== "Doctor") {
          return res.status(403).json({ 
            message: "Error", 
            error: "Only doctors can comment." 
          })
        }
    
        const { commentContent } = req.body
        const post = await postModel.findById(postId)
    
        if (!post) {
          return res.status(404).json({ 
            message: "Error", 
            error: "Post not found." 
          })
        }
    
        post.comments.push({ commentAuthor, commentContent })
        post.commentCount ++
        await post.save()
    
       return res.status(201).json({
        message: "Success!", 
        data: post
       })
      } catch (error) {
        return res.status(400).json({ 
          message: "Error",
          error: error.message
         })
      }
}
