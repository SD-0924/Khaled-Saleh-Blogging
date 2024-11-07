import express from "express";
import path from 'path';
import userRouter from "./routers/user";
import postRouter from "./routers/post";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const mainRouter = express.Router();

app.use("/api",mainRouter);

mainRouter.use("/users",userRouter);
mainRouter.use("/posts",postRouter);
export default app;