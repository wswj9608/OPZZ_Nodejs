"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const summonerControllers_1 = require("../controllers/summonerControllers");
const services_1 = __importDefault(require("../services"));
const router = (0, express_1.Router)();
const { getObject, params } = services_1.default.profileIconService;
router.get("/", summonerControllers_1.getSummonerProfile);
router.get("/profileIcons", (req, res) => {
    getObject(params);
});
router.get("/by-name/:summonerName", (req, res) => {
    console.log(req);
});
exports.default = router;
