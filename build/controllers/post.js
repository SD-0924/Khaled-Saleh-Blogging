"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.createPost = void 0;
const post_1 = __importDefault(require("../models/post"));
const Result_1 = __importDefault(require("../utilites/Result"));
const user_1 = __importDefault(require("../models/user"));
const constants_1 = __importDefault(require("../config/constants"));
const category_1 = __importDefault(require("../models/category"));
const comment_1 = __importDefault(require("../models/comment"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, userId } = req.body;
    const user = yield user_1.default.findByPk(userId);
    if (user == null) {
        const error = {
            message: constants_1.default.USERNOTFOUND,
            name: "userId",
        };
        const result = new Result_1.default(error, 404);
        res.status(result.statusCode).send(result.value);
        return;
    }
    const post = yield post_1.default.create({ title, content, userId });
    const result = new Result_1.default(post, 201);
    res.status(result.statusCode).json(result.value);
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = yield post_1.default.findAndCountAll({
        include: [
            { model: user_1.default, as: 'author', attributes: ['id', 'username'] },
            { model: category_1.default, as: 'categories', through: { attributes: [] } },
            { model: comment_1.default, as: 'comments', include: [{ model: user_1.default, as: 'author', attributes: ['id', 'username'] }] }
        ],
        offset: (page - 1) * (pageSize),
        limit: pageSize
    });
    const paginationResult = {
        results: result.rows,
        page,
        pageSize,
        pages: Math.ceil(result.count / pageSize) || 1,
        totalRecords: result.count
    };
    const resultResponse = new Result_1.default(paginationResult, 200);
    res.status(resultResponse.statusCode).json(resultResponse.value);
});
exports.getPosts = getPosts;
