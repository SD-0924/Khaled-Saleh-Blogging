"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const express_validator_1 = require("express-validator");
const validation_1 = require("../utilites/validation");
const userRouter = express_1.default.Router();
const userValidators = [
    (0, express_validator_1.body)("email")
        .isEmail().withMessage("Email is required and must be a valid email address."),
    (0, express_validator_1.body)('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be a string')
        .isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
userRouter.post("/", userValidators, validation_1.validateResult, user_1.createUser);
const getUsersValidators = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .toInt(),
    (0, express_validator_1.query)("pageSize")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Page size must be an integer between 1 and 100")
        .toInt()
];
userRouter.get("/", getUsersValidators, validation_1.validateResult, user_1.getUsers);
const getUserValidators = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt()
];
userRouter.get("/:id", getUserValidators, validation_1.validateResult, user_1.getUser);
const updateUserValidators = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt(),
    ...userValidators
];
userRouter.put("/:id", updateUserValidators, validation_1.validateResult, user_1.updateUser);
const deleteUserValidator = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).toInt()
];
userRouter.delete("/:id", deleteUserValidator, validation_1.validateResult, user_1.deleteUser);
exports.default = userRouter;
