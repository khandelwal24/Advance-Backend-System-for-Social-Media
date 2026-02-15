import mongoose from "mongoose";
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cookieParser from "cookie-parser";

import UserR from './Routes/UserRoutes.js'
import PostR from './Routes/PostRoutes.js'
import CommentR from './Routes/CommentRoutes.js'
import LikesR from './Routes/LikesRoutes.js'

const app = express();

// middlewares...
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:['POST','GET','PUT','DELETE'],
}));

// Routes...
app.use('/api/v1/user',UserR);
app.use('/api/v1/post',PostR);
app.use('/api/v1/comment',CommentR);
app.use('/api/v1/likes',LikesR);


app.get('/',(req,res)=>{
    return res.json({message:'Server Is connected bhai sahab',success:true});
})

mongoose.connect(process.env.MONGO_URL,{dbName:'Blog_Babbar'}).then(()=>console.log('MongoDB Connected')).catch(()=>console.log('Error Occured in Connecting DB'));
const port = process.env.PORT || 9000;
app.listen(port,()=>console.log(`Server is Running on port ${port}`));