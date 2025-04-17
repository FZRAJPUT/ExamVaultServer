import express from 'express';
import {registerUser, userDetails} from '../controllers/usersController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/details', userDetails);

export default userRouter