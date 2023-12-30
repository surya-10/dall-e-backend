import mongoose from "mongoose";
import dotenv from "dotenv";


let user = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    }
});

let UserSchema = mongoose.model("User", user);

export default UserSchema;