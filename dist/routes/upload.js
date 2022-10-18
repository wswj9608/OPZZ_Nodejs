"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../controllers/upload");
const router = (0, express_1.Router)();
router.get("/itemInfos", upload_1.getItemInfosSaveToDb);
router.get("/perkInfos", upload_1.getPerkInfosSaveToDb);
exports.default = router;
