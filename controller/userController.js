const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const validator = require("../validator/validator");
const fs = require('fs');
const path = require('path');
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



// make user without authetication
const userSignUpWithoutauth = async (req, res) => {
  const data = req.body;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const department = req.body.department;
  const punchingid = req.body.punchingid;
  const designation = req.body.designation;
  const createdBy = req.body.createdBy;
  const profileRole = req.body.noIdea;

  const role = req.body.role;
  // console.log(req, "REQQQQ")
  // const imageUrl = req.file.path;

  if (!isValid(createdBy)) {
    return res
      .status(400)
      .send({ status: false, message: `createdBy is required ` });
  }
  if (!isValidName(createdBy)) {
    return res
      .status(400)
      .send({ status: false, message: `${createdBy} is not a valid ` });
  }

  if (!isValid(profileRole)) {
    return res
      .status(400)
      .send({ status: false, message: `profileRole is required ` });
  }

  if (!isValid(name)) {
    return res
      .status(400)
      .send({ status: false, message: `name is required ` });
  }
  if (!isValidName(name)) {
    return res
      .status(400)
      .send({ status: false, message: `${name} is not a valid ` });
  }


  if (!isValid(department)) {
    return res
      .status(400)
      .send({ status: false, message: `department is required ` });
  }
  if (!isValidName(department)) {
    return res
      .status(400)
      .send({ status: false, message: `${department} is not a valid ` });
  }

  if (!email) {
    return res
      .status(400)
      .send({ status: false, message: `email is required ` });
  }
  if (email) {
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `email is required ` });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: `${email} is not a valid ` });
    }
    const checkEmail = await userModel.find({ email, isDeleted: false });
    if (checkEmail.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${email} already exits ` });
    }
  }


  // -----------------check punching id if already exists ---------------------

  if (punchingid) {
    if (!isValid(punchingid)) {
      return res
        .status(400)
        .send({ status: false, message: `punchingid is required ` });
    }

    const checkPunchingId = await userModel.find({ punchingid, isDeleted: false });
    if (checkPunchingId.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${punchingid} already exits ` });
    }
  }





  if (!password) {
    return res
      .status(400)
      .send({ status: false, message: `Password Required ` });
  }
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
          "Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric",
      });
    }
  }
  if (!role) {
    return res.status(400).send({ status: false, message: `role Required ` });
  }
  if (role) {
    if (!isValid(role)) {
      return res
        .status(400)
        .send({ status: false, message: `role Required too` });
    }
    if (!isValidRole(role)) {
      return res
        .status(400)
        .send({ status: false, message: `${role} is not valid ` });
    }
  }
  // if (!imageUrl) {
  //   return res.status(400).send({ status: false, message: `image Required ` });
  // }
  const createUser = await userModel.create({
    name: name,
    email: email,
    punchingid: punchingid,
    designation: designation,
    role: role,
    password: password,
    // imageUrl: imageUrl,
    department: department,
    createdBy: createdBy,

  });
  // console.log("createUser-------", createUser)
  res.status(200).send({ status: true, message: 'User registerd successfully' });
};
module.exports.userSignUpWithoutauth = userSignUpWithoutauth;

// ends here -----



// POST /data - Insert data into MongoDB
const userSignUp = async (req, res) => {
  const data = req.body;
  // console.log('data', data)
  const imageUrl = req.file ? req.file.path : "";
  let { title, name, email, password, role, department, designation, punchingid, createdBy, profileRole, mob } = req.body;
  if (!isValid(createdBy)) {
    return res
      .status(400)
      .send({ status: false, message: `createdBy is required ` });
  }

  if (!isValid(name)) {
    return res
      .status(400)
      .send({ status: false, message: `name is required ` });
  }

  if (!isValid(mob)) {
    return res
      .status(400)
      .send({ status: false, message: `mob is required ` });
  }

  if (isValidPhone(mob)) {
    return res
      .status(400)
      .send({ status: false, message: `${mob} is not a valid` });
  }

  // if (!isValidParagraph(name)) {
  //   return res
  //     .status(400)
  //     .send({ status: false, message: `${name} is not a valid ` });
  // }

  if (!email) {
    return res
      .status(400)
      .send({ status: false, message: `email is not a required ` });
  }
  if (email) {
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `email is required ` });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: `${email} is not a valid ` });
    }
    const checkEmail = await userModel.find({ email, isDeleted: false });
    if (checkEmail.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${email} already exits ` });
    }
  }





  // -----------------check punching id if already exists ---------------------

  if (punchingid) {
    if (!isValid(punchingid)) {
      return res
        .status(400)
        .send({ status: false, message: `punchingid is required ` });
    }

    const checkPunchingId = await userModel.find({ punchingid, isDeleted: false });
    if (checkPunchingId.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${punchingid} already exits ` });
    }
  }






  //  -------- unable for temporary

  // if (!password) {
  //   return res
  //     .status(400)
  //     .send({ status: false, message: `Password Required ` });
  // }

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
          "Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric",
      });
    }
  }

  //  temporary
  if (!password) {
    password = 'ERro$%!@123'
  }
  //    -----------------------

  if (!role) {
    return res.status(400).send({ status: false, message: `role Required ` });
  }
  if (role) {
    if (!isValid(role)) {
      return res
        .status(400)
        .send({ status: false, message: `role Required too` });
    }
    if (!isValidRole(role)) {
      return res
        .status(400)
        .send({ status: false, message: `${role} is not valid ` });
    }
  }
  // if (!imageUrl) {
  //   return res.status(400).send({ status: false, message: `image Required ` });
  // }

  const createUser = await userModel.create({
    title: title,
    name: name,
    email: email,
    punchingid: punchingid,
    department: department,
    designation: designation,
    role: role,
    password: password,
    createdBy: createdBy,
    mob: mob,
    imageUrl: imageUrl,
    adminApprovalStatus: 'Approved',
  });
  // console.log("createUser-------",createUser)
  res.status(200).send({ status: true, message: 'User registerd successfully' });
};
module.exports.userSignUp = userSignUp;


const getUser = async (req, res) => {
  try {
    const department = req.params.admin;

    if (department) {
      const users = await userModel
        .find({ department: department, isDeleted: false })
        .sort({ createdAt: -1 });
      res.json(users);
    }
    else {
      const users = await userModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 });
      res.json(users);
    }

    // res.json(users);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.getUser = getUser;



const getAdminProfile = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Check if the user exists
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: `Invalid UserId` });
    }

    const user = await userModel
      .findOne({ _id: userId, isDeleted: false }, { password: 0, passwordReset: 0, sessionID: 0, moniterd_ttl: 0, token: 0 })
      .lean(); // Use lean() to get plain JavaScript object instead of Mongoose document

    if (!user) {
      return res.status(404).json({ status: false, message: 'User profile id not found' });
    }

    // let encryptedRole = "";
    // if (user?.role === "Super Admin") {
    //   encryptedRole = "Chess";
    // } else if (user?.role === "Admin") {
    //   encryptedRole = "Music";
    // } else {
    //   encryptedRole = "Tennis";
    // }
    // if (user) {
    //   // Remove the 'name' field from the object
    //   delete user._doc.role;

    //   user._doc.hobbies = encryptedRole;
    // }

    return res.status(200).json({ status: true, message: 'Success', data: user });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Internal server error', error });
  }
};

module.exports.getAdminProfile = getAdminProfile;




const UpdateAdminProfile = async (req, res) => {
  try {
    // bookId sent through path params
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: `Invalid UserId ` });
    }
    // book details (to be updated) sent through request body
    const userDetails = req.body;
    // console.log(req.body, "USER details");
    const { name, role, department, modifiedBy, password, punchingid } = userDetails;
    const imageUrl = req.file ? req.file.path : "";
    // const existingData = await userModel.findById(employeeId)
    const existingData = await userModel.findOne({
      _id: userId,
      isDeleted: false,
    });
    if (!existingData) {
      return res
        .status(400)
        .send({ status: false, message: `user not found or deleted` });
    }
    // console.log(modifiedBy, "modi");
    // if (!isValid(modifiedBy)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: `createdBy is required ` });
    // }
    if (modifiedBy) {

      existingData.modifiedBy = modifiedBy;
    }

    if (name) {
      // if (!isValidName(name)) {
      //   return res
      //     .status(400)
      //     .send({ status: false, message: `${name} is not valid Name` });
      // }
      existingData.name = name;
    }

    if (punchingid) {
      existingData.punchingid = punchingid;
    }

    if (department) {
      if (!isValidName(department)) {
        return res
          .status(400)
          .send({ status: false, message: `${department} is not valid Name` });
      }
      existingData.department = department;
    }

    // for temporary basis only for local setup
    // if (password) {
    //   if (!isValid(password)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: `Password Required too ` });
    //   }
    //   if (!isValidPassword(password)) {
    //     return res.status(400).send({
    //       status: false,
    //       message:
    //         "Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric",
    //     });
    //   }
    //   existingData.password = password;
    // }


    if (imageUrl) {
      existingData.imageUrl = imageUrl;
    }
    if (role) {
      if (!isValidRole(role)) {
        return res
          .status(400)
          .send({ status: false, message: `${role} is not valid Role` });
      }
      existingData.role = role;
    }
    // console.log(existingData, "After update");
    await existingData.save();
    return res.status(200).send({ status: true, data: existingData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.UpdateAdminProfile = UpdateAdminProfile;

const getUserDepartmentwise = async (req, res) => {
  try {
    const subDepartmentName = req.params.subDepartmentName;
    if (!subDepartmentName) {
      return res.status(400).json({ message: 'require Department', status: false });
    }
    if (subDepartmentName) {
      const users = await userModel
        .find({ department: subDepartmentName, isDeleted: false })
        .select('name email doctorProfileId designation')
        .sort({ createdAt: -1 });
      res.json(users);
    }
    else {
      const users = await userModel
        .find({ isDeleted: false })
        .sort({ createdAt: -1 });
      res.json(users);
    }

    // res.json(users);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.getUserDepartmentwise = getUserDepartmentwise;


const userFindById = async (req, res) => {
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
    const getData = await userModel.findOne({ _id: userId, isDeleted: false });
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
module.exports.userFindById = userFindById;


const userLogin = async (req, res) => {
  try {
    const { email, password, punchingid } = req.body;
    // console.log('token', req.cookies.token)
    try {

      const privateKeyPath = path.resolve(__dirname, '..', 'KEYS', 'private.pem');
      const privateKey = fs.readFileSync(privateKeyPath, 'utf8');


      // const credential = punchingid || email;
      const credential = { email, punchingid };

      const user = await userModel.findByCredentials(credential, password);

      // console.log('user.superDuperAdminApprovalStatus', user.superDuperAdminApprovalStatus)
      if (user.superDuperAdminApprovalStatus != 'Approved') {
        if (user.superDuperAdminApprovalStatus == 'Pending') {
          return res.status(400).json({ message: 'You are not approved yet', status: false });
        }

        if (user.superDuperAdminApprovalStatus == 'Rejected') {
          return res.status(400).json({ message: 'Your request was Rejected', status: false });
        }
        return res.status(400).json({ message: 'Something unexpected happened', status: false });
      }

      try {
      } catch (saveErr) {
        // console.error('Error saving user sessionID:', saveErr);
        return res.status(500).json({ message: 'Something went wrong', status: false });
      }
      // Continue with sending the response
      // Function to send the response
      let encryptedRole = "";

      if (user?.role === "Super Admin") {
        encryptedRole = "Chess";
      } else if (user?.role === "Admin") {
        encryptedRole = "Music";
      } else {
        encryptedRole = "Tennis";
      }
      const userAuth = {
        key: user?._id,
        name: user?.name,
        imageUrl: user?.imageUrl,
        hobbies: encryptedRole,
      };
      if (!privateKey) {
        return res.status(500).json({ message: 'Directory not found', status: false });
      }
      const token = jwt.sign(userAuth, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h', // Set token expiration (e.g., 1 hour)
      });
      // console.log(user.token.length>=0)
      if (user.token.length >= 0) {
        // console.log(user.token.length)
        user.token = token;
        const newSecretKey = Math.floor(Math.random() * 100000).toString();
        user.moniterd_ttl = newSecretKey;
        await user.save();
      }
      // ---------------------------------------
      // Function to encode a string to Base64
      function btoa(str) {
        return Buffer.from(str, 'utf-8').toString('base64');
      }
      const encodedString = btoa(token);
      // ---------------------------------------
      // res.setHeader("Custom-Header", "Hello, this is a custom header!");

      // console.log(process.env.NODE_MODE === "PRODUCTION", "SURAJ")

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
      return res.status(400).json({ message: e.message, status: false });
    }


  } catch (e) {
    return res.status(400).json({ message: e.message, status: false });
  }
}



module.exports.userLogin = userLogin;

const UpdateUser = async (req, res) => {
  try {
    // bookId sent through path params
    const userId = req.params.userId;
    const employeeId = req.params.employeeId;
    if (!isValidObjectId(employeeId)) {
      return res
        .status(400)
        .send({ status: false, message: `Invalid employeeId ` });
    }
    // book details (to be updated) sent through request body
    const userDetails = req.body;
    const { name, role, department, modifiedBy, password } = userDetails;
    const imageUrl = req.file ? req.file.path : "";
    // const existingData = await userModel.findById(employeeId)
    const existingData = await userModel.findOne({
      _id: employeeId,
      isDeleted: false,
    });
    if (!existingData) {
      return res
        .status(400)
        .send({ status: false, message: `employee not found or deleted` });
    }

    if (!isValid(modifiedBy)) {
      return res
        .status(400)
        .send({ status: false, message: `createdBy is required ` });
    }
    if (modifiedBy) {

      existingData.modifiedBy = modifiedBy;
    }

    if (name) {
      // if (!isValidName(name)) {
      //   return res
      //     .status(400)
      //     .send({ status: false, message: `${name} is not valid Name` });
      // }
      existingData.name = name;
    }

    if (department) {
      if (!isValidName(department)) {
        return res
          .status(400)
          .send({ status: false, message: `${department} is not valid Name` });
      }
      existingData.department = department;
    }

    // for temporary basis only for local setup
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
            "Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric",
        });
      }
      existingData.password = password;
    }


    if (imageUrl) {
      existingData.imageUrl = imageUrl;
    }
    if (role) {
      if (!isValidRole(role)) {
        return res
          .status(400)
          .send({ status: false, message: `${role} is not valid Role` });
      }
      existingData.role = role;
    }
    await existingData.save();
    return res.status(200).send({ status: true, data: existingData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.UpdateUser = UpdateUser;



const UserPassReset = async (req, res) => {
  try {
    const userId = req.params.userId;
    const employeeId = req.params.employeeId;
    const password = req.body.password
    const newPassword = req.body.newPassword
    // console.log('req.body', req.body)
    if (!isValidObjectId(employeeId)) {
      return res
        .status(400)
        .send({ status: false, message: `Invalid employeeId ` });
    }
    if (employeeId != userId) {
      return res.status(400).send({ status: false, message: 'You are not authorized' });
    }
    const existingData = await userModel.findOne({
      _id: employeeId,
      isDeleted: false,
    });
    const GeniuneUser = bcrypt.compareSync(password, existingData.password);//password is provided password and
    if (!GeniuneUser) {
      return res.status(400).send({ status: false, message: 'incorrect password' });
    }
    const CheckForSamePassword = bcrypt.compareSync(newPassword, existingData.password);//password is provided password and

    if (CheckForSamePassword == true) {
      return res.status(400).send({ status: false, message: 'You can not use the previous password again' });
    }
    if (existingData.passwordReset == true) {
      return res.status(400).send({ status: false, message: 'Your Password already changed' });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: `Password Required ` });
    }


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

    if (!newPassword) {
      return res
        .status(400)
        .send({ status: false, message: `New Password Required ` });
    }

    if (newPassword) {
      if (!isValid(newPassword)) {
        return res
          .status(400)
          .send({ status: false, message: `New Password Required too ` });
      }
      if (!isValidPassword(newPassword)) {
        return res.status(400).send({
          status: false,
          message:
            "New Password should be Valid min 8 and max 15 and also contain atleast one lowercase one uppercase one numeric",
        });
      }

      existingData.password = newPassword;
      existingData.passwordReset = true;
    }
    await existingData.save();
    return res.status(200).send({ status: true, data: existingData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.UserPassReset = UserPassReset;


const DeleteUser = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    // const existingData = await userModel.findById(employeeId)
    const existingData = await userModel.findOne({
      _id: employeeId,
      isDeleted: false,
    });
    if (!existingData)
      return res.send({
        code: 400,
        msg: "employee not found or already deleted",
      });
    const updatedDocument = await userModel.findByIdAndUpdate(
      employeeId,
      { isDeleted: true },
      { new: true }
    );
    res.send({ msg: updatedDocument });
  } catch (err) {
    console.error("Error updating data:", err);
    res.send({ error: err });
  }
};
module.exports.DeleteUser = DeleteUser;

const logoutUser = async (req, res) => {
  try {
    const userId = req.params?.userId; // Assuming you have user information stored in req.user
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    // Check if the user is logged in
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }
    // Destroy the session
    const user = await userModel.findOne({ _id: userId, isDeleted: false });
    if (!user) {
      return res.status(400).json({ message: 'user not found.', status: false });
    }
    user.token = ''
    // Save the updated user model
    await user.save();
    // Clear the sessionID cookie
    res.clearCookie("connect.sid");
    // Clear the authentication token cookie
    res.clearCookie("token");
    // Send the success response
    return res.status(200).json({ message: 'Successfully logged out.', status: true });

  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Something went wrong during logout.', status: false });
  }
};

module.exports.logoutUser = logoutUser;




