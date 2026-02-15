import mongoose from "mongoose";
import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cookieParser from "cookie-parser";


export const isAuthenticated = async(req,res,next)=>{
    try{
        const token = req.cookies.RCookie;
        if(!token) return res.status(500).json({message:'Token not found',success:false});
        const decode = await jwt.verify(token,process.env.JWT_SECRET);
        if(!decode) return res.status(401).json({message:'Invalid token',success:false});
        req.id = decode.userId;
        next();
    }
    catch(error){
        return res.status(500).json({message:'Error Occured in User Authentication',success:false,error});
    }
}