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
const resultPushNull = (items) => {
    let payload = items.slice();
    return new Promise((resolve, reject) => {
        for (let i = 0; i < 7 - items.length; i++) {
            payload.push(null);
        }
        resolve(payload);
    });
};
const selectItemInfos = (items) => {
    return new Promise((resolve, reject) => {
        (0, mysql_1.getConnection)((conn) => {
            conn.query(models_1.selectItems, [[items]], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    reject(conn.rollback());
                }
                const payload = yield resultPushNull(result);
                const accessaryIdx = payload.findIndex((el) => el.item_id === 3340 || el.item_id === 3363 || el.item_id === 3364);
                const accessary = payload.splice(accessaryIdx, 1)[0];
                payload.push(accessary);
                resolve(payload);
            }));
            conn.release();
        });
    });
};
exports.selectItemInfos = selectItemInfos;
