import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bypassRouter from "./bypass";
import supportedRouter from "./supported";
import statsRouter from "./stats";
import apiKeysRouter from "./apiKeys";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bypassRouter);
router.use(supportedRouter);
router.use(statsRouter);
router.use(apiKeysRouter);

export default router;
