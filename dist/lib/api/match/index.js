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
exports.getSummonerMatches = void 0;
const common_1 = require("../common");
const BASE_URL = "https://asia.api.riotgames.com/lol/match/v5/matches";
const getSummonerMatches = (puuid) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("puuid ====>", puuid);
    const { data: matchIds } = yield common_1.riotClient.get(`${BASE_URL}/by-puuid/${puuid}/ids?start=0&count=3
  `);
    let matchInfos = [];
    for (let i = 0; i < matchIds.length; i++) {
        const { data } = yield common_1.riotClient.get(`${BASE_URL}/${matchIds[i]}`);
        matchInfos.push(data.info);
    }
    return matchInfos;
});
exports.getSummonerMatches = getSummonerMatches;
