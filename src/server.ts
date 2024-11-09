import 'express-async-errors';
import express, { NextFunction, Request, Response } from "express";
import path from 'path';
import userRouter from "./routers/user";
import postRouter from "./routers/post";
import Result from "./utilites/Result";
import CONSTANTS from "./config/constants";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
const mainRouter = express.Router();

app.use("/api",mainRouter);

mainRouter.use("/users",userRouter);
mainRouter.use("/posts",postRouter);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const error : Error = {
        message : CONSTANTS.SERVER_ERROR,
        name : "",
    }
    const result = new Result<Error>(error,500);
    res.status(result.statusCode).json(result.value);
})

export default app;