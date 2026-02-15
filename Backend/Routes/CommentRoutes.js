import express from 'express'
import { Router } from 'express'
import { addComment, deleteCommentById, editComment, getAllCommentsPerPost } from '../Controllers/CommentController.js';
import { isAuthenticated } from '../Middleware/Auth.js';

const router = express.Router();

router.route('/:id/add').post(isAuthenticated,addComment);
router.route('/:id/allComments').get(isAuthenticated,getAllCommentsPerPost);
router.route('/edit/:id').put(isAuthenticated,editComment);
router.route('/delete/:id').delete(isAuthenticated,deleteCommentById);

export default router;