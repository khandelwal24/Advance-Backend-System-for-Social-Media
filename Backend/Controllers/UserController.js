import mongoose from "mongoose";
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import 'dotenv/config'
import { UserModel } from "../Models/Post_Like_Comment_Model.js";


export const register = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password || password.length<8) return res.status(404).json({message:'Something is Missing or password length < 8', success:false});
        
        let user = await UserModel.findOne({email});
        if(user) return res.status(500).json({message:'This email already exist in database',success:false});

        const hashPass = await bcrypt.hash(password,10);
        user = await UserModel.create({name,email,password:hashPass});
        
        return res.status(200).json({message:'User Registered Successfully',success:true,user});
    }
    catch(error){
        return res.status(500).json({message:'Error Occured in Registration',success:false,error});
    }
};

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(404).json({message:'Something is Missing',success:false});
        
        let user = await UserModel.findOne({email});
        if(!user) return res.status(404).json({message:'This User does not exist',success:false});

        const validate = await bcrypt.compare(password,user.password);
        if(!validate) return res.status(404).json({message:'Wrong Password',success:false});

        const payload = {
            userId: user._id,
            uemail: user.email,
        };

        const options = {
          httpOnly: true,
          sameSite: "strict",
          maxAge: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        };
        
        const token = await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'});

        user = user.toObject();
        user.token = token;
        user.password = undefined;

        return res.cookie('RCookie',token,options).status(200).json({message:'Logged in Successfull',success:true, user});
    }
    catch(error){
        console.log(error);
        return res.status(404).json({message:'Error Occured in Login',success:false,error});
    }
};

export const logout = async(req,res)=>{
    try{
        return res.cookie('RCookie','',{maxAge:0}).status(200).json({message:'User Logged Out Successfully',success:true});
    }
    catch(error){
        return res
          .status(404)
          .json({ message: "Error Occured in Loggin Out", success: false, error });
    }
};

