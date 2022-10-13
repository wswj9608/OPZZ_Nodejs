"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertIcons = exports.insertProfileIcons = exports.getProfileUrlQuery = void 0;
exports.getProfileUrlQuery = "SELECT image_url FROM profile_icon WHERE SUBSTRING_INDEX(file_name, '.', 1) = ?";
exports.insertProfileIcons = 'INSERT INTO profile_icon SET ?';
const insertIcons = (table) => `INSERT INTO ${table}_icon SET ?`;
exports.insertIcons = insertIcons;
