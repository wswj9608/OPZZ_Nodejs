"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const database_1 = require("../config/database");
exports.connection = mysql_1.default.createConnection(database_1.dbConfig);
exports.connection.connect();
console.log("mysql connect");
