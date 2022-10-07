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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummonerProfile = void 0;
const summoner_1 = require("../lib/api/summoner");
const profileIconService_1 = require("../services/profileIconService");
const getSummonerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.getSummonerProfile = getSummonerProfile;
