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
exports.getLeagueToRiot = void 0;
const common_1 = require("../common");
const BASE_URL = "/lol/league/v4/entries/by-summoner";
const getLeagueToRiot = (summonerId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield common_1.riotClient.get(`${BASE_URL}/${summonerId}`);
    const leagues = data.map((league) => {
        const { queueType, leaguePoints, wins, losses, tier, rank } = league;
        return { queueType, leaguePoints, tier, rank, wins, losses };
    });
    return leagues;
});
exports.getLeagueToRiot = getLeagueToRiot;
