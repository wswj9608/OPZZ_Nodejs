"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCounter = void 0;
const models_1 = require("../models");
const addCounter = (counterName) => {
    models_1.counters.updateOne({ name: counterName }, { $inc: { total: 1 } }, (err) => {
        if (err)
            return console.error(err);
    });
};
exports.addCounter = addCounter;
