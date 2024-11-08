"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("../config/sequelize"));
const user_1 = __importDefault(require("./user"));
const sequelize_2 = require("sequelize");
const Post = sequelize_1.default.define("Post", {
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false,
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
exports.default = Post;
