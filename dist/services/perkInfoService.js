"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectPerkInfos = exports.insertPerkInfos = void 0;
const mysql_1 = require("../loaders/mysql");
const models_1 = require("../models");
const insertPerkInfos = (perks) => {
    return new Promise((resolve, reject) => {
        (0, mysql_1.getConnection)((conn) => {
            conn.query(models_1.insertPerks, [perks], (err, result) => {
                if (err) {
                    reject(conn.rollback());
                }
                resolve(result);
            });
            conn.release();
        });
    });
};
exports.insertPerkInfos = insertPerkInfos;
// export const selectPerkInfos = (perkId: number): Promise<SelectPerkType> => {
const selectPerkInfos = (datas) => {
    console.log("perk =====>", datas);
    const perkIds = datas.map((data) => data.perkId);
    return new Promise((resolve, reject) => {
        console.log(perkIds);
        (0, mysql_1.getConnection)((conn) => {
            conn.query("SELECT * FROM perk_info WHERE perk_id in ?", [[perkIds]], (err, result) => {
                if (err)
                    reject(conn.rollback());
                console.log("result -------->", result.length);
                const res = result.map((el) => {
                    return {
                        gameId: datas[0].gameId,
                        perkId: el.perk_id,
                        name: el.name,
                        longDesc: el.long_desc,
                        iconPath: el.icon_path,
                    };
                });
                resolve(result);
            });
        });
    });
};
exports.selectPerkInfos = selectPerkInfos;
