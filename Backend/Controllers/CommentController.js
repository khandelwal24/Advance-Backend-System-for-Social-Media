import mongoose from "mongoose";
import express from 'express'
import { CommentModel, PostModel, UserModel } from "../Models/Post_Like_Comment_Model.js";

export const addComment = async(req,res)=>{
    try{    
        const {content} = req.body;
        const userId = req.id;
        const postId = req.params.id;

        if(!content) return res.status(401).json({message:'Content is Missing',success:false});
        if(!postId) return res.status(401).json({message:'PostId is Missing',success:false});

        const post = await PostModel.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found",success: false,});
        
        const newComment = await CommentModel.create({post:postId,content,commentedBy: userId});
        
        post.comments.push(newComment._id);
        await post.save();

        return res.status(200).json({message:'Comment Added Successfully',success:true,newComment});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:'Error Occured in Adding Comment',success:false,error});
    }
};

export const editComment = async(req,res)=>{
    try{
        const commentId = req.params.id;
        const userId = req.id;
        const {content} = req.body;
        
        let comment = await CommentModel.findById(commentId);
        if(!comment) return res.status(404).json({message:'This Comment does not exists in databse',success:false});

        if(userId.toString() !== comment.commentedBy.toString()) return res.status(500).json({message:'You cannot edit someone else comment',success:false});
        
        comment = await CommentModel.findByIdAndUpdate({_id:commentId},{content},{returnDocument:'after'});
        return res.status(200).json({message:'Comment Edited Successfully',success:true, comment});
    }
    catch(error){
        return res.status(500).json({message:'Bad Request Error Occured in Editing Comment',success:false,error});
        console.log(error);
    }
};

export const getAllCommentsPerPost = async(req,res)=>{
    try{
        const postId = req.params.id;
        const userId = req.id;

        const post = await PostModel.findById(postId);
        if(!post) return res.status(404).json({message:'There is No Post, So No comments from this post'});

        const allcomments = await CommentModel.find({post:postId});
        return res.status(200).json({message:'All Comments of this post fetched Successfully',success:true, allcomments});
    }
    catch(error){
        return res.status(500).json({message:'Error Occured in fetching all Comments', success:false,error});
        console.log(error);
    }
};

export const deleteCommentById = async(req,res)=>{
    try{
        const commentId = req.params.id;
        const userId = req.id;

        const comment = await CommentModel.findById(commentId);
        if(!comment) return res.status(404).json({message:'This comment maybe already deleted from database',success:false});

        if(userId.toString() !== comment.commentedBy.toString()) return res.status(500).json({message:'You cannot delete someone else comment',success:false});

        await CommentModel.findByIdAndDelete({_id:commentId},{returnDocument:'after'});

        const postId = comment.post._id;
        const post = await PostModel.findById(postId);
        if(post){
            post.comments.pop(comment._id);
            await post.save();
        }

        return res.status(200).json({message:'Comment Deleted Successfully',success:true});
    }
    catch(error){
        return res.status(500).json({message:'Error Occured in deleting comment',success:false,error});
        console.log(error);
    }
};

