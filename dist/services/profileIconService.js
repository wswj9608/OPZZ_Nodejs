"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileUrl = exports.getObject = exports.params = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3_1 = require("../config/s3");
const mysql_1 = require("../loaders/mysql");
const models_1 = require("../models");
aws_sdk_1.default.config.update(s3_1.s3Config);
const s3 = new aws_sdk_1.default.S3();
exports.params = {
    Bucket: "opzz.back",
    ContinuationToken: undefined,
};
let objects = [];
const getObject = (s3Params) => {
    let params = s3Params;
    s3.listObjectsV2(params, (err, data) => {
        var _a;
        objects = objects.concat((_a = data.Contents) === null || _a === void 0 ? void 0 : _a.slice(1));
        if (data.IsTruncated) {
            params.ContinuationToken = data.NextContinuationToken;
            (0, exports.getObject)(params);
        }
        else {
            objects === null || objects === void 0 ? void 0 : objects.forEach((el, i) => {
                if (!el.Key)
                    return;
                s3.getSignedUrl("getObject", { Bucket: "opzz.back", Key: el.Key }, (err, data) => {
                    const image_url = data.split("?")[0];
                    (0, mysql_1.getConnection)((conn) => {
                        var _a;
                        conn.query((0, models_1.insertIcons)("profile"), { image_url, file_name: (_a = el.Key) === null || _a === void 0 ? void 0 : _a.split("/")[1] }, (err, result) => {
                            if (err)
                                return;
                            console.log(result);
                        });
                        conn.release();
                    });
                });
            });
        }
    });
};
exports.getObject = getObject;
const getProfileUrl = (fileName) => {
    return new Promise((resolve, reject) => {
        (0, mysql_1.getConnection)((conn) => {
            conn.query(models_1.getProfileUrlQuery, fileName, (err, result) => {
                var _a;
                // console.log('result= =====>', result)
                if (err) {
                    reject(err);
                }
                resolve(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.image_url) ||
                    "https://s3.ap-northeast-2.amazonaws.com/opzz.back/profileicon/1.png");
            });
            conn.release();
        });
    });
};
exports.getProfileUrl = getProfileUrl;
