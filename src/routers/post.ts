import express from "express";
import { body, param, query } from "express-validator";
import { validateResult } from "../utilites/validation";
import { createPost, getPosts } from "../controllers/post";

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

export default postRouter;