import express, { Router } from "express";
import * as authController from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/', authController.login);

export default authRouter;
