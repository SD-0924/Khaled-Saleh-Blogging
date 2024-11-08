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
exports.sequelizeAuthentication = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize({
    dialect: "mssql",
    host: process.env.DBSERVER,
    port: Number(process.env.DBPORT),
    database: process.env.DBNAME,
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    dialectOptions: {
        options: {
            trustServerCertificate: true,
            encrypt: true,
        }
    },
    logging: false
});
const sequelizeAuthentication = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Connecting to the database...");
        yield sequelize.authenticate();
        console.log("Connection with database has been established successfully.");
    }
    catch (exception) {
        console.error('Unable to connect to the database:', exception.message);
    }
});
exports.sequelizeAuthentication = sequelizeAuthentication;
exports.default = sequelize;
