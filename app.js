import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.set("view engine", "pug");
app.use("/static", express.static("static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(routes.home, globalRouter);
app.use(routes.api, apiRouter);

const handleListening = () => console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);

export default app;