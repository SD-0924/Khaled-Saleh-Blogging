import 'express-async-errors';
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import path from 'path';
import postRouter from "./routers/post";
import Result from "./utilites/Result";
import CONSTANTS from "./config/constants";
import { expressjwt, UnauthorizedError } from 'express-jwt';


export const JWT_SECRET : string = process.env.JWT_SECRET!;
export const authenticateToken = expressjwt({ secret: JWT_SECRET, algorithms: ['HS256'], requestProperty: 'user' }) as RequestHandler;


const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
const mainRouter = express.Router();

app.use("/api",mainRouter);

import userRouter from "./routers/user";

mainRouter.use("/users",userRouter);
mainRouter.use("/posts",postRouter);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof UnauthorizedError) {
        res.status(401).json();
        return;
    }
    const error : Error = {
        message : CONSTANTS.SERVER_ERROR,
        name : "",
    }
    console.log(err);
    const result = new Result<Error>(error,500);
    res.status(result.statusCode).json(result.value);
})

export default app;