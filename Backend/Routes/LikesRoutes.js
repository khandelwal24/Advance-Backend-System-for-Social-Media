import express from "express";
import { Router } from "express";
import { Liked, UnLiked } from "../Controllers/LikeController.js";
import { isAuthenticated } from "../Middleware/Auth.js";

const router = express.Router();

router.route('/Liked/:id').post(isAuthenticated,Liked);
router.route('/UnLiked/:id').post(isAuthenticated,UnLiked);

export default router;
