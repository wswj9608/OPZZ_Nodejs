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
const match_1 = require("../lib/api/match");
const summoner_1 = require("../lib/api/summoner");
const profileIconService_1 = require("../services/profileIconService");
const getSummonerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summonerName = encodeURI(req.query.summonerName);
        const { name, id, puuid, summonerLevel, profileIconId } = yield (0, summoner_1.getSummonerPuuid)(summonerName);
        const riotMatchInfos = yield (0, match_1.getSummonerMatches)(puuid);
        const profileIconImageUrl = yield (0, profileIconService_1.getProfileUrl)(String(profileIconId));
        const matchInfosData = riotMatchInfos.map((info) => {
            const parti = info.participants.map((participant) => {
                const { kills, assists, deaths, doubleKills, tripleKills, quadraKills, pentaKills, championName, champLevel, item0, item1, item2, item3, item4, item5, item6, visionWardsBoughtInGame, neutralMinionsKilled, totalMinionsKilled, } = participant;
                const participantData = {
                    kills,
                    assists,
                    deaths,
                    championName,
                    champLevel,
                    items: [item0, item1, item2, item3, item4, item5, item6],
                    visionWardsBoughtInGame,
                    totalMinionsKilled: totalMinionsKilled + neutralMinionsKilled,
                    minionsPerMinute: (totalMinionsKilled + neutralMinionsKilled) / 60,
                };
                return participantData;
            });
            const matchInfos = Object.assign({ gameEndTimestamp: new Date(info.gameDuration)
                    .toISOString()
                    .slice(14, 19), gameDuration: new Date(info.gameDuration + 1000)
                    .toISOString()
                    .slice(14, 19) }, parti);
            return matchInfos;
        });
        const resData = {
            name,
            id,
            puuid,
            summonerLevel,
            imageUrl: profileIconImageUrl || null,
            matchInfosData,
        };
        res.json(resData);
    }
    catch (err) {
        console.error(err);
    }
});
exports.getSummonerProfile = getSummonerProfile;
