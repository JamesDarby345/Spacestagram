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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NASAImageResolvers = void 0;
const mongodb_1 = require("mongodb");
const baseUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apiKey = "mVHFdj3idfIQM8TVfEycg58TSHvoAdTBzGGJfmia";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("node-fetch");
exports.NASAImageResolvers = {
    Query: {
        NASAImages: (_root, _args, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield db.NASAImages.find({}).toArray();
        }),
        NASAImage: (_root, args, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const NASAImageToReturn = yield db.NASAImages.findOne({
                date: args.date,
            });
            if (!NASAImageToReturn) {
                throw new Error("Failed to find NASAImage in database with date " + args.date);
            }
            return NASAImageToReturn;
        }),
    },
    Mutation: {
        addNASAImage: (_root, { dateToGet }, { db }) => {
            function fetchNASAData(dateToGet) {
                return __awaiter(this, void 0, void 0, function* () {
                    //checks if date passed in is valid format
                    function isValidDate(dateToGet) {
                        const regEx = /^\d{4}-\d{2}-\d{2}$/;
                        if (!dateToGet.match(regEx))
                            return false; // Invalid format
                        const d = new Date(dateToGet);
                        //no APOD data before 1995-06-16
                        if (d < new Date("1995-06-16")) {
                            return false;
                        }
                        const dNum = d.getTime();
                        if (!dNum && dNum !== 0)
                            return false; // NaN value, Invalid date
                        return d.toISOString().slice(0, 10) === dateToGet;
                    }
                    if (!isValidDate(dateToGet)) {
                        return dateToGet + " is an invalid date";
                    }
                    //blocks duplicate APOD date requests
                    const checkDb = yield db.NASAImages.findOne({
                        date: dateToGet,
                    });
                    if (checkDb) {
                        return ("The APOD picture for " +
                            dateToGet +
                            " already exists in the database");
                    }
                    let APIurl = "";
                    const randomLikes = Math.floor(Math.random() * 500);
                    if (dateToGet) {
                        APIurl = baseUrl + apiKey + "&date=" + dateToGet;
                    }
                    else {
                        APIurl = baseUrl + apiKey;
                    }
                    const response = yield fetch(APIurl);
                    const data = yield response.json();
                    const date = data.date;
                    const explanation = data.explanation;
                    const media_type = data.media_type;
                    const title = data.title;
                    const url = data.url;
                    const hdurl = data.hdurl;
                    const service_version = data.service_version;
                    if (!date || !explanation || !title || !url) {
                        return "Missing Required Data";
                    }
                    else {
                        yield db.NASAImages.insertOne({
                            _id: new mongodb_1.ObjectId(),
                            likes: randomLikes,
                            date,
                            explanation,
                            media_type,
                            title,
                            url,
                            hdurl,
                            service_version,
                        });
                    }
                    return ("Succesfully added the APOD picture for " +
                        dateToGet +
                        " to the database");
                });
            }
            const responseString = fetchNASAData(dateToGet);
            return responseString;
        },
        like: (_root, { id }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const likedNASAImage = yield db.NASAImages.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!likedNASAImage) {
                throw new Error("failed to like NASAImage" + id);
            }
            likedNASAImage.likes = likedNASAImage.likes + 1;
            db.NASAImages.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { likes: likedNASAImage.likes } });
            return likedNASAImage;
        }),
        unlike: (_root, { id }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const unlikedNASAImage = yield db.NASAImages.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!unlikedNASAImage) {
                throw new Error("failed to unlike NASAImage");
            }
            unlikedNASAImage.likes = unlikedNASAImage.likes - 1;
            db.NASAImages.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { likes: unlikedNASAImage.likes } });
            return unlikedNASAImage;
        }),
    },
    NASAImage: {
        id: (nasa_image) => nasa_image._id.toString(),
    },
};
