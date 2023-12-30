import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let connectDB = ()=>{
    mongoose.set("strictQuery", true);

    mongoose.connect(process.env.mongo_str)
    .then(()=>console.log("DataBase connected"))
    .catch((err)=>console.log(err));
}
export default connectDB;