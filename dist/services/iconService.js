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
exports.getChapmIcon = exports.getSummonerSpellIcons = exports.uploadIcons = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3_1 = require("../config/s3");
const mysql_1 = require("../loaders/mysql");
const models_1 = require("../models");
aws_sdk_1.default.config.update(s3_1.s3Config);
const s3 = new aws_sdk_1.default.S3();
const uploadIcons = (params, table) => __awaiter(void 0, void 0, void 0, function* () {
    const { Location } = yield s3.upload(params).promise();
    if (table === "item") {
        (0, mysql_1.getConnection)((conn) => {
            conn.query((0, models_1.insertIcons)(table), {
                item_id: Number(Location === null || Location === void 0 ? void 0 : Location.split(`${table}Icon/`)[1].split(".")[0]),
                image_url: Location,
                file_name: Location === null || Location === void 0 ? void 0 : Location.split(`${table}Icon/`)[1],
            }, (err, result) => {
                if (err)
                    return;
                console.log(result);
            });
            conn.release();
        });
        return;
    }
    (0, mysql_1.getConnection)((conn) => {
        conn.query((0, models_1.insertIcons)(table), {
            image_url: Location,
            file_name: Location === null || Location === void 0 ? void 0 : Location.split(`${table}Icon/`)[1],
        }, (err, result) => {
            if (err)
                return;
            console.log(result);
        });
        conn.release();
    });
});
exports.uploadIcons = uploadIcons;
const getSummonerSpellIcons = (spellId1, spellId2) => {
    return new Promise((resolve, reject) => {
        (0, mysql_1.getConnection)((conn) => {
            conn.query(`SELECT image_url,spell_id,file_name FROM spell_icon WHERE spell_id = ? || spell_id = ?`, [String(spellId1), String(spellId2)], (err, result) => {
                if (err)
                    reject(err);
                console.log("spellIcons db result ===========>", result);
                resolve(result);
            });
            conn.release();
        });
    });
};
exports.getSummonerSpellIcons = getSummonerSpellIcons;
const getChapmIcon = (champName) => {
    return new Promise((resolve, reject) => {
        (0, mysql_1.getConnection)((conn) => {
            conn.query(`SELECT image_url FROM champ_icon WHERE SUBSTRING_INDEX(file_name, '.', 1) = ?`, champName, (err, result) => {
                if (err)
                    reject(err);
                console.log("spellIcons db result ===========>", result);
                resolve(result[0]);
            });
            conn.release();
        });
    });
};
exports.getChapmIcon = getChapmIcon;
