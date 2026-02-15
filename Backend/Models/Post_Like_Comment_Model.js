import mongoose from "mongoose";
import express from "express";

const CommentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    content: { type: String, required: true },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
export const CommentModel = mongoose.model("Comment", CommentSchema);




// --------------------------------------------------------------------------------------------------------------------------------




const LikeSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
LikeSchema.index({ post: 1, likedBy: 1 }, { unique: true });
export const LikeModel = mongoose.model("Like", LikeSchema);




// --------------------------------------------------------------------------------------------------------------------------------



const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  },
  { timestamps: true },
);
export const PostModel = mongoose.model('Post',PostSchema);




// --------------------------------------------------------------------------------------------------------------------------------


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});
export const UserModel = mongoose.model('User',UserSchema);