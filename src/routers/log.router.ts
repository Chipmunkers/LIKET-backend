import { Router } from "express";
import * as logController from '../controllers/log.controller';

const logRouter = Router();

logRouter.get('/all', logController.getLogAll);

export default logRouter;
