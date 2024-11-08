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
const sequelize_1 = __importDefault(require("../config/sequelize"));
const category_1 = __importDefault(require("./category"));
const comment_1 = __importDefault(require("./comment"));
const post_1 = __importDefault(require("./post"));
const user_1 = __importDefault(require("./user"));
// Post belongs to User
user_1.default.hasMany(post_1.default, { foreignKey: 'userId', as: 'posts' });
post_1.default.belongsTo(user_1.default, { foreignKey: 'userId', as: 'author' });
// Post has many Categories (many-to-many)
post_1.default.belongsToMany(category_1.default, { through: 'PostCategories', as: 'categories' });
category_1.default.belongsToMany(post_1.default, { through: 'PostCategories', as: 'posts' });
// Post has many Comments
post_1.default.hasMany(comment_1.default, { foreignKey: 'postId', as: 'comments' });
comment_1.default.belongsTo(post_1.default, { foreignKey: 'postId' });
// Comment belongs to User
user_1.default.hasMany(comment_1.default, { foreignKey: 'userId', as: 'comments' });
comment_1.default.belongsTo(user_1.default, { foreignKey: 'userId', as: 'author' });
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize_1.default.sync();
}))();
