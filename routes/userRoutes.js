import express from 'express';
import {registerUser, uploadProfilePicture, userDetails, verifyOTP} from '../controllers/usersController.js';
import multer from 'multer';

const userRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.post('/register', registerUser);
userRouter.post('/details', userDetails);
userRouter.post('/verify', verifyOTP);
userRouter.post("/upload-profile", upload.single('profileImage'), uploadProfilePicture);

export default userRouter