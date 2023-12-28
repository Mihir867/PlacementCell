import UserController from './users.controllers.js';
import jwtAuthorizer from '../middlewares/jwt.js';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const userRouter = express.Router();
const userController = new UserController();

// Get the directory path using import.meta.url
const currentFilePath = fileURLToPath(import.meta.url);
const publicPath = path.join(dirname(currentFilePath), 'views');


userRouter.get('/signup', (req, res) => {
    res.sendFile(path.join(publicPath, 'signup.html'));
});

userRouter.get('/signin', (req, res) => {
    res.sendFile(path.join(publicPath, 'signin.html'));
});

userRouter.get('/reset-password', (req, res) => {
    res.sendFile(path.join(publicPath, 'reset.html'));
});

userRouter.post('/signup', (req, res) => {
    userController.signUp(req, res);
});

userRouter.post('/signin', (req, res) => {
    userController.Login(req, res);
});

userRouter.post('/reset-password', jwtAuthorizer, async (req, res, next) => {
    await userController.resetPass(req, res, next);
});

userRouter.post('/logout', jwtAuthorizer, (req, res) => {
    userController.logout(req, res);
});

export default userRouter;
