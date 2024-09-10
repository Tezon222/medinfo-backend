const postModel = require("../../Model/postsModel")
const patientModel = require("../../Model/Users/patientSchema")
const doctorModel = require("../../Model/Users/doctorSchema")

const getAllPosts = async (req, res)=>{
  try {
      const posts = await postModel.find()
      res.status(200).json(posts)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
}
 
const getPostById = async (req, res)=>{
  try { 
    const post = await postModel.findById(req.params.postId) 

    if (!post) {
        return res.status(404).json({ error: "Post not found." })
    }

    const userId = req.params.userId
    const user = await patientModel.findById(userId) ||  await doctorModel.findById(userId)
     
    if (post.author !== user.firstName) {
      post.views += 1
      await post.save()
    }

    res.status(200).json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const createPost = async(req, res)=>{
    const {title, content} = req.body
    const id = req.params.id
    try{
        const user = await patientModel.findById(id) || await doctorModel.findById(id)
        const author = user.firstName

        const post = new postModel({ author, title, content })
        await post.save()

        res.status(201).json(post)
    }catch(err){
        res.status(400).json({ Error: err.message })
    }
}

const createComment = async(req, res)=>{
    const {commentContent} = req.body
    const commenterId = req.params.commenterId
    try {
        const postId = req.params.postId
        const user = await doctorModel.findById(commenterId) || await patientModel.findById(commenterId) 
        const commentAuthor = user.firstName

        // Check if the user is a doctor
        if (user.role !== "Doctor") {
          return res.status(403).json({ error: "Only doctors can comment." })
        }
    
        const { commentContent } = req.body
        const post = await postModel.findById(postId)
    
        if (!post) {
          return res.status(404).json({ error: "Post not found." })
        }
    
        post.comments.push({ commentAuthor, commentContent })
        post.commentCount ++
        await post.save()
    
        res.status(201).json(post)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
}

module.exports = {createPost, createComment, getAllPosts, getPostById}