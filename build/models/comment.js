"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("../config/sequelize"));
const user_1 = __importDefault(require("./user"));
const post_1 = __importDefault(require("./post"));
const sequelize_2 = require("sequelize");
const Comment = sequelize_1.default.define("Comment", {
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false,
    },
    postId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: post_1.default,
            key: 'id',
        },
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.default,
            key: 'id',
        },
    },
});
exports.default = Comment;
