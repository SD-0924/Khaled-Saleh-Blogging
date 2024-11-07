import express from "express";
import path from 'path';
import userRouter from "./routers/user";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const mainRouter = express.Router();

app.use("/api",mainRouter)

mainRouter.use("/users",userRouter)

export default app;