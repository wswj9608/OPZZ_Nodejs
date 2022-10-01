"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const summoner_1 = __importDefault(require("./routes/summoner"));
const app = (0, express_1.default)();
const port = 8080;
const corsOptions = {
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
dotenv_1.default.config();
// var cors = require("cors")
// app.use(cors())
app.use("/summoner", summoner_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`);
});
