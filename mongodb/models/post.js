import mongoose from "mongoose";
import dotenv from "dotenv";

let Post = new mongoose.Schema({
    name:{type:String, required:true},
    message:{type:String, required:true},
    image:{type:String, required:true}
});
let ImageSchema = mongoose.model("Post", Post);

export default ImageSchema;