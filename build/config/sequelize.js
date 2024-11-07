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
const core_1 = require("@sequelize/core");
const mssql_1 = require("@sequelize/mssql");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new core_1.Sequelize({
    dialect: mssql_1.MsSqlDialect,
    server: process.env.DBSERVER,
    port: Number(process.env.DBPORT),
    database: process.env.DBNAME,
    authentication: {
        type: "default",
        options: {
            userName: process.env.DBUSERNAME,
            password: process.env.DBPASSWORD,
        }
    },
    trustServerCertificate: true,
    encrypt: true
});
const sequelizeAuthentication = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Connecting to the database...");
        yield sequelize.authenticate();
        console.log("Connection with database has been established successfully.");
        yield sequelize.sync();
    }
    catch (exception) {
        console.error('Unable to connect to the database:', exception.message);
    }
});
exports.sequelizeAuthentication = sequelizeAuthentication;
exports.default = sequelize;
