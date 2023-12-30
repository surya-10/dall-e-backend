import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

// let openai = new OpenAI();



import Post from "../mongodb/models/post.js"

dotenv.config();
let dalleRoutes = express.Router();

let openai = new OpenAI({
    apiKey:process.env.api_sk
});

// console.log(openai);

dalleRoutes.get("/", (req, res)=>{
    res.send("hello, dall-e")
});

dalleRoutes.post("/generate", async(req, res)=>{
    let {message} = req.body;
    let response = await openai.images.generate({
        prompt: message,
        n: 1,
        size: "1024x1024",
        response_format:"b64_json"
      });
    //   console.log(response)
      let image_url = response.data[0].b64_json;

      res.send({img:image_url});


})


export default dalleRoutes;