"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const _1 = require(".");
const { host, user, password, schemas } = _1.envData.database;
exports.dbConfig = {
    host: host,
    user: user,
    password: password,
    database: schemas,
};
