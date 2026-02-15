import express from 'express'
import { Router } from 'express'
import { Addpost, deletePost, editPost, getAllPost, getPostById } from '../Controllers/PostController.js';
import { isAuthenticated } from '../Middleware/Auth.js';
const router = express.Router();

router.route("/add").post(isAuthenticated, Addpost);
router.route('/Allposts').get(isAuthenticated,getAllPost);
router.route('/edit/:id').put(isAuthenticated,editPost);
router.route('/:id').get(isAuthenticated,getPostById);
router.route('/:id').delete(isAuthenticated,deletePost);

export default router;