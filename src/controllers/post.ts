import { Request, Response } from "express";
import Post, { PostInstance } from "../models/post";
import Result, { ResultWithPagination } from "../utilites/Result";
import User from "../models/user";
import CONSTANTS from "../config/constants";
import Category from "../models/category";
import Comment from "../models/comment";

interface CreatePostBody {
    title: string;
    content: string;
    userId: number;
}

export const createPost = async (req: Request<{}, {}, CreatePostBody>, res: Response): Promise<void> => {
    const { title, content, userId } = req.body;
    const user = await User.findByPk(userId);
    if (user == null) {
        const error: Error = {
            message: CONSTANTS.USERNOTFOUND,
            name: "userId",
        }
        const result = new Result<Error>(error, 404);
        res.status(result.statusCode).send(result.value);
        return;
    }
    const post = await Post.create({ title, content, userId });
    const result = new Result<PostInstance>(post, 201);
    res.status(result.statusCode).json(result.value);
};


export const getPosts = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = await Post.findAndCountAll({
        include: [
            { model: User, as: 'author', attributes: ['id', 'username'] },
            { model: Category, as: 'categories', through: { attributes: [] } },
            { model: Comment, as: 'comments', include: [{ model: User, as: 'author', attributes: ['id', 'username'] }] }
        ],
        offset: (page - 1) * (pageSize),
        limit : pageSize
    });
    const paginationResult : ResultWithPagination<PostInstance[]> = {
        results : result.rows,
        page,
        pageSize,
        pages : Math.ceil(result.count / pageSize) || 1,
        totalRecords : result.count
    }
    const resultResponse = new Result<ResultWithPagination<PostInstance[]>>(paginationResult,200);
    res.status(resultResponse.statusCode).json(resultResponse.value);
}