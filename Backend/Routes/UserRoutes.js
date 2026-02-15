import express from 'express'
import { Router } from 'express'
import { login, logout, register } from '../Controllers/UserController.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route('/logout').get(logout);

export default router;