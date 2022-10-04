"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = exports.summoners = exports.profileIcons = exports.counters = exports.db = void 0;
const getCollection = (client) => {
    exports.db = client.db('opzz');
    exports.counters = exports.db === null || exports.db === void 0 ? void 0 : exports.db.collection('counters');
    exports.profileIcons = exports.db === null || exports.db === void 0 ? void 0 : exports.db.collection('profileIcons');
    exports.summoners = exports.db === null || exports.db === void 0 ? void 0 : exports.db.collection('summoners');
};
exports.getCollection = getCollection;
