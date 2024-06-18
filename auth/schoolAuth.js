
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
require('dotenv').config()
const { isValid, isValidObjectId, isValidRequestBody, isValidEmail, isValidName, isValidPassword, isValidPhone } = require('../validator/validator')
const fs = require('fs');
const path = require('path');
const SchoolDataMode = require('../model/schoolDataModel')

//------------------------------------------------------------------------------------------------------------------------------------------------------

const schoolAuthentication = async function (req, res, next) {
    // token sent in request header 'x-api-key'
    // console.log(req.cookies, 'authentication')
    const token = req.cookies.token;
    // token = 'jnh'
    // console.log(token, "COOKIETOkEN in auth")
    // const token = req.headers["token"];
    // console.log(token, "COOKIETOkEN in auth")
    // console.log('hesrereree 1')
    // const secretKey = req.headers["moniterd_ttl"];
    const secretKey = req.params.moniterd_ttl;
    let userId = req.params.userId;

    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: `Invalid id` });
    }
    const user = await SchoolDataMode.findOne({ _id: userId, isDeleted: false });
    // if token is not provided
    // console.log("token from authentication", user.token)
    if (!secretKey)
        return res.status(400).send({ status: false, message: "missing secret key" });
    if (!token)
        return res.status(400).send({ status: false, message: "Token required! Please login to generate token" });
    try {
        // const publicKeyPath = path.resolve(__dirname, '..', `${process.env.PUBLIC_PATH_}`, `${process.env.PUBLIC_key}`);
        const publicKeyPath = path.resolve(__dirname, `..`, `KEYS/public.pem`);
        const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
        // Continue with your code that uses the private key
        if (!publicKey) {
            return res.status(500).json({ message: 'Directory not found', status: false });
        }
        // console.log('hesrereree 3',)
        //
        // ---------------------------------------
        // Function to decode a Base64 string
        function atob(base64) {
            return Buffer.from(base64, 'base64').toString('utf-8');
        }
        const decodedString = atob(token);
        // console.log('hesrereree 4',)

        // ---------------------------------------
        const decodedToken = jwt.verify(decodedString, publicKey, { algorithms: ['RS256'] });
        // console.log(decodedToken, '-- Decoded');
        // console.log('hesrereree 4.1',)

        if (!decodedToken) {
            return res.status(401).json({ message: 'Validation failed', status: false });
        }
        // console.log('hesrereree 5',)

        // console.log('user.token',user.token)
        // console.log(decodedToken, 'decodedToken')
        // Continue with the rest of your logic for a valid token
        let key = decodedToken.key;
        // console.log(key, 'hfcrvihut ',userId )
        if (!(key === userId)) {
            return res.status(401).send({ status: false, message: "you are not authorized" });
        }
        // console.log('hesrereree 6', user)
        // console.log('hesrereree 6.1', user.token)
        if (user.token) {
            if (decodedString !== user.token) {
                return res.status(440).json({ message: 'your session is expired or you logged in another device or tab', status: false, action: 'Session expired' });
            }
        }
        // console.log('hesrereree 7',)

        if (!user.token) {
            return res.status(400).json({ message: 'invalid credentials', status: false });
        }
        // console.log('hesrereree 8',)

        if (user.moniterd_ttl !== secretKey) {
            return res.status(440).send({ status: false, message: "Session expired", action: "You have to logged out" });
        }
        // console.log('hesrereree 9',)



        // Check token expiration
        const currentTimestamp = Math.floor(Date.now() / 1000); // in seconds
        if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
            // Token has expired, redirect to login page
            return res.redirect("https://admin.biharsports.org/auth/login");
        }
        // console.log('Last Line in before next 10')
        next();
        // console.log('hesrereree 11 after next ',)

    } catch (err) {
        res.status(401).send({ status: false, message: err });
    }
};
//------------------------------------------------------------------------------------------------------------------------------------------------------
const authorisation = async function (req, res, next) {
    try {
        // userId sent through path params
        let userId = req.params.userId;

        // CASE-1: userId is empty
        if (userId === ":userId") {
            return res
                .status(400)
                .send({ status: false, message: "Please enter userId to proceed!" });
        }

        // CASE-3: userId does not exist (in our database)
        let user = await SchoolDataMode.findOne({ _id: userId, isDeleted: false }); // database call

        if (!user) {
            return res.status(400).send({
                status: false,
                message: "Sorry user is deleted or not exist!",
            });
        }
        // CASE-4: userId exists but is deleted (isDeleted: true)
        if (user && user.isDeleted == true) {
            return res.status(404).send({
                status: false,
                message: "We are sorry; Given user is deleted", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }

        if (user && user.role !== "Super Admin") {
            return res.status(404).send({
                status: false,
                message: "You are not Authorized to perform this operation", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }
        // Authorisation: userId in token is compared with userId against userId
        if (userId !== user._id.toString()) {
            return res.status(401).send({
                status: false,
                message: `Authorisation Failed! You are logged in ${userId} not as ${user.userId}`,
            });
        }
        else if (userId === user._id.toString()) {//convert userId to string
            next();
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

// --------------------- middlewar to get own data from the db----------------

const getOwnData = async function (req, res, next) {
    try {
        let userId = req.params.userId;
        // CASE-1: userId is empty
        if (userId === ":userId") {
            return res
                .status(400)
                .send({ status: false, message: "Please enter userId to proceed!" });
        }
        // CASE-3: userId does not exist (in our database)
        let user = await SchoolDataMode.findOne({ _id: userId, isDeleted: false }); // database call
        if (!user) {
            return res.status(400).send({
                status: false,
                message: "Sorry user is deleted or not exist!",
            });
        }
        // CASE-4: userId exists but is deleted (isDeleted: true)
        if (user && user.isDeleted == true) {
            return res.status(404).send({
                status: false,
                message: "We are sorry; Given user is deleted", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }

        if (user && user.role !== "Super Admin") {
            return res.status(404).send({
                status: false,
                message: "You are not Authorized to perform this operation", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }
        // Authorisation: userId in token is compared with userId against userId
        if (userId !== user._id.toString()) {
            return res.status(401).send({
                status: false,
                message: `Authorisation Failed! You are logged in ${userId} not as ${user.userId}`,
            });
        }
        else if (userId === user._id.toString()) {//convert userId to string
            next();
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

//  for pass reset
const schoolAuthorisationForDocResetPass = async function (req, res, next) {
    try {
        // userId sent through path params
        let userId = req.params.userId;
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `Invalid id` });
        }
        // CASE-1: userId is empty
        if (userId === ":userId") {
            return res
                .status(400)
                .send({ status: false, message: "Please enter userId to proceed!" });
        }
        // CASE-3: userId does not exist (in our database)
        let user = await SchoolDataMode.findOne({ _id: userId, isDeleted: false }); // database call
        // console.log("USER  ------- CHAECK 1");
        if (!user) {
            return res.status(400).send({
                status: false,
                message: "We are sorry; Given userId does not exist!",
            });
        }
        // console.log("USER  ------- CHAECK 2");

        // CASE-4: userId exists but is deleted (isDeleted: true)
        if (user && user.isDeleted == true) {
            return res.status(400).send({
                status: false,
                message: "We are sorry; Given user is deleted", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }
        // console.log("USER  ------- CHAECK 3");

        // console.log('user.role', user.role)
        if (user && user.role !== "Admin" && user.role !== "Super Admin" && user.role !== "User" && user.role !== "webUser") {
            return res.status(400).send({
                status: false,
                message: "You are not Authorized to perform this operation", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }
        // console.log("USER  ------- CHAECK 4");

        // Authorisation: userId in token is compared with userId against userId
        if (userId !== user._id.toString()) {
            return res.status(401).send({
                status: false,
                message: `Authorisation Failed! You are logged in ${userId} not as ${user.userId}`,
            });
        }
        else if (userId === user._id.toString()) {//convert userId to string
            req.user = user;
            next();
        }
        // console.log("USER  ------- CHAECK 5");

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};


// authorization for Editor ( not implemented yet )
const authorisationEditor = async function (req, res, next) {
    try {
        // userId sent through path params
        let userId = req.params.userId;
        // CASE-1: userId is empty
        if (userId === ":userId") {
            return res
                .status(400)
                .send({ status: false, message: "Please enter userId to proceed!" });
        }
        // CASE-3: userId does not exist (in our database)
        let user = await SchoolDataMode.findOne({ _id: userId, isDeleted: false }); // database call
        if (!user) {
            return res.status(400).send({
                status: false,
                message: "We are sorry; Given userId does not exist!",
            });
        }
        // CASE-4: userId exists but is deleted (isDeleted: true)
        if (user && user.isDeleted == true) {
            return res.status(404).send({
                status: false,
                message: "We are sorry; Given user is deleted", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }
        if (user && user.role !== "Admin" && user.role !== "Super Admin") {
            return res.status(404).send({
                status: false,
                message: "You are not Authorized to perform this operation", // avoided | message: "userId is deleted" | considering privacy (of user)
            });
        }
        // Authorisation: userId in token is compared with userId against userId
        if (userId !== user._id.toString()) {
            return res.status(401).send({
                status: false,
                message: `Authorisation Failed! You are logged in ${userId} not as ${user.userId}`,
            });
        }
        else if (userId === user._id.toString()) {//convert userId to string
            next();
        }
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};
//------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports = { schoolAuthentication, authorisation, authorisationEditor, getOwnData, schoolAuthorisationForDocResetPass };