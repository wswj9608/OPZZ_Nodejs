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
const summoner_1 = require("../controllers/summoner");
const services_1 = __importDefault(require("../services"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const iconService_1 = require("../services/iconService");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
const { getObject, params } = services_1.default.profileIconService;
router.get("/", summoner_1.getSummonerProfile);
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
        const imagePath = files[i].path;
        const blob = (0, fs_1.readFileSync)(imagePath);
        const params = {
            Bucket: "opzz.back",
            Key: `champIcon/${files[i].originalname}`,
            Body: blob,
        };
        yield (0, iconService_1.uploadIcons)(params, "champ");
    }
    res.status(200);
    // console.log(req.files)
}));
router.post("/itemIcons", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files)
        return;
    for (let i = 0; i < files.length; i++) {
        const imagePath = files[i].path;
        const blob = (0, fs_1.readFileSync)(imagePath);
        const params = {
            Bucket: "opzz.back",
            Key: `itemIcon/${files[i].originalname}`,
            Body: blob,
        };
        yield (0, iconService_1.uploadIcons)(params, "item");
    }
    res.status(200);
    // console.log(req.files)
}));
router.post("/spellIcons", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files)
        return;
    for (let i = 0; i < files.length; i++) {
        const imagePath = files[i].path;
        const blob = (0, fs_1.readFileSync)(imagePath);
        const params = {
            Bucket: "opzz.back",
            Key: `spellIcon/${files[i].originalname}`,
            Body: blob,
        };
        yield (0, iconService_1.uploadIcons)(params, "spell");
    }
    res.status(200);
    // console.log(req.files)
}));
exports.default = router;
