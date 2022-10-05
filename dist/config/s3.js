"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Config = void 0;
const _1 = require(".");
const { region, privateAccessKey, accessKey } = _1.envData.s3;
exports.s3Config = {
    region,
    accessKeyId: accessKey,
    secretAccessKey: privateAccessKey,
};
