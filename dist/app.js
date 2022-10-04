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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const summoner_1 = __importDefault(require("./routes/summoner"));
const loaders_1 = __importDefault(require("./loaders"));
const mongodb_1 = require("mongodb");
const models_1 = require("./models");
const DB_CONNECT_URL = process.env.DB_CONNECT_URL;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    yield (0, loaders_1.default)({ expressApp: app });
    const port = 8080;
    mongodb_1.MongoClient.connect(DB_CONNECT_URL, (err, client) => {
        if (err)
            return console.error(err);
        if (!client)
            return;
        (0, models_1.getCollection)(client);
    });
    dotenv_1.default.config();
    app.use("/summoner", summoner_1.default);
    app.listen(port, () => {
        console.log(`[server]: Server is running at <https://localhost>:${port}`);
    });
});
startServer();
// export const
// export const
// export const
