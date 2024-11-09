import { NextFunction, Request, Response } from "express";
import User, { UserInstance } from "../models/user";
import Result, { ResultWithPagination } from "../utilites/Result";
import CONSTANTS from "../config/constants";
import { Op } from "sequelize";

interface UserRequestBody {
    username: string;
    email: string;
    password: string;
}

export const createUser = async(req : Request<{},{},UserRequestBody> ,res : Response ,next : NextFunction) => {
    const { username , email , password } = req.body;
    const user = await User.findOne({ 
        where: { 
            [Op.or] : [{ username }, { email }]  
        } 
    });
    if( user != null){
        const error : Error = {
            message : CONSTANTS.USERNAME_OR_EMAIL_USED,
            name : "Conflict",
        }
        const result = new Result<Error>(error,409);
        res.status(result.statusCode).json(result.value);
        return;
    }
    const newUser = await User.create(
        {
            username,
            password,
            email
        }
    );
    const result = new Result<UserInstance>(newUser,201);
    res.status(result.statusCode).json(result.value);
}


export const getUsers = async (req : Request, res : Response, next : NextFunction) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = await User.findAndCountAll({
        offset: (page - 1) * (pageSize),
        limit : pageSize
    });
    const paginationResult : ResultWithPagination<UserInstance[]> = {
        results : result.rows,
        page,
        pageSize,
        pages : Math.ceil(result.count / pageSize) || 1,
        totalRecords : result.count
    }
    const resultResponse = new Result<ResultWithPagination<UserInstance[]>>(paginationResult,200);
    res.status(resultResponse.statusCode).json(resultResponse.value);
}

export const getUser = async (req : Request, res : Response, next : NextFunction) => {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);
    if (user == null){
        const error : Error = {
            message : CONSTANTS.USER_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    const result = new Result<UserInstance>(user,201);
    res.status(result.statusCode).json(result.value);
}


export const updateUser = async (req : Request<any,{},UserRequestBody>, res : Response, next : NextFunction) => {
    const id = Number(req.params.id);
    const { username , email , password } = req.body;
    const user = await User.findByPk(id);
    if (user == null){
        const error : Error = {
            message : CONSTANTS.USER_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    const user_ = await User.findOne({ 
        where: { 
            [Op.or] : [{ username }, { email }],
            id : { [Op.ne] : id }
        } 
    });
    if( user_ != null){
        const error : Error = {
            message : CONSTANTS.USERNAME_OR_EMAIL_USED,
            name : "Conflict",
        }
        const result = new Result<Error>(error,409);
        res.status(result.statusCode).json(result.value);
        return;
    }
    await User.update(
        {
            username,
            email
            ,password
        },
        {
            where : {id}
        }
    )
    res.status(200).json();
}


export const deleteUser = async (req : Request, res : Response, next : NextFunction) => {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);
    if (user == null){
        const error : Error = {
            message : CONSTANTS.USER_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    await User.destroy(
        {
            where : { id }
        }
    );
    const result = new Result<UserInstance>(user,200);
    res.status(result.statusCode).json(result.value);
}