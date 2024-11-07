"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const sequelize_1 = __importDefault(require("../config/sequelize"));
const user_1 = __importDefault(require("./user"));
const post_1 = __importDefault(require("./post"));
const Comment = sequelize_1.default.define("Comment", {
    id: {
        type: core_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: core_1.DataTypes.TEXT,
        allowNull: false,
    },
    postId: {
        type: core_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: post_1.default,
            key: 'id',
        },
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
    tableName: 'comments',
});
exports.default = Comment;
