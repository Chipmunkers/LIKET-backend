import { Router } from "express";
import { uploadProfileImg } from "../middleware/multer.mw";
import * as userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/', uploadProfileImg(), userController.signup);
userRouter.post('/social', uploadProfileImg(), userController.socailLoginSignUp);

export default userRouter;
