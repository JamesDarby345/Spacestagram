"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const NASAImage_1 = require("./NASAImage");
const Viewer_1 = require("./Viewer");
const User_1 = require("./User");
exports.resolvers = (0, lodash_merge_1.default)(NASAImage_1.NASAImageResolvers, Viewer_1.viewerResolvers, User_1.userResolvers);
