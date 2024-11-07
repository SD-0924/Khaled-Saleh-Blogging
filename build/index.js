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
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./server"));
const sequelize_1 = require("./config/sequelize");
dotenv_1.default.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sequelize_1.sequelizeAuthentication)();
    server_1.default.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`The server started and it's listening at port ${process.env.PORT}`);
    }));
}))();
