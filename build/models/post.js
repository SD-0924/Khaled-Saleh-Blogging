"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const sequelize_1 = __importDefault(require("../config/sequelize"));
const user_1 = __importDefault(require("./user"));
const Post = sequelize_1.default.define("Post", {
    id: {
        type: core_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: core_1.DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: core_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.default,
            key: 'id',
        },
    },
}, {
    tableName: 'posts'
});
exports.default = Post;
