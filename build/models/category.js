"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const sequelize_1 = __importDefault(require("../config/sequelize"));
const Category = sequelize_1.default.define("Category", {
    id: {
        type: core_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: core_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'categories',
});
exports.default = Category;
