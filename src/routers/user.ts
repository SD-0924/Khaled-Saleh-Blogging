import express, { RequestHandler } from "express";
import { createUser, deleteUser, getUser, getUsers, loginUser, updateUser } from "../controllers/user";
import { body, param, query } from "express-validator";
import { validateResult } from "../utilites/validation";
import { authenticateToken } from "../server";

const userRouter = express.Router();

const userValidators = [
    body("email")
        .isEmail().withMessage("Email is required and must be a valid email address."),
    body('username')
      .notEmpty().withMessage('Username is required')
      .isString().withMessage('Username must be a string')
      .isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
  
    body('password')
      .notEmpty().withMessage('Password is required')
      .isString().withMessage('Password must be a string')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

userRouter.post("/",userValidators,validateResult,createUser);


userRouter.post("/auth",loginUser)

const getUsersValidators = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be an integer between 1 and 100")
    .toInt()
]
userRouter.get("/",getUsersValidators,validateResult,getUsers);



const getUserValidators = [
  param("id").isInt({min: 1}).toInt()
]
userRouter.get("/:id",authenticateToken,getUserValidators,validateResult,getUser);

const updateUserValidators = [
  param("id").isInt({min: 1}).toInt(),
  ...userValidators
]
userRouter.put("/:id",authenticateToken,updateUserValidators,validateResult,updateUser);

const deleteUserValidator = [
  param("id").isInt({min: 1}).toInt()
]
userRouter.delete("/:id",authenticateToken,deleteUserValidator,validateResult,deleteUser);
export default userRouter;