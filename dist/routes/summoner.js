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
const profileIconService_1 = require("../services/profileIconService");
const router = (0, express_1.Router)();
const { getObject, params } = services_1.default.profileIconService;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summonerName = encodeURI(req.query.summonerName);
        const { name, id, puuid, summonerLevel, profileIconId } = yield (0, summoner_1.getSummonerPuuid)(summonerName);
        const profileIconImageUrl = yield (0, profileIconService_1.getProfileUrl)(String(profileIconId));
        const resData = {
            name,
            id,
            puuid,
            summonerLevel,
            imageUrl: profileIconImageUrl || null,
        };
        res.json(resData);
    }
    catch (err) {
        console.error(err);
    }
}));
router.get("/profileIcons", (req, res) => {
    getObject(params);
});
router.get("/by-name/:summonerName", (req, res) => {
    console.log(req);
});
exports.default = router;
