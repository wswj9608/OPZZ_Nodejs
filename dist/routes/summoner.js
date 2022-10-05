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
const mysql_1 = require("../loaders/mysql");
const s3_1 = require("../config/s3");
const router = (0, express_1.Router)();
aws_sdk_1.default.config.update(s3_1.s3Config);
const s3 = new aws_sdk_1.default.S3();
const params = { Bucket: "opzz.back" };
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summonerName = encodeURI(req.query.summonerName);
        const { name, id, puuid, summonerLevel, profileIconId } = yield (0, summoner_1.getSummonerPuuid)(summonerName);
        // 소환사명
        // 레벨
        // 소환사 아이콘
        // s3.listObjectsV2({ Bucket: 'opzz.back' }, (err, data) => {
        //   const contents = data.Contents
        // })
        // res.json(summonerInfo)
    }
    catch (err) {
        console.error(err);
    }
    // res.json()
}));
router.get("/profileIcons", (req, res) => {
    mysql_1.connection.query("SELECT * FROM profile_icon", (err, result) => {
        console.log(result);
    });
    s3.listObjectsV2({ Bucket: "opzz.back" }, (err, data) => {
        const contents = data.Contents;
        console.log(contents === null || contents === void 0 ? void 0 : contents.length);
        // contents?.forEach((el, i) => {
        //   if (!el.Key) return
        //   s3.getSignedUrl("getObject", { ...params, Key: el.Key }, (err, data) => {
        //     const sql = "INSERT INTO profile_icon SET ?"
        //     // OPZZ.query(
        //     //   sql,
        //     //   { image_url: data, file_name: el.Key?.split("/")[1] as string },
        //     //   (err, result) => {
        //     //     if (err) return
        //     //     console.log(result)
        //     //   }
        //     // )
        //   })
        // })
    });
});
router.get("/by-name/:summonerName", (req, res) => {
    console.log(req);
});
exports.default = router;
