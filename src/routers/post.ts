import express from "express";
import { body, param, query } from "express-validator";
import { validateResult } from "../utilites/validation";
import { addCategoryToPost, addCommentToPost, createPost, deletePost, getPost, getPostCategories, getPostComments, getPosts, updatePost } from "../controllers/post";

const postRouter = express.Router();

const createPostValidators = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),
    body('content')
        .notEmpty()
        .withMessage('Content is required')
        .isString()
        .withMessage('Content must be a string'),
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt()
        .withMessage('User ID must be an integer'),
    validateResult,
]
postRouter.post("/",createPostValidators,createPost);


const getPostsValidators = [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt(),
  
    query("pageSize")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Page size must be an integer between 1 and 100")
      .toInt(),
    validateResult
]
postRouter.get("/",getPostsValidators,getPosts);

const getPostValidators = [
    param("id").isInt({min: 1}).toInt(),
    validateResult
];

postRouter.get("/:id",getPostValidators,getPost);

const updateUserValidators = [
    param("id").isInt({min: 1}).toInt(),
    body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
    body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
    validateResult
]
postRouter.put("/:id",updateUserValidators,updatePost);


const deletePostValidator = [
    param("id").isInt({min: 1}).toInt(),
    validateResult
]
postRouter.delete("/:id",deletePostValidator,deletePost);


const addCategoryToPostValidator= [
    param("id").isInt({min: 1}).toInt(),
    body('name')
        .notEmpty()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string'),
    validateResult
]
postRouter.post("/:id/categories",addCategoryToPostValidator,addCategoryToPost);


const getPostCategoriesValidators = [
    param("id").isInt({min: 1}).toInt(),
    validateResult
]
postRouter.get("/:id/categories",getPostCategoriesValidators,getPostCategories);

export const addCommentToPostValidator = [
    param("id").isInt({min: 1}).toInt(),
    body('content')
        .notEmpty()
        .withMessage('Comment content is required')
        .isString()
        .withMessage('Content must be a string'),
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt()
        .withMessage('User ID must be an integer'),
    validateResult,
];
postRouter.post("/:id/comments",addCommentToPostValidator,addCommentToPost);


const getPostCommentsValidators = [
    param("id").isInt({min: 1}).toInt(),
    validateResult
]
postRouter.get("/:id/comments",getPostCommentsValidators,getPostComments);

export default postRouter;