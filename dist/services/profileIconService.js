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
exports.uploadChampIcons = exports.getProfileUrl = exports.getObject = exports.params = void 0;
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
                    var _a;
                    const image_url = data.split("?")[0];
                    console.log(objects.length);
                    mysql_1.connection.query(models_1.insertProfileIcons, { image_url, file_name: (_a = el.Key) === null || _a === void 0 ? void 0 : _a.split("/")[1] }, (err, result) => {
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
    return new Promise((resolve, reject) => {
        mysql_1.connection.query(models_1.getProfileUrlQuery, fileName, (err, result) => {
            var _a;
            console.log("result= =====>", result);
            if (err) {
                reject(err);
            }
            resolve(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.image_url) ||
                "https://s3.ap-northeast-2.amazonaws.com/opzz.back/profileicon/1.png");
        });
    });
};
exports.getProfileUrl = getProfileUrl;
const uploadChampIcons = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { Location } = yield s3.upload(params).promise();
    console.log(Location);
    mysql_1.connection.query(models_1.insertChampIcons, {
        image_url: Location,
        file_name: Location === null || Location === void 0 ? void 0 : Location.split("champIcon/")[1],
    }, (err, result) => {
        if (err)
            return;
        console.log(result);
    });
    return new Promise((resolve, rejects) => {
        s3.upload(params, (err, data) => {
            if (err)
                return rejects(err);
            resolve(console.log(data));
        });
    });
});
exports.uploadChampIcons = uploadChampIcons;
