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
const iconService_1 = require("../services/iconService");
const profileIconService_1 = require("../services/profileIconService");
const utills_1 = require("../utills");
const getSummonerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summonerName = encodeURI(req.query.summonerName);
        const { name, id, puuid, summonerLevel, profileIconId } = yield (0, summoner_1.getSummonerPuuid)(summonerName);
        const riotMatchInfos = yield (0, match_1.getSummonerMatches)(puuid);
        const profileIconImageUrl = yield (0, profileIconService_1.getProfileUrl)(String(profileIconId));
        const matchInfosData = yield Promise.all(riotMatchInfos.map((info) => __awaiter(void 0, void 0, void 0, function* () {
            const gameData = yield Promise.all(info.participants.map((participant) => __awaiter(void 0, void 0, void 0, function* () {
                const { kills, assists, deaths, doubleKills, tripleKills, quadraKills, pentaKills, championName, champLevel, item0, item1, item2, item3, item4, item5, item6, visionWardsBoughtInGame, neutralMinionsKilled, totalMinionsKilled, summoner1Id, summoner2Id, } = participant;
                const summonerSpells = yield (0, iconService_1.getSummonerSpellIcons)(summoner1Id, summoner2Id);
                const { image_url } = yield (0, iconService_1.getChapmIcon)(championName);
                const items = [item0, item1, item2, item3, item4, item5, item6];
                // const itemInfos = await Promise.all(
                //   items.map(async (item, i) => {
                //     if (i > 1) return
                //     return await getItemInfos(item)
                //   })
                // )
                // console.log("item ========>", itemInfos)
                const participantData = {
                    kills,
                    assists,
                    deaths,
                    champion: { image_url, championName },
                    champLevel,
                    items: items,
                    visionWardsBoughtInGame,
                    totalMinionsKilled: totalMinionsKilled + neutralMinionsKilled,
                    minionsPerMinute: (totalMinionsKilled + neutralMinionsKilled) / 60,
                    summonerSpells: [
                        summonerSpells.find((el) => el.spell_id === summoner1Id),
                        summonerSpells.find((el) => el.spell_id === summoner2Id),
                    ],
                };
                return participantData;
            })));
            const matchInfos = {
                gameEndTimestamp: (0, utills_1.timeForToday)(new Date(info.gameEndTimestamp)),
                gameDuration: new Date(info.gameDuration * 1000 + 1000)
                    .toISOString()
                    .slice(14, 19),
                gameData,
            };
            return matchInfos;
        })));
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
