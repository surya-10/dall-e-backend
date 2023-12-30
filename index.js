import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import userRoutes from "./userRoutes/signup.js";

dotenv.config();
let app = express();
app.use(cors());
app.use(express.json({limit:"50mb"}));

let port = process.env.PORT;
app.use("/api/post", postRoutes);
app.use("/api/dalle/image", dalleRoutes);
app.use("/user", userRoutes);



app.get("/", (req, res)=>{
    res.send("Hello, Dall-E")
})
connectDB();
app.listen(port, ()=>console.log("server running on port 8080"));
