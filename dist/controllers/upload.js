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
exports.getPerkInfosSaveToDb = exports.getItemInfosSaveToDb = void 0;
const match_1 = require("../lib/api/match");
const itemInfoService_1 = require("../services/itemInfoService");
const perkInfoService_1 = require("../services/perkInfoService");
const getItemInfosSaveToDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemObject = yield (0, match_1.getItemsToRiot)();
    const items = Object.keys(itemObject).map((itemId, index) => {
        const itemInfo = Object.values(itemObject)[index];
        const id = Number(itemId);
        const { name, description, gold } = itemInfo;
        return [id, name, description, gold.total];
    });
    yield (0, itemInfoService_1.insertItemInfos)(items);
    res.status(200);
    try {
    }
    catch (err) {
        console.error(err);
    }
});
exports.getItemInfosSaveToDb = getItemInfosSaveToDb;
const getPerkInfosSaveToDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const perkRes = yield (0, match_1.getPerksToRiot)();
    const perks = perkRes.map((perk) => {
        const { id, name, longDesc, iconPath } = perk;
        return [id, name, longDesc, iconPath];
    });
    yield (0, perkInfoService_1.insertPerkInfos)(perks);
    res.status(200);
});
exports.getPerkInfosSaveToDb = getPerkInfosSaveToDb;
