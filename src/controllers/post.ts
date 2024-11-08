import { Request, Response } from "express";
import Post, { PostInstance } from "../models/post";
import Result, { ResultWithPagination } from "../utilites/Result";
import User from "../models/user";
import CONSTANTS from "../config/constants";
import Category, { CategoryInstance } from "../models/category";
import Comment, { CommentInstance } from "../models/comment";

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
            message: CONSTANTS.USER_NOT_FOUND,
            name: "userId",
        }
        const result = new Result<Error>(error, 404);
        res.status(result.statusCode).json(result.value);
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
            { model: Category, as: 'categories' , through: { attributes : [] }},
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


export const getPost = async (req: Request, res: Response): Promise<void> => {
    const postId = Number(req.params.id);
    const post = await Post.findByPk(postId, {
        include: [
            { model: User, as: 'author', attributes: ['id', 'username'] },
            { model: Category, as: 'categories', through: { attributes : [] } },
            { 
                model: Comment, 
                as: 'comments', 
                attributes: ['id','content', 'createdAt', 'updatedAt'],
                include: [{ model: User, as: 'author', attributes: ['id', 'username'] }] 
            }
        ],
    });
    if (post == null){
        const error : Error = {
            message : CONSTANTS.POST_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    const result = new Result<PostInstance>(post,200);
    res.status(result.statusCode).json(result.value);
}

interface updatePostBody {
    title: string;
    content: string;
}

export const updatePost = async (req: Request<any,{},updatePostBody>, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { title, content } = req.body;
    const post = await Post.findByPk(id);
    if (post == null){
        const error : Error = {
            message : CONSTANTS.POST_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    await Post.update(
        {
            title,
            content
        },
        {
            where : {id}
        }
    )
    res.status(200).json();
}

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const post = await Post.findByPk(id);
    if (post == null){
        const error : Error = {
            message : CONSTANTS.POST_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    await Post.destroy(
        {
            where : { id }
        }
    );
    const result = new Result<PostInstance>(post,200);
    res.status(result.statusCode).json(result.value);
}


interface AddCategoryBody {
    name: string;
}

export const addCategoryToPost = async (req: Request<any,any,AddCategoryBody>, res: Response): Promise<void> => {
    const postId = Number(req.params.id);
    const { name } = req.body;
    const post = await Post.findByPk(postId);
    if (post == null){
        const error : Error = {
            message : CONSTANTS.POST_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    let category = await Category.findOrCreate({ where: { name } })
    await (category[0] as any).addPost(post);
    const result = new Result(null,201);
    res.status(result.statusCode).json();
}

export const getPostCategories = async (req: Request, res: Response): Promise<void> => {
    const postId = Number(req.params.id);
    const post = await Post.findByPk(postId, {
        include: [{ model: Category, as: 'categories', through: { attributes : [] } }]
    });
    if (post == null){
        const error : Error = {
            message : CONSTANTS.POST_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    const result = new Result<CategoryInstance[]>((post.dataValues as any).categories,200);
    res.status(result.statusCode).json(result.value);
}

interface AddCommentBody{
    content: string;
    userId: number;
}
export const addCommentToPost = async (req: Request<any,any,AddCommentBody>, res: Response): Promise<void> => {
    const postId = Number(req.params.id);
    const { content, userId} = req.body;
    const post = await Post.findByPk(postId);
    if (post == null){
        const error : Error = {
            message : CONSTANTS.POST_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    const user = await User.findByPk(userId);
    if (user == null) {
        const error: Error = {
            message: CONSTANTS.USER_NOT_FOUND,
            name: "userId",
        }
        const result = new Result<Error>(error, 404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    await Comment.create({
        content,
        postId,
        userId
    });
    const result = new Result(null,201);
    res.status(result.statusCode).json();
}


export const getPostComments = async (req: Request, res: Response): Promise<void> => {
    const postId = Number(req.params.id);
    const post = await Post.findByPk(postId, {
        include: [{ 
            model: Comment, 
            as: 'comments', 
            attributes: ['id','content', 'createdAt', 'updatedAt'],
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }] 
        }]
    });
    if (post == null){
        const error : Error = {
            message : CONSTANTS.POST_NOT_FOUND,
            name : "Id",
        }
        const result = new Result<Error>(error,404);
        res.status(result.statusCode).json(result.value);
        return;
    }
    const result = new Result<CommentInstance[]>((post.dataValues as any).comments,200);
    res.status(result.statusCode).json(result.value);
}