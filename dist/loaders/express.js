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
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.default = ({ app }) => __awaiter(void 0, void 0, void 0, function* () {
    const corsOptions = {
        origin: "*",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        preflightContinue: false,
        credentials: true,
        optionsSuccessStatus: 204,
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    return app;
});
