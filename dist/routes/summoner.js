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
const express_1 = require("express");
const summonerControllers_1 = require("../controllers/summonerControllers");
const services_1 = __importDefault(require("../services"));
const profileIconService_1 = require("../services/profileIconService");
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
const { getObject, params } = services_1.default.profileIconService;
router.get("/", summonerControllers_1.getSummonerProfile);
router.get(`/imageUpload`, (req, res) => {
    res.render("imageUpload.ejs");
});
router.get("/profileIcons", (req, res) => {
    getObject(params);
});
router.post("/champIcons", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files)
        return;
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        const imagePath = files[i].path;
        const blob = (0, fs_1.readFileSync)(imagePath);
        const params = {
            Bucket: "opzz.back",
            Key: `champIcon/${files[i].originalname}`,
            Body: blob,
        };
        yield (0, profileIconService_1.uploadChampIcons)(params);
    }
    // console.log(req.files)
}));
router.get("/by-name/:summonerName", (req, res) => {
    console.log(req);
});
exports.default = router;
