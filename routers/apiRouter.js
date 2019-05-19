import express from "express";
import routes from "../routes";
import { registerTodo, modifyTodo, removeTodo, refreshTodo } from "../controller/apiController";

const apiRouter = express.Router();

apiRouter.post(routes.registerTodo, registerTodo);
apiRouter.post(routes.refreshTodo, refreshTodo);
apiRouter.post(routes.removeTodo, removeTodo);
apiRouter.post(routes.modifyTodo, modifyTodo);

export default apiRouter;