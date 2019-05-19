import express from "express";
import routes from "../routes";
import { home } from "../controller/globalController";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

export default globalRouter;