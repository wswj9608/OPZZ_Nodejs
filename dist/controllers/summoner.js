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
const itemInfoService_1 = require("../services/itemInfoService");
const perkInfoService_1 = require("../services/perkInfoService");
const profileIconService_1 = require("../services/profileIconService");
const utills_1 = require("../utills");
const getSummonerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchSummonerName = encodeURI(req.query.summonerName);
        const { name, id, puuid, summonerLevel, profileIconId } = yield (0, summoner_1.getSummonerPuuid)(searchSummonerName);
        const riotMatchInfos = yield (0, match_1.getSummonerMatches)(puuid);
        const profileIconImageUrl = yield (0, profileIconService_1.getProfileUrl)(String(profileIconId));
        const matchs = yield Promise.all(riotMatchInfos.map((info) => __awaiter(void 0, void 0, void 0, function* () {
            let primaryPerks = [];
            const gameDatas = yield Promise.all(info.participants.map((participant) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const { kills, assists, deaths, doubleKills, tripleKills, quadraKills, pentaKills, championName, champLevel, item0, item1, item2, item3, item4, item5, item6, perks, visionWardsBoughtInGame, neutralMinionsKilled, summonerName, totalMinionsKilled: minionsKilled, summoner1Id, summoner2Id, } = participant;
                const summonerSpells = yield (0, iconService_1.getSummonerSpellIcons)(summoner1Id, summoner2Id);
                const { image_url } = yield (0, iconService_1.getChapmIcon)(championName);
                const items = yield (0, itemInfoService_1.selectItemInfos)([
                    item0,
                    item1,
                    item2,
                    item3,
                    item4,
                    item5,
                    item6,
                ]);
                perks.styles.forEach((style) => {
                    if (style.description === "primaryStyle") {
                        primaryPerks.push({
                            gameId: info.gameId,
                            perkId: style.selections[0].perk,
                            summonerName,
                        });
                    }
                });
                const primaryPerkId = (_a = perks.styles.find((style) => style.description === "primaryStyle")) === null || _a === void 0 ? void 0 : _a.selections[0].perk;
                const subPerkStyleId = (_b = perks.styles.find((style) => style.description === "subStyle")) === null || _b === void 0 ? void 0 : _b.style;
                const totalMinionsKilled = minionsKilled + neutralMinionsKilled;
                const gameDurationMinute = new Date(info.gameDuration * 1000).getMinutes();
                const minionsPerMinute = Number((totalMinionsKilled / gameDurationMinute).toFixed(1));
                const kda = Number(((kills + assists) / deaths).toFixed(2));
                // const primaryPerk = await selectPerkInfos(primaryPerkId)
                // console.log("primary ========>", primaryPerk)
                // console.log(primaryPerk.id)
                const participantData = {
                    summonerName,
                    kills,
                    assists,
                    deaths,
                    kda,
                    champion: { image_url, championName },
                    champLevel,
                    items,
                    visionWardsBoughtInGame,
                    totalMinionsKilled,
                    minionsPerMinute,
                    primaryPerkId,
                    subPerkStyleId,
                    summonerSpells: [
                        summonerSpells.find((el) => el.spell_id === summoner1Id),
                        summonerSpells.find((el) => el.spell_id === summoner2Id),
                    ],
                };
                return participantData;
            })));
            const primaryPerksInfo = yield (0, perkInfoService_1.selectPerkInfos)(primaryPerks);
            const matchInfos = {
                gameId: info.gameId,
                gameEndTimestamp: (0, utills_1.timeForToday)(new Date(info.gameEndTimestamp)),
                gameDuration: new Date(info.gameDuration * 1000 + 1000)
                    .toISOString()
                    .slice(14, 19),
                gameDatas,
                primaryPerks: primaryPerksInfo,
            };
            return matchInfos;
        })));
        const resData = {
            name,
            id,
            puuid,
            summonerLevel,
            imageUrl: profileIconImageUrl || null,
            matchs,
        };
        res.json(resData);
    }
    catch (err) {
        console.error(err);
    }
});
exports.getSummonerProfile = getSummonerProfile;
