"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectItemInfos = exports.insertItemInfos = void 0;
const mysql_1 = require("../loaders/mysql");
const models_1 = require("../models");
const insertItemInfos = (items) => {
    return new Promise((resolve, reject) => {
        (0, mysql_1.getConnection)((conn) => {
            conn.query(models_1.insertItems, [items], (err, result) => {
                if (err) {
                    reject(conn.rollback());
                }
                resolve(result);
            });
            conn.release();
        });
    });
};
exports.insertItemInfos = insertItemInfos;
const selectItemInfos = () => {
    return new Promise((resolve, reject) => {
        (0, mysql_1.getConnection)((conn) => {
            conn.query(models_1.selectItems, (err, result) => {
                if (err) {
                    reject(conn.rollback());
                }
                resolve(result);
            });
            conn.release();
        });
    });
};
exports.selectItemInfos = selectItemInfos;
