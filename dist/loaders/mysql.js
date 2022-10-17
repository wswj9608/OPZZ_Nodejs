"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const database_1 = require("../config/database");
const connection = mysql_1.default.createConnection(database_1.dbConfig);
const pool = mysql_1.default.createPool(database_1.dbConfig);
const getConnection = (callback) => {
    pool.getConnection((err, conn) => {
        if (!err) {
            callback(conn);
        }
    });
};
exports.getConnection = getConnection;
// connection.beginTransaction()
// connection.commit()
