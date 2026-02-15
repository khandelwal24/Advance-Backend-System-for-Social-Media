import express from 'express'
import mongoose from 'mongoose'
import { UserModel, PostModel, CommentModel, LikeModel } from '../Models/Post_Like_Comment_Model.js'


export const Addpost = async(req,res)=>{
    try{    
        const userId = req.id;
        const {title,description} = req.body;
        if(!title || !description) return res.status(404).json({message:'Something is Missing',success:false});
        const newPost = await PostModel.create({ title, description, author:userId});
        
        const author = await UserModel.findById(userId);
        if(author){
            author.posts.push(newPost._id);
            await author.save();
        }

        return res.status(200).json({message:'Post Created Successfully',success:true, newPost});
    }
    catch(error){
        return res.status(500).json({message:'Error Occured in Adding new post',success:false});
    }
};

export const getAllPost = async(req,res)=>{
    try{
        const AllPosts = await PostModel.find().sort({createdAt:-1});
        return res.status(200).json({message:'All posts fetched Successfully',success:true,AllPosts});
    }
    catch(error){
        console.log(error);
        return res.status(404).json({message:'Error Occured in Fetching data',success:false,error});
    }
};

export const getPostById = async(req,res)=>{
    try{
        const postId = req.params.id;
        const post = await PostModel.findById({_id:postId});
        if(!post) return res.status(404).json({message:'No post found',success:false});
        return res.status(200).json({message:'Post Fetched Successfully',success:true,post});
    }
    catch(error){
        return res.status(500).json({message:'Error Occured in Fetching Post',success:false});
    }
};

export const editPost = async(req,res)=>{
    try{
        const postId = req.params.id;
        const {title,description} = req.body;
        const post = await PostModel.findByIdAndUpdate({_id:postId},{title, description},{returnDocument:'after'});
        if(!post) return res.status(404).json({message:'This Post does not exists',success:false});
        return res.status(200).json({message:'Edited Successfully',success:true,post});
    }
    catch(error){
        return res.status(500).json({message:'Error occured in Updating post',success:false});
    }
};

export const deletePost = async(req,res)=>{
    try{
        const postId = req.params.id;
        const userId = req.id;
        
        let post = await PostModel.findById(postId);
        if(!post) return res.status(404).json({message:'This POst is not found in database',success:false});

        if(userId.toString() !== post.author.toString()) return res.status(500).json({message:'Only the post author can delete the post',success:false});

        await PostModel.findByIdAndDelete({_id:postId},{returnDocument:'after'});
        if(!post) return res.status(404).json({message:'This Post has been already deleted',success:false});

        const author = await UserModel.findById(userId);
        if(author){
            author.posts.pop(post._id);
            await author.save();
        }

        await CommentModel.deleteMany({post:postId});
        await LikeModel.deleteMany({post:postId});

        return res.status(200).json({message:'Post deleted Successfully',success:true});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:'Error Occured while deleting Post',success:false,error});
    }
};
