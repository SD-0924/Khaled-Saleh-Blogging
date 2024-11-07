import { NextFunction, Request, Response} from "express";
import { FieldValidationError, validationResult } from "express-validator";

export function validateResult (req : Request,res : Response,next : NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const error: Error = {
            name : (result.array()[0] as FieldValidationError).path,
            message : result.array()[0].msg
        }
        res.status(400).json(error);
        return;
    }
    next();
}
