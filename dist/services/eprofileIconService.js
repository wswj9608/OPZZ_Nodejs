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
                console.log(i);
                s3.getSignedUrl("getObject", { Bucket: "opzz.back", Key: el.Key }, (err, data) => {
                    var _a;
                    mysql_1.connection.query(models_1.insertProfileIcons, { image_url: data, file_name: (_a = el.Key) === null || _a === void 0 ? void 0 : _a.split("/")[1] }, (err, result) => {
                        if (err)
                            return;
                        console.log(result);
                    });
                });
            });
        }
    });
};
exports.getObject = getObject;
const getProfileUrl = (fileName) => {
    console.log(fileName);
    let fileUrl;
    return new Promise((resolve, reject) => {
        mysql_1.connection.query(models_1.getProfileUrlQuery, fileName, (err, result) => {
            if (err) {
                reject(err);
            }
            console.log("result ====>", result);
            fileUrl = result;
            resolve(result);
        });
    });
    // return fileUrl
};
exports.getProfileUrl = getProfileUrl;
