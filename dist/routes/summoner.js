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
const express_1 = require("express");
const summoner_1 = require("../lib/api/summoner");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const router = (0, express_1.Router)();
console.log("MongoDb Intialized");
aws_sdk_1.default.config.update({
    region: "ap-northeast-2",
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_PRIVATE_ACCESS_KEY,
});
const s3 = new aws_sdk_1.default.S3();
const params = { Bucket: "opzz.back" };
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summonerName = encodeURI(req.query.summonerName);
        const summonerState = yield (0, summoner_1.getSummonerPuuid)(summonerName);
        // s3.listObjectsV2({ Bucket: "opzz.back" }, (err, data) => {
        //   const contents = data.Contents
        //   contents?.forEach((el, i) => {
        //     if (!el.Key) return
        //     s3.getSignedUrl(
        //       "getObject",
        //       { ...params, Key: el.Key },
        //       (err, data) => {
        //         profileIcons.insertOne({
        //           _id: i + 1,
        //           fileName: el.Key?.split("/")[1] as string,
        //           imageUrl: data,
        //         })
        //         addCounter("profileIcons")
        //       }
        //     )
        //   })
        // })
        return res.json(summonerState);
    }
    catch (err) {
        console.error(err);
    }
    // res.json()
}));
router.get("/by-name/:summonerName", (req, res) => {
    console.log(req);
});
exports.default = router;
