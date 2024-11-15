"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.JWT_SECRET = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const post_1 = __importDefault(require("./routers/post"));
const Result_1 = __importDefault(require("./utilites/Result"));
const constants_1 = __importDefault(require("./config/constants"));
const express_jwt_1 = require("express-jwt");
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.authenticateToken = (0, express_jwt_1.expressjwt)({ secret: exports.JWT_SECRET, algorithms: ['HS256'], requestProperty: 'user' });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
const mainRouter = express_1.default.Router();
app.use("/api", mainRouter);
const user_1 = __importDefault(require("./routers/user"));
mainRouter.use("/users", user_1.default);
mainRouter.use("/posts", post_1.default);
app.use((err, req, res, next) => {
    if (err instanceof express_jwt_1.UnauthorizedError) {
        res.status(401).json();
        return;
    }
    const error = {
        message: constants_1.default.SERVER_ERROR,
        name: "",
    };
    console.log(err);
    const result = new Result_1.default(error, 500);
    res.status(result.statusCode).json(result.value);
});
exports.default = app;
