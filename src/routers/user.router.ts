import { Router } from "express";
import { uploadProfileImg } from "../middleware/multer.mw";
import * as userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/', uploadProfileImg(), userController.signup);

export default userRouter;
