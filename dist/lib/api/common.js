"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.riotClient = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RIOT_BASE_URL = process.env.RIOT_BASE_URL;
const RIOT_API_KEY = process.env.RIOT_API_KEY;
exports.riotClient = axios_1.default.create({
    baseURL: RIOT_BASE_URL,
});
exports.riotClient.interceptors.request.use((req) => {
    const config = req;
    if (!config.headers)
        return;
    if (!RIOT_API_KEY)
        return;
    config.headers["X-Riot-Token"] = RIOT_API_KEY;
    return config;
});
