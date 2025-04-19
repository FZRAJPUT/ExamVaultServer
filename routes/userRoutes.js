import express from 'express';
import {registerUser, userDetails, verifyOTP} from '../controllers/usersController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/details', userDetails);
userRouter.post('/verify', verifyOTP);

export default userRouter