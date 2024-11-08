"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentToPostValidator = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validation_1 = require("../utilites/validation");
const post_1 = require("../controllers/post");
const postRouter = express_1.default.Router();
const createPostValidators = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('Content is required')
        .isString()
        .withMessage('Content must be a string'),
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt()
        .withMessage('User ID must be an integer'),
    validation_1.validateResult,
];
postRouter.post("/", createPostValidators, post_1.createPost);
const getPostsValidators = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .toInt(),
    (0, express_validator_1.query)("pageSize")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Page size must be an integer between 1 and 100")
        .toInt(),
    validation_1.validateResult
];
postRouter.get("/", getPostsValidators, post_1.getPosts);
const getPostValidators = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    validation_1.validateResult
];
postRouter.get("/:id", getPostValidators, post_1.getPost);
const updateUserValidators = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('Content is required')
        .isString()
        .withMessage('Content must be a string'),
    validation_1.validateResult
];
postRouter.put("/:id", updateUserValidators, post_1.updatePost);
const deletePostValidator = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    validation_1.validateResult
];
postRouter.delete("/:id", deletePostValidator, post_1.deletePost);
const addCategoryToPostValidator = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Category name is required')
        .isString()
        .withMessage('Category name must be a string'),
    validation_1.validateResult
];
postRouter.post("/:id/categories", addCategoryToPostValidator, post_1.addCategoryToPost);
const getPostCategoriesValidators = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    validation_1.validateResult
];
postRouter.get("/:id/categories", getPostCategoriesValidators, post_1.getPostCategories);
exports.addCommentToPostValidator = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('Comment content is required')
        .isString()
        .withMessage('Content must be a string'),
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt()
        .withMessage('User ID must be an integer'),
    validation_1.validateResult,
];
postRouter.post("/:id/comments", exports.addCommentToPostValidator, post_1.addCommentToPost);
const getPostCommentsValidators = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    validation_1.validateResult
];
postRouter.get("/:id/comments", getPostCommentsValidators, post_1.getPostComments);
exports.default = postRouter;
