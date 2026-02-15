import mongoose from "mongoose";
import express from 'express'

import { PostModel, LikeModel } from "../Models/Post_Like_Comment_Model.js";

// Like a post...
export const Liked = async(req,res)=>{
    try{
        const postId = req.params.id;
        const userId = req.id;
        
        const post = await PostModel.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found',success:false});

        const Like = await LikeModel.create({ post: postId, likedBy: userId });

        const updatedPost = await PostModel.findByIdAndUpdate({_id:postId},{$push:{likes:Like._id}},{returnDocument:'after'});

        // post.likes.push(Like._id);
        // await post.save();

        return res.status(200).json({message:'Post Liked Successfully',success:true,updatedPost});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:'Error Occured in Linking the Post - You cannot like same post twice',success:false,error});
    }
};

// UnLike Post
export const UnLiked = async(req,res)=>{
    try{
        const postId = req.params.id;
        const userId = req.id;
        
        const post = await PostModel.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found',success:false});

        const unlike = await LikeModel.findOne({post:postId});
        const likedId = unlike._id;

        const lolId = unlike.likedBy;

        if(lolId.toString() !== userId.toString()) return res.status(500).json({message:'You cannot unlike someOne else Liked Post',success:false});

        const updatedLikeSchema = await LikeModel.findByIdAndDelete({_id:likedId},{returnDocument:'after'});
        const updatedPost = await PostModel.findByIdAndUpdate({_id:postId},{$pull:{likes:unlike._id}},{returnDocument:'after'});

        return res.status(200).json({message:'Post Unliked Successfully',success:true,updatedPost});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:'Error Occured in Unlinking the Post',success:false,error});
    }
};