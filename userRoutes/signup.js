import express from "express";
import dotenv from "dotenv";
import User from "../mongodb/models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
dotenv.config();
let userRoutes = express.Router();

userRoutes.post("/signup", async (req, res) => {
    try {
        let { email, password } = req.body;
        // console.log(email)
        let existingUser = await User.findOne({ email: email });
        console.log(existingUser);
        if (!existingUser) {
            let saltValue = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password, saltValue);

            let createUser = await User.create({
                email:email,
                password:hashedPassword
            })
            return res.status(200).json({resp:true, msg:"success"});
        }
        else{
            return res.status(400).json({resp:false, msg:"exists"});
        }

        // console.log(existingUser);
    } catch (error) {
        return res.status(500).json({resp:false, msg:"server error"});
    }
});

userRoutes.post("/login", async(req, res)=>{
    try {
        let {email, password} = req.body;
        let existingUser = await User.findOne({email:email});
        if(!existingUser){
            return res.status(400).json({resp:false, msg:"not exist"})
        }
        else{
            let checkPassword = await bcrypt.compare(password, existingUser.password);
            if(checkPassword){
                return res.status(200).json({resp:true, msg:"success"});
            }
            else{
                return res.status(400).json({resp:false, msg:"incorrect password"});
            }
        }
    } catch (error) {
        return res.status(500).json({resp:false, msg:"server error"});
    }
});

userRoutes.post("/forgot", async(req, res)=>{
    try {
        let {email} = req.body;
        let existingUser = await User.findOne({email:email});
        if(!existingUser){
            return res.status(400).json({resp:false, msg:"not exist"});
        }
        else{
            let token = jwt.sign({id:existingUser._id}, process.env.email_key, {expiresIn:"1800s"})
            let tranport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.email,
                    pass: process.env.pass
                }
            });
            // console.log("surya")
            let mailoption = {
                from:process.env.email,
                to:existingUser.email,
                subject:"Reset password",
                html: `<div><p><b>Hi,</b>
                <h3>We have sent a account activation link. please click on below link to activate your account. This link will be expired after 30 minutes.</h3>
                <a href=https://superlative-kelpie-d6c149.netlify.app/${existingUser._id}/${token} target=_blank>click me</a></div>`
            }
            tranport.sendMail(mailoption, (error, info)=>{
                if(error){
                    console.log("error", error);
                }
                else{
                    return res.status(200).json({resp:true, msg:"email sent"});
                }
            })
        }
    } catch (error) {
        return res.status(500).json({resp:false, msg:"server error"});
    }
});

userRoutes.post("/update/:id/:token", async(req, res)=>{
    try {
        let {id, token} = req.params;
        let {password} = req.body;
        let tokenStatus = true;
        let verifyToken = jwt.verify(token, process.env.email_key, (err, decode)=>{
            if(err){
                tokenStatus=false;
                return res.status(400).json({msg:"expired", resp:false})
            }
            else{
                tokenStatus = true;
            }
        });
        if(tokenStatus){
            let findUser = await User.findById(id);
            console.log(findUser);
            if(!findUser){
                return res.status(400).json({resp:false, msg:"not exist"});
            }
            else{
                let saltValue = await bcrypt.genSalt(10);
                let hashedPassword = await bcrypt.hash(password, saltValue);
                findUser.password = hashedPassword;
                findUser.save();
                return res.status(200).json({resp:true, msg:"updated"})
            }
        }
    } catch (error) {
        
    }
})

export default userRoutes;