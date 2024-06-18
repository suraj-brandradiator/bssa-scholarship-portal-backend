const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidEmail,
  isValidRole,
  isValidName,
  isValidPassword,
  isValidPhone,
  isValidParagraph
} = require("../validator/validator");



const SchoolModel = require('../model/schoolDataModel')


const getAllSchool = async (req, res) => {
  try {
    console.log('get all school data')
    const SchoolData = await SchoolModel.find({});
    console.log(SchoolData[0], "school data")

    if (!SchoolData) {
      return res.status(404).json({ status: false, message: 'No School found.' });
    }
    res.status(200).json(SchoolData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Internal server error.' });
  }
}
module.exports.getAllSchool = getAllSchool;


const getSchool = (req, res) => {
  try {
    console.log('get check')
    // const SchoolData = await SchoolModel.find({});
    // console.log(SchoolData[0], "school data")

    // if (!SchoolData) {
    // return res.status(404).json({ status: false, message: 'No School found.' });
    // }
    res.status(200).json({ "SchoolData": "hello" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Internal server error.' });
  }
}
module.exports.getSchool = getSchool;


const schoolLogin = async (req, res) => {
  try {
    // console.log(req.body, "REQUEST BODY");
    console.log('req.body---- ---', req.body)
    const { enrollment_no, password } = req.body;
    const privateKeyPath = path.resolve(__dirname, '..', 'KEYS', 'private.pem');
    if (!privateKeyPath) {
      return res.status(500).json({ message: 'something went wrong', status: false });
    }
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    if (!privateKey) {
      return res.status(500).json({ message: 'Directory not found', status: false });
    }
    const credential = enrollment_no;
    const user = await SchoolModel.findByCredentials(credential, password);
    const roleMap = { "webUser": "Tennis" };
    const encryptedRole = roleMap[user.role] || "";
    const userAuth = {
      key: user._id,
      name: user.name,
      imageUrl: user.imageUrl,
      hobbies: encryptedRole,
    };
    const token = jwt.sign(userAuth, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
    });
    user.token = token;
    user.moniterd_ttl = Math.floor(Math.random() * 100000).toString();
    await user.save();
    const encodedString = Buffer.from(token, 'utf-8').toString('base64');
    return res.cookie("token", encodedString, {
      httpOnly: true,
      secure: process.env.NODE_MODE === "PRODUCTION",
      maxAge: 3600000,
      sameSite: process.env.NODE_MODE === "PRODUCTION" ? 'Strict' : 'Lax',  // Adjust based on your environment
      domain: process.env.NODE_MODE === "PRODUCTION" ? '.aiimspatna.edu.in' : undefined,
    }).status(200).json({
      status: "Success",
      data: user._id.toString(),
      message: "Login successful",
      loginTime: Date.now(),
      moniterd_ttl: user.moniterd_ttl
    });
  } catch (e) {
    console.log("inside catch block", e);
    return res.status(400).json({ message: e.message, status: false });
  }
};
module.exports.schoolLogin = schoolLogin;
//  after login get api
const getSchoolFindById = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract 'id' from req.params
    const token = req.cookies.token;
    const publicKeyPath = path.resolve(__dirname, `..`, `KEYS/public.pem`);
    let publicKey;
    try {
      publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', status: false });
    }
    if (!token)
      return res.status(400).send({
        status: false, message: "Token required",
      });
    const getData = await SchoolModel.findOne({ _id: userId, isDeleted: false });
    if (!getData) {
      return res.status(404).json({ error: 'user item not found' });
    }
    const objectIdString = getData._id.toString();
    function atob(base64) {
      return Buffer.from(base64, 'base64').toString('utf-8');
    }
    const decodedString = atob(token);
    // ---------------------------------------
    try {
      decodedToken = jwt.verify(decodedString, publicKey, { algorithms: ['RS256'] });
    } catch (err) {
      console.error(err, '-- Unknown Error Happen');
      return res.status(401).send({
        status: false,
        message: {
          error: 'Token verification failed',
          details: err.message,
        },
      });
    }
    if (!decodedToken) {
      return res.status(401).send({ status: false, message: "token is invalid" });
    }
    if (getData.token !== '') {
      getData.token = decodedString;
    }
    await getData.save();
    let encryptedRole = "";
    if (getData?.role === "Super Admin") {
      encryptedRole = "Chess";
    } else if (getData?.role === "Admin") {
      encryptedRole = "Music";
    } else {
      encryptedRole = "Tennis";
    }
    if (getData) {
      delete getData._doc.role;
      delete getData._doc.email;
      delete getData._doc._id;
      delete getData._doc.isDeleted;
      delete getData._doc.sessionID;
      delete getData._doc.token;
      getData._doc.hobbies = encryptedRole;
    }
    let key = decodedToken.key;
    if (!(key === objectIdString)) {
      return res.status(401).send({ status: false, message: "you are not authorized" });
    }
    return res.status(200).send({ status: "Success", data: getData });
  }
  catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ status: false, msg: error.message });
  }
}
module.exports.getSchoolFindById = getSchoolFindById;

//  for reset password
const schoolPassReset = async (req, res) => {
  try {
    const userId = req.params.userId;
    const employeeId = req.params.employeeId;
    const password = req.body.password
    const newPassword = req.body.newPassword
    const udiseCode = req.body.udiseCode
    const currentMobileNumuber = req.body.currentMobileNumuber
    const currentEmailId = req.body.currentEmailId
    const pinCode = req.body.pinCode
    const user = req.user; // Access the user object
    console.log('req.body from school pass reset', req.body)
    if (user.Udise_Code !== udiseCode) {
      return res
        .status(400)
        .send({ status: false, message: `${udiseCode} this Udise Code doesn't belongs to your school` });
    }
    if (user.Pincode !== pinCode) {
      return res
        .status(400)
        .send({ status: false, message: `${pinCode} this PIN Code Code doesn't belongs to your school` });
    }
    if (!isValidObjectId(employeeId)) {
      return res
        .status(400)
        .send({ status: false, message: `Invalid employeeId ` });
    }
    if (employeeId != userId) {
      return res.status(400).send({ status: false, message: 'You are not authorized' });
    }
    console.log('line 1 ')
    const existingData = await SchoolModel.findOne({
      _id: employeeId,
      isDeleted: false,
    });

    const GeniuneUser = bcrypt.compareSync(password, existingData.password);//password is provided password and
    if (!GeniuneUser) {
      return res.status(400).send({ status: false, message: 'incorrect password' });
    }
    console.log('line 3 ')

    const CheckForSamePassword = bcrypt.compareSync(newPassword, existingData.password);//password is provided password and
    console.log('line 4 ')

    if (CheckForSamePassword == true) {
      return res.status(400).send({ status: false, message: 'You can not use the previous password again' });
    }
    console.log('line 5 ')

    if (existingData.passwordReset == true) {
      return res.status(400).send({ status: false, message: 'Your Password already changed' });
    }
    console.log('line 6 ')

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: `Password Required ` });
    }
    console.log('line 7 ')

    if (password) {
      if (!isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: `Password Required too ` });
      }
      if (!isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message:
            "Previous Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric",
        });
      }
    }
    console.log('line 8 ')

    if (!newPassword) {
      return res
        .status(400)
        .send({ status: false, message: `New Password Required ` });
    }
    console.log('line 9 ')

    if (newPassword) {
      if (!isValid(newPassword)) {
        return res
          .status(400)
          .send({ status: false, message: `New Password Required too ` });
      }
      console.log('line 10 ')

      if (!isValidPassword(newPassword)) {
        return res.status(400).send({
          status: false,
          message:
            "New Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric",
        });
      }

      // if ('4' !== '5') {
      //   return res.status(400).send({ status: false, message: " 4 is not equal to 5" });
      // }

      existingData.password = newPassword;
      existingData.currentEmailId = currentEmailId;
      existingData.currentMobileNumuber = currentMobileNumuber;
      existingData.passwordReset = true;
    }
    await existingData.save();
    return res.status(200).send({ status: true, data: existingData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.schoolPassReset = schoolPassReset;


const schoolFindById = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract 'id' from req.params
    const token = req.cookies.token;
    // const token = req.headers["token"];

    const publicKeyPath = path.resolve(__dirname, `..`, `KEYS/public.pem`);
    let publicKey;
    try {
      publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', status: false });
    }
    if (!token)
      return res.status(400).send({
        status: false, message: "Token required",
      });
    const getData = await SchoolModel.findOne({ _id: userId, isDeleted: false });
    if (!getData) {
      return res.status(404).json({ error: 'user item not found' });
    }
    const objectIdString = getData._id.toString();
    function atob(base64) {
      return Buffer.from(base64, 'base64').toString('utf-8');
    }
    const decodedString = atob(token);
    // ---------------------------------------

    try {
      decodedToken = jwt.verify(decodedString, publicKey, { algorithms: ['RS256'] });
      // console.log(decodedToken, '-- Decoded');
    } catch (err) {
      console.error(err, '-- Unknown Error Happen');
      return res.status(401).send({
        status: false,
        message: {
          error: 'Token verification failed',
          details: err.message,
        },
      });
    }
    if (!decodedToken) {
      return res.status(401).send({ status: false, message: "token is invalid" });
    }
    if (getData.token !== '') {
      getData.token = decodedString;
    }
    await getData.save();
    let encryptedRole = "";
    if (getData?.role === "Super Admin") {
      encryptedRole = "Chess";
    } else if (getData?.role === "Admin") {
      encryptedRole = "Music";
    } else {
      encryptedRole = "Tennis";
    }
    if (getData) {
      // Remove the 'name' field from the object
      delete getData._doc.role;
      delete getData._doc.email;
      delete getData._doc._id;
      delete getData._doc.isDeleted;
      delete getData._doc.sessionID;
      delete getData._doc.token;
      getData._doc.hobbies = encryptedRole;
    }
    let key = decodedToken.key;
    if (!(key === objectIdString)) {
      return res.status(401).send({ status: false, message: "you are not authorized" });
    }
    return res.status(200).send({ status: "Success", data: getData });
  }
  catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ status: false, msg: error.message });
  }
}
module.exports.schoolFindById = schoolFindById;