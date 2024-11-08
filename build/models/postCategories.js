"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const category_1 = __importDefault(require("./category"));
const post_1 = __importDefault(require("./post"));
const PostCategories = sequelize_2.default.define('PostCategories', {
    postId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: post_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: category_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    timestamps: false,
    tableName: "test"
});
exports.default = PostCategories;
