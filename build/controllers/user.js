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
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const core_1 = require("@sequelize/core");
const Result_1 = __importDefault(require("../utilites/Result"));
const constants_1 = __importDefault(require("../config/constants"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const user = yield user_1.default.findOne({
        where: {
            [core_1.Op.or]: [{ username }, { email }]
        }
    });
    if (user != null) {
        const error = {
            message: constants_1.default.USERNAMEOREMAILUSED,
            name: "Conflict",
        };
        const result = new Result_1.default(error, 409);
        res.status(result.statusCode).send(result.value);
        return;
    }
    const newUser = yield user_1.default.create({
        username,
        password,
        email
    });
    const result = new Result_1.default(newUser, 201);
    res.status(result.statusCode).send(result.value);
});
exports.createUser = createUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const result = yield user_1.default.findAndCountAll({
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
exports.getUsers = getUsers;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const user = yield user_1.default.findByPk(id);
    if (user == null) {
        const error = {
            message: constants_1.default.USERNOTFOUND,
            name: "Id",
        };
        const result = new Result_1.default(error, 404);
        res.status(result.statusCode).send(result.value);
        return;
    }
    const result = new Result_1.default(user, 201);
    res.status(result.statusCode).send(result.value);
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { username, email, password } = req.body;
    const user = yield user_1.default.findByPk(id);
    if (user == null) {
        const error = {
            message: constants_1.default.USERNOTFOUND,
            name: "Id",
        };
        const result = new Result_1.default(error, 404);
        res.status(result.statusCode).send(result.value);
        return;
    }
    const user_ = yield user_1.default.findOne({
        where: {
            [core_1.Op.or]: [{ username }, { email }],
            id: { [core_1.Op.ne]: id }
        }
    });
    if (user_ != null) {
        const error = {
            message: constants_1.default.USERNAMEOREMAILUSED,
            name: "Conflict",
        };
        const result = new Result_1.default(error, 409);
        res.status(result.statusCode).send(result.value);
        return;
    }
    yield user_1.default.update({
        username,
        email,
        password
    }, {
        where: { id }
    });
    res.status(200).json();
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const user = yield user_1.default.findByPk(id);
    if (user == null) {
        const error = {
            message: constants_1.default.USERNOTFOUND,
            name: "Id",
        };
        const result = new Result_1.default(error, 404);
        res.status(result.statusCode).send(result.value);
        return;
    }
    yield user_1.default.destroy({
        where: { id }
    });
    const result = new Result_1.default(user, 200);
    res.status(result.statusCode).send(result.value);
});
exports.deleteUser = deleteUser;