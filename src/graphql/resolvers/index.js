"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const NASAImage_1 = require("./NASAImage");
exports.resolvers = (0, lodash_merge_1.default)(NASAImage_1.NASAImageResolvers);
