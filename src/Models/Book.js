// const { string } = require('joi')
const mongoose=require('mongoose')
const Book =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    author_id:{
        type:String,
        required:true
    },
    
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Book',Book)  