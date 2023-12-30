import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/models/post.js"

dotenv.config();

let postRoutes = express.Router();



// uploading images to cloudinary 

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloud_api_key,
    api_secret: process.env.cloud_secret_key
});
postRoutes.get("/", async(req, res)=>{
    try {
        let findAllPost = await Post.find({});
        // console.log("surya");
        // console.log(findAllPost);
        return res.status(200).json({msg:true, data:findAllPost});
    } catch (error) {
        return res.status(500).json({err:error});
    }
})
postRoutes.post("/update", async (req, res) => {
    try {
        let { name, prompt, photo } = req.body;
        let photoUrl = await cloudinary.uploader.upload(photo);

        let updatetoDb = await Post.create({
            name,
            message: prompt,
            image: photoUrl.url
        });
        return res.status(200).json({ msg: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({err:error});
    }
})

export default postRoutes;