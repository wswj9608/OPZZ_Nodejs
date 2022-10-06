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
const services_1 = __importDefault(require("../services"));
const router = (0, express_1.Router)();
const { getObject, params } = services_1.default.summoner;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summonerName = encodeURI(req.query.summonerName);
        const { name, id, puuid, summonerLevel, profileIconId } = yield (0, summoner_1.getSummonerPuuid)(summonerName);
        // 소환사명
        // 레벨
        // 소환사 아이콘
        // res.json(summonerInfo)
    }
    catch (err) {
        console.error(err);
    }
    // res.json()
}));
router.get("/profileIcons", (req, res) => {
    getObject(params);
});
router.get("/by-name/:summonerName", (req, res) => {
    console.log(req);
});
exports.default = router;
