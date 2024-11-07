"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
