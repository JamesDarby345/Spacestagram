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
        NASAImageLikedByUser: (_root, { date, userId }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const queiredNASAImage = yield db.NASAImages.findOne({
                date: date,
            });
            const queiredUser = yield db.users.findOne({
                _id: userId,
            });
            if (!queiredNASAImage || !queiredUser) {
                throw new Error("failed to find necessary information for NASAImageLikedByUser");
            }
            for (let i = 0; i < queiredUser.likedNASAImages.length; i++) {
                if (queiredUser.likedNASAImages[i].toString() ==
                    queiredNASAImage._id.toString()) {
                    return true;
                }
            }
            return false;
        }),
    },
    Mutation: {
        addNASAImage: (_root, { dateToGet }, { db }) => {
            function fetchNASAData(dateToGet) {
                return __awaiter(this, void 0, void 0, function* () {
                    //checks if date passed in is valid format
                    function isValidDate(dateToGet) {
                        const regEx = /^\d{4}-\d{2}-\d{2}$/; //####-##-## format
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
                    const comments = [];
                    //gets data from NASA API
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
                            comments,
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
        like: (_root, { id, userId }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const image_id = new mongodb_1.ObjectId(id);
            const likedNASAImage = yield db.NASAImages.findOne({
                _id: image_id,
            });
            const userWhoLiked = yield db.users.findOne({
                _id: userId,
            });
            if (!likedNASAImage || !userWhoLiked) {
                throw new Error("failed to like NASAImage " + id);
            }
            for (let i = 0; i < userWhoLiked.likedNASAImages.length; i++) {
                if (userWhoLiked.likedNASAImages[i].toString() == id) {
                    throw new Error("The user has already liked this image " + id);
                }
            }
            userWhoLiked.likedNASAImages =
                userWhoLiked.likedNASAImages.concat(image_id);
            yield db.users.updateOne({ _id: userId }, { $set: { likedNASAImages: userWhoLiked.likedNASAImages } });
            likedNASAImage.likes = ++likedNASAImage.likes;
            yield db.NASAImages.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { likes: likedNASAImage.likes } });
            return likedNASAImage;
        }),
        unlike: (_root, { id, userId }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const image_id = new mongodb_1.ObjectId(id);
            const unlikedNASAImage = yield db.NASAImages.findOne({
                _id: image_id,
            });
            const userWhoUnliked = yield db.users.findOne({
                _id: userId,
            });
            if (!unlikedNASAImage || !userWhoUnliked) {
                throw new Error("failed to unlike NASAImage");
            }
            let userHasLiked = false;
            for (let i = 0; i < userWhoUnliked.likedNASAImages.length; i++) {
                if (userWhoUnliked.likedNASAImages[i].toString() == id) {
                    userHasLiked = true;
                    userWhoUnliked.likedNASAImages.splice(i, 1);
                    break;
                }
            }
            if (!userHasLiked) {
                throw new Error("The user has not liked this image " + id);
            }
            yield db.users.updateOne({ _id: userId }, { $set: { likedNASAImages: userWhoUnliked.likedNASAImages } });
            unlikedNASAImage.likes = --unlikedNASAImage.likes;
            db.NASAImages.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { likes: unlikedNASAImage.likes } });
            return unlikedNASAImage;
        }),
        postComment: (_root, { id, commentText }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(id + " " + commentText);
            const commentedNASAImage = yield db.NASAImages.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!commentedNASAImage) {
                throw new Error("failed to comment NASAImage");
            }
            let commentArr = commentedNASAImage.comments;
            const commentId = new mongodb_1.ObjectId();
            if (commentText.length > 0) {
                if (!commentArr) {
                    commentArr = [commentId];
                }
                else {
                    commentArr.push(commentId);
                }
            }
            db.NASAImages.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { comments: commentArr } });
            return commentedNASAImage;
        }),
    },
    NASAImage: {
        id: (nasa_image) => nasa_image._id.toString(),
    },
};
