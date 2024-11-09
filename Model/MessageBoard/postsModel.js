const mongoose =  require("mongoose")
const Schema = mongoose.Schema
const postSchema = new Schema({
    author: { 
        type: String/*mongoose.Schema.Types.ObjectId */,
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String,
        required: true 
    },
    content: { 
        type: String,
        required: true 
    },
    date: { 
        type: Date,
        default: Date.now 
    },
    views: { 
        type: Number,
        default: 0 
    },
    commentCount: {
        type: String,
        default: 0
    },
    comments: [{
        commentAuthor: { 
            type: String/*mongoose.Schema.Types.ObjectId */,
            ref: 'User' 
        },
        commentContent: {
            type: String 
        },
        commentDate: { 
            type: Date,
            default: Date.now
        }
    }]
})

const Post = mongoose.model("Posts", postSchema)
module.exports = Post