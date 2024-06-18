const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const validator = require("../validator/validator");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const studentModel = require("../model/studentModel");

const {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidEmail,
  isValidRole,
  isValidName,
  isValidPassword,
  isValidPhone,
  isValidParagraph,
  validateAadhaarNumber,
} = require("../validator/validator");

const studentRegistration = async (req, res) => {
  const user = req.user; // Access the user object
  const imageUrl = req.file ? req.file.path : "";

  const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
  const lastNineDigits = user?.Udise_Code.slice(-9);
  const result = `${lastNineDigits}${randomFourDigits}`;

  let {
    studentName,
    gender,
    aadharNumber,
    fatherName,
    motherName,
    dob,
    caldob,
    ageCategory,
    mobileNumber,
    email,
    accountNumber,
    isActiveAcc,
    level,
    gameName,
    height,
    weight,
    thirtyMFlingStarts,
    standingBroadJump,
    shuttleRun10MX6,
    verticalJump,
    footballBallThrow5No,
    eightHundredMetersRun,
    accountHolderName,
    ifscCode,
    bankName,
    bankBranchName,
  } = req.body;
  // console.log('req.body --- reginster student', req.body)
  // console.log('checking array', Array.isArray(isActiveAcc))
  // const referenceDate = new Date("2007-12-31T00:00:00Z");
  // const doi = new Date(dob);
  // const ageDiffMs = referenceDate - doi;
  // console.log("ageDiffMs", ageDiffMs);

  // const ageDiffYears = ageDiffMs / (1000 * 60 * 60 * 24 * 365.25);
  // console.log("ageDiffYears", ageDiffYears);

  // if (ageDiffYears <= 14) {
  //   if (gender.toLowerCase() === "male") {
  //     // return "U-14 (Boys)";
  //   } else if (gender.toLowerCase() === "female") {
  //     // return "U-14 (Girls)";
  //   } else {
  //     return res.status(400).send({ message: `Error: Invalid gender` });
  //   }
  // } else if (ageDiffYears > 14 && ageDiffYears < 16) {
  //   if (gender.toLowerCase() === "male") {
  //     // return "U-16 (Boys)";
  //   } else if (gender.toLowerCase() === "female") {
  //     // return "U-16 (Girls)";
  //   } else {
  //     return res.status(400).send({ message: `Error: Invalid gender` });
  //   }
  // } else {
  //   return res.status(400).send({ message: `Error: Not eligible` });
  // }

  const allowedLevel = ["", "school", "block", "district", "state"];
  if (isActiveAcc) {
    if (Array.isArray(isActiveAcc)) {
      for (let status of isActiveAcc) {
        if (!allowedLevel.includes(status)) {
          return res
            .status(400)
            .send({ message: `Invalid status value: ${status}` });
        }
      }
    }
  }
  if (level) {
    if (Array.isArray(level)) {
      for (let status of level) {
        if (!allowedLevel.includes(status)) {
          return res
            .status(400)
            .send({ message: `Invalid status value: ${status}` });
        }
      }
    }
  }

  const allowedGame = [
    "",
    "Football",
    "Kabaddi",
    "Cycling",
    "Longjump (Athletics)",
    "cricketBallThrow (Athletics)",
    "60m (run) (Athletics)",
    "600m (run) (Athletics)",
    "100m (run) (Athletics)",
    "800m (run) (Athletics)",
  ];
  if (gameName) {
    if (Array.isArray(gameName)) {
      for (let status of gameName) {
        if (!allowedGame.includes(status)) {
          return res
            .status(400)
            .send({ message: `Invalid status value: ${status}` });
        }
      }
    }
  }
  //  for update the data use this
  // for (let status of newStatuses) {
  //   if (!user.isActiveAcc.includes(status)) {
  //     user.isActiveAcc.push(status);
  //     statusAdded = true;
  //   }
  // }
  // ---------
  // if (!isValid(createdBy)) { return res.status(400).send({ status: false, message: `createdBy is required ` })}
  if (isValidParagraph(studentName)) {
    return res
      .status(400)
      .send({ status: false, message: `studentName is required ` });
  }
  if (isValidParagraph(gender)) {
    return res
      .status(400)
      .send({ status: false, message: `gender is required ` });
  }
  if (isValidParagraph(aadharNumber)) {
    return res
      .status(400)
      .send({ status: false, message: `aadharNumber is required ` });
  }
  if (isValidParagraph(fatherName)) {
    return res
      .status(400)
      .send({ status: false, message: `fatherName is required ` });
  }
  if (isValidParagraph(motherName)) {
    return res
      .status(400)
      .send({ status: false, message: `motherName is required ` });
  }
  if (isValidParagraph(ageCategory)) {
    return res
      .status(400)
      .send({ status: false, message: `ageCategory is required ` });
  }
  if (isValidParagraph(mobileNumber)) {
    return res
      .status(400)
      .send({ status: false, message: `mobileNumber is required ` });
  }
  if (isValidParagraph(email)) {
    return res
      .status(400)
      .send({ status: false, message: `email is required ` });
  }
  if (isValidParagraph(accountNumber)) {
    return res
      .status(400)
      .send({ status: false, message: `accountNumber is required ` });
  }
  if (isValidParagraph(height)) {
    return res
      .status(400)
      .send({ status: false, message: `height is required ` });
  }
  if (isValidParagraph(weight)) {
    return res
      .status(400)
      .send({ status: false, message: `weight is required ` });
  }
  if (isValidParagraph(thirtyMFlingStarts)) {
    return res
      .status(400)
      .send({ status: false, message: `thirtyMFlingStarts is required ` });
  }
  if (isValidParagraph(standingBroadJump)) {
    return res
      .status(400)
      .send({ status: false, message: `standingBroadJump is required ` });
  }
  if (isValidParagraph(shuttleRun10MX6)) {
    return res
      .status(400)
      .send({ status: false, message: `shuttleRun10MX6 is required ` });
  }
  if (isValidParagraph(verticalJump)) {
    return res
      .status(400)
      .send({ status: false, message: `verticalJump is required ` });
  }
  if (isValidParagraph(footballBallThrow5No)) {
    return res
      .status(400)
      .send({ status: false, message: `footballBallThrow5No is required ` });
  }
  if (isValidParagraph(eightHundredMetersRun)) {
    return res
      .status(400)
      .send({ status: false, message: `eightHundredMetersRun is required ` });
  }
  if (isValidParagraph(accountHolderName)) {
    return res
      .status(400)
      .send({ status: false, message: `accountHolderName is required ` });
  }
  if (isValidParagraph(ifscCode)) {
    return res
      .status(400)
      .send({ status: false, message: `ifscCode is required ` });
  }
  if (isValidParagraph(bankName)) {
    return res
      .status(400)
      .send({ status: false, message: `bankName is required ` });
  }
  if (isValidParagraph(bankBranchName)) {
    return res
      .status(400)
      .send({ status: false, message: `bankBranchName is required ` });
  }

  // if (!Array.isArray(isActiveAcc)) {
  //   return res.status(400).send({ message: 'isActiveAcc must be an array' });
  // }

  if (aadharNumber) {
    if (isValidParagraph(aadharNumber)) {
      return res
        .status(400)
        .send({ status: false, message: `${aadharNumber} is not  valid ` });
    }
    const checkAadhar = await studentModel.find({
      aadharNumber,
      isDeleted: false,
    });
    if (checkAadhar.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${aadharNumber} already exits ` });
    }
  }

  const createUser = await studentModel.create({
    Udise_Code: user.Udise_Code,
    studentName: studentName,
    studentId: result,
    gender: gender,
    aadharNumber: aadharNumber,
    fatherName: fatherName,
    motherName: motherName,
    dob: dob,
    caldob: caldob,
    ageCategory: ageCategory,
    mobileNumber: mobileNumber,
    email: email,
    accountNumber: accountNumber,
    isActiveAcc: Array.isArray(isActiveAcc) ? isActiveAcc : [],
    level: Array.isArray(level) ? level : [],
    gameName: Array.isArray(gameName) ? gameName : [],
    height: height,
    weight: weight,
    thirtyMFlingStarts: thirtyMFlingStarts,
    standingBroadJump: standingBroadJump,
    shuttleRun10MX6: shuttleRun10MX6,
    verticalJump: verticalJump,
    footballBallThrow5No: footballBallThrow5No,
    eightHundredMetersRun: eightHundredMetersRun,
    accountHolderName: accountHolderName,
    ifscCode: ifscCode,
    bankName: bankName,
    bankBranchName: bankBranchName,
    createdBy: user?.id,
    adminApprovalStatus: "Approved",
  });
  res
    .status(200)
    .send({ status: true, message: "User registerd successfully" });
};
module.exports.studentRegistration = studentRegistration;

// student for adding battery test an all
const getStudent = async (req, res) => {
  try {
    const user = req.user;
    const users = await studentModel
      .find({
        Udise_Code: user?.Udise_Code,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.getStudent = getStudent;

const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find the student with the specified studentId and isDeleted = false
    const student = await studentModel
      .findOne(
        { _id: studentId, isDeleted: false },
        "Udise_Code studentId selectedInTeam studentName gender updatable aadharNumber fatherName motherName dob caldob ageCategory mobileNumber email accountNumber level gameName height weight thirtyMFlingStarts standingBroadJump shuttleRun10MX6 verticalJump footballBallThrow5No eightHundredMetersRun accountHolderName ifscCode bankName bankBranchName"
      )
      .lean(); // .lean() returns plain JavaScript objects instead of Mongoose documents for faster queries

    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Player not found" });
    }

    res.json({ status: true, data: student });
  } catch (err) {
    res.status(500).send({ status: false, message: "err.message" });
  }
};

module.exports.getStudentById = getStudentById;

const getUnSelectedStudent = async (req, res) => {
  try {
    const user = req.user;
    const users = await studentModel
      .find({
        Udise_Code: user?.Udise_Code,
        selectedInTeam: [],
        updatable:false,
        height: { $ne: "" },
        thirtyMFlingStarts: { $ne: "" },
        standingBroadJump: { $ne: "" },
        shuttleRun10MX6: { $ne: "" },
        verticalJump: { $ne: "" },
        footballBallThrow5No: { $ne: "" },
        eightHundredMetersRun: { $ne: "" },
        weight: { $ne: "" },
        // updatable: false,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.getUnSelectedStudent = getUnSelectedStudent;

// const updateStudentRegistration = async (req, res) => {
//   const user = req.user; // Access the user object
//   const studentId = req.params.studentId
//   if (!isValidObjectId(studentId)) {
//     return res.status(400).send({ status: false, message: `Invalid id` });
// }
//   console.log('student id---- ', studentId)
//   const imageUrl = req.file ? req.file.path : "";
//   let { studentName, gender, aadharNumber, fatherName, motherName, dob, ageCategory, mobileNumber, email, accountNumber,
//     isActiveAcc, level, gameName, height, weight, thirtyMFlingStarts, standingBroadJump, shuttleRun10MX6, verticalJump,
//     footballBallThrow5No, eightHundredMetersRun, accountHolderName, ifscCode, bankName, bankBranchName
//   } = req.body;
//   console.log('req.body --- reginster student', req.body)
//   console.log('checking array', Array.isArray(isActiveAcc))

//   const allowedLevel = ['', 'school', 'block', 'district', 'state'];

//   if (isActiveAcc) {
//     if (Array.isArray(isActiveAcc)) {
//       for (let status of isActiveAcc) {
//         if (!allowedLevel.includes(status)) {
//           return res.status(400).send({ message: `Invalid status value: ${status}` });
//         }
//       }
//     }
//     else {
//       return res.status(400).send({ message: `need array instead 1000001` });
//     }
//   }

//   if (level) {
//     if (Array.isArray(level)) {
//       for (let status of level) {
//         if (!allowedLevel.includes(status)) {
//           return res.status(400).send({ message: `Invalid status value: ${status}` });
//         }
//       }
//     }
//     else {
//       return res.status(400).send({ message: `need array instead 1010110` });
//     }
//   }

//   const allowedGame = ['','Football', 'Kabaddi', 'Cycling', 'Longjump (Athletics)', 'cricketBallThrow (Athletics)', '60m (Athletics)', '600m (Athletics)', '100m (Athletics)', '800m (Athletics)'];
//   if (gameName) {
//     if (Array.isArray(gameName)) {
//       for (let status of gameName) {
//         if (!allowedGame.includes(status)) {
//           return res.status(400).send({ message: `Invalid status value: ${status}` });
//         }
//       }
//     }
//     else {
//       return res.status(400).send({ message: `need array instead 1000000101` });
//     }
//   }

//   //  for update the data use this
//   // for (let status of newStatuses) {
//   //   if (!user.isActiveAcc.includes(status)) {
//   //     user.isActiveAcc.push(status);
//   //     statusAdded = true;
//   //   }
//   // }
//   // ---------
//   // if (!isValid(createdBy)) { return res.status(400).send({ status: false, message: `createdBy is required ` })}
//   if (isValidParagraph(studentName)) { return res.status(400).send({ status: false, message: `studentName is required ` }) }
//   if (isValidParagraph(gender)) { return res.status(400).send({ status: false, message: `gender is required ` }) }
//   if (isValidParagraph(aadharNumber)) { return res.status(400).send({ status: false, message: `aadharNumber is required ` }) }
//   if (isValidParagraph(fatherName)) { return res.status(400).send({ status: false, message: `fatherName is required ` }) }
//   if (isValidParagraph(motherName)) { return res.status(400).send({ status: false, message: `motherName is required ` }) }
//   if (isValidParagraph(ageCategory)) { return res.status(400).send({ status: false, message: `ageCategory is required ` }) }
//   if (isValidParagraph(mobileNumber)) { return res.status(400).send({ status: false, message: `mobileNumber is required ` }) }
//   if (isValidParagraph(email)) { return res.status(400).send({ status: false, message: `email is required ` }) }
//   if (isValidParagraph(accountNumber)) { return res.status(400).send({ status: false, message: `accountNumber is required ` }) }
//   if (isValidParagraph(height)) { return res.status(400).send({ status: false, message: `height is required ` }) }
//   if (isValidParagraph(weight)) { return res.status(400).send({ status: false, message: `weight is required ` }) }
//   if (isValidParagraph(thirtyMFlingStarts)) { return res.status(400).send({ status: false, message: `thirtyMFlingStarts is required ` }) }
//   if (isValidParagraph(standingBroadJump)) { return res.status(400).send({ status: false, message: `standingBroadJump is required ` }) }
//   if (isValidParagraph(shuttleRun10MX6)) { return res.status(400).send({ status: false, message: `shuttleRun10MX6 is required ` }) }
//   if (isValidParagraph(verticalJump)) { return res.status(400).send({ status: false, message: `verticalJump is required ` }) }
//   if (isValidParagraph(footballBallThrow5No)) { return res.status(400).send({ status: false, message: `footballBallThrow5No is required ` }) }
//   if (isValidParagraph(eightHundredMetersRun)) { return res.status(400).send({ status: false, message: `eightHundredMetersRun is required ` }) }
//   if (isValidParagraph(accountHolderName)) { return res.status(400).send({ status: false, message: `accountHolderName is required ` }) }
//   if (isValidParagraph(ifscCode)) { return res.status(400).send({ status: false, message: `ifscCode is required ` }) }
//   if (isValidParagraph(bankName)) { return res.status(400).send({ status: false, message: `bankName is required ` }) }
//   if (isValidParagraph(bankBranchName)) { return res.status(400).send({ status: false, message: `bankBranchName is required ` }) }

//   if (email) {
//     if (!isValidEmail(email)) {
//       return res
//         .status(400)
//         .send({ status: false, message: `${email} is not a valid ` });
//     }
//     const checkEmail = await studentModel.find({ email, isDeleted: false });
//     if (checkEmail.length > 0) {
//       return res
//         .status(400)
//         .send({ status: false, message: `${email} already exits ` });
//     }
//   }

//   const existingData = await studentModel.findOne({
//     _id: studentId,
//     isDeleted: false,
//   });
//   if (!existingData) {
//     return res
//       .status(400)
//       .send({ status: false, message: `user not found or deleted` });
//   }

//   if (user) {
//     existingData.Udise_Code = user?.Udise_Code;
//   }
//   if (studentName) {
//     existingData.studentName = studentName;
//   }
//   if (gender) {
//     existingData.gender = gender;
//   }
//   if (aadharNumber) {
//     existingData.aadharNumber = aadharNumber;
//   }
//   if (fatherName) {
//     existingData.fatherName = fatherName;
//   }
//   if (motherName) {
//     existingData.motherName = motherName;
//   }
//   if (dob) {
//     existingData.dob = dob;
//   }
//   if (ageCategory) {
//     existingData.ageCategory = ageCategory;
//   }
//   if (mobileNumber) {
//     existingData.mobileNumber = mobileNumber;
//   }
//   if (email) {
//     existingData.email = email;
//   }
//   if (accountNumber) {
//     existingData.accountNumber = accountNumber;
//   }

//   if (Array.isArray(isActiveAcc)) {
//     for (let status of isActiveAcc) {
//       if (!existingData.isActiveAcc.includes(status)) {
//         existingData.isActiveAcc.push(status);
//       }
//     };
//   }

//   if (Array.isArray(level)) {
//     for (let status of level) {
//       if (!existingData.level.includes(status)) {
//         existingData.level.push(status);
//       }
//     };
//   }

//   if (Array.isArray(gameName)) {
//     for (let status of gameName) {
//       if (!existingData.gameName.includes(status)) {
//         existingData.gameName.push(status);
//       };
//     }
//   }

//   if (height) {
//     existingData.height = height;
//   }
//   if (weight) {
//     existingData.weight = weight;
//   }
//   if (thirtyMFlingStarts) {
//     existingData.thirtyMFlingStarts = thirtyMFlingStarts;
//   }
//   if (standingBroadJump) {
//     existingData.standingBroadJump = standingBroadJump;
//   }
//   if (shuttleRun10MX6) {
//     existingData.shuttleRun10MX6 = shuttleRun10MX6;
//   }
//   if (verticalJump) {
//     existingData.verticalJump = verticalJump;
//   }
//   if (footballBallThrow5No) {
//     existingData.footballBallThrow5No = footballBallThrow5No;
//   }
//   if (eightHundredMetersRun) {
//     existingData.eightHundredMetersRun = eightHundredMetersRun;
//   }
//   await existingData.save();
//   res.status(200).send({ status: true, data: existingData });
// };

// const updateStudentRegistration = async (req, res) => {
//   const user = req.user; // Access the user object
//   // Use Object.keys to iterate over each key in req.body
//   const action = req.params.action;
//   const studentIds = Object.keys(req.body);
//   console.log( 'studentIds', studentIds)
//   for (const studentId of studentIds) {
//     if (!isValidObjectId(studentId)) {
//       return res
//         .status(400)
//         .send({ status: false, message: `Invalid id: updateStudentRegistration :- ${studentId}` });
//     }

//     // Extract the data for this student
//     const studentData = req.body[studentId];
//     const {
//       height,
//       weight,
//       verticalJump,
//       thirtyMFlingStarts,
//       footballBallThrow5No,
//       shuttleRun10MX6,
//       standingBroadJump,
//       eightHundredMetersRun,
//       studentName,
//       gender,
//       aadharNumber,
//       fatherName,
//       motherName,
//       dob,
//       ageCategory,
//       mobileNumber,
//       email,
//       accountNumber,
//       isActiveAcc,
//       level,
//       gameName,
//       accountHolderName,
//       ifscCode,
//       bankName,
//       bankBranchName,
//     } = studentData;

//     try {
//       if (isValidParagraph(studentName)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `studentName is not Valid ` });
//       }
//       if (isValidParagraph(gender)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `gender is not Valid ` });
//       }
//       if (isValidParagraph(aadharNumber)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `aadharNumber is not Valid ` });
//       }
//       if (isValidParagraph(fatherName)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `fatherName is not Valid ` });
//       }
//       if (isValidParagraph(motherName)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `motherName is not Valid ` });
//       }
//       if (isValidParagraph(ageCategory)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `ageCategory is not Valid ` });
//       }
//       if (isValidParagraph(mobileNumber)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `mobileNumber is not Valid ` });
//       }
//       if (isValidParagraph(email)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `email is not Valid ` });
//       }
//       if (isValidParagraph(accountNumber)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `accountNumber is not Valid ` });
//       }
//       if (isValidParagraph(height)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `height is not Valid ` });
//       }
//       if (isValidParagraph(weight)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `weight is not Valid ` });
//       }
//       if (isValidParagraph(thirtyMFlingStarts)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `thirtyMFlingStarts is not Valid ` });
//       }
//       if (isValidParagraph(standingBroadJump)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `standingBroadJump is not Valid ` });
//       }
//       if (isValidParagraph(shuttleRun10MX6)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `shuttleRun10MX6 is not Valid ` });
//       }
//       if (isValidParagraph(verticalJump)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `verticalJump is not Valid ` });
//       }
//       if (isValidParagraph(footballBallThrow5No)) {
//         return res.status(400).send({
//           status: false,
//           message: `footballBallThrow5No is not Valid `,
//         });
//       }
//       if (isValidParagraph(eightHundredMetersRun)) {
//         return res.status(400).send({
//           status: false,
//           message: `eightHundredMetersRun is not Valid `,
//         });
//       }
//       if (isValidParagraph(accountHolderName)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `accountHolderName is not Valid ` });
//       }
//       if (isValidParagraph(ifscCode)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `ifscCode is not Valid ` });
//       }
//       if (isValidParagraph(bankName)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `bankName is not Valid ` });
//       }
//       if (isValidParagraph(bankBranchName)) {
//         return res
//           .status(400)
//           .send({ status: false, message: `bankBranchName is not Valid ` });
//       }

//       if (aadharNumber) {
//         if (isValidParagraph(aadharNumber)) {
//           return res
//             .status(400)
//             .send({ status: false, message: `${aadharNumber} is not  valid ` });
//         }
//         const checkAadhar = await studentModel.find({
//           aadharNumber,
//           isDeleted: false,
//         });
//         if (checkAadhar.length > 0) {
//           return res
//             .status(400)
//             .send({ status: false, message: `${aadharNumber} already exits ` });
//         }
//         existingData.aadharNumber = aadharNumber;
//       }

//       const existingData = await studentModel.findOne({
//         _id: studentId,
//         isDeleted: false,
//       });

//       if (!existingData) {
//         return res
//           .status(400)
//           .send({ status: false, message: `user not found or deleted` });
//       }

//       if (user) {
//         existingData.Udise_Code = user?.Udise_Code;
//       }
//       if (studentName) {
//         existingData.studentName = studentName;
//       }
//       if (gender) {
//         existingData.gender = gender;
//       }
//       if (fatherName) {
//         existingData.fatherName = fatherName;
//       }
//       if (motherName) {
//         existingData.motherName = motherName;
//       }
//       if (dob) {
//         existingData.dob = dob;
//       }
//       if (ageCategory) {
//         existingData.ageCategory = ageCategory;
//       }
//       if (mobileNumber) {
//         existingData.mobileNumber = mobileNumber;
//       }

//       if (accountNumber) {
//         existingData.accountNumber = accountNumber;
//       }
//       if (Array.isArray(isActiveAcc)) {
//         for (let status of isActiveAcc) {
//           if (!existingData.isActiveAcc.includes(status)) {
//             existingData.isActiveAcc.push(status);
//           }
//         }
//       }
//       if (Array.isArray(level)) {
//         for (let status of level) {
//           if (!existingData.level.includes(status)) {
//             existingData.level.push(status);
//           }
//         }
//       }
//       if (Array.isArray(gameName)) {
//         for (let status of gameName) {
//           if (!existingData.gameName.includes(status)) {
//             existingData.gameName.push(status);
//           }
//         }
//       }
//       if (height) {
//         existingData.height = height;
//       }
//       if (weight) {
//         existingData.weight = weight;
//       }
//       if (thirtyMFlingStarts) {
//         existingData.thirtyMFlingStarts = thirtyMFlingStarts;
//       }
//       if (standingBroadJump) {
//         existingData.standingBroadJump = standingBroadJump;
//       }
//       if (shuttleRun10MX6) {
//         existingData.shuttleRun10MX6 = shuttleRun10MX6;
//       }
//       if (verticalJump) {
//         existingData.verticalJump = verticalJump;
//       }
//       if (action === "submit") {
//         existingData.updatable = false;
//       }
//       if (footballBallThrow5No) {
//         existingData.footballBallThrow5No = footballBallThrow5No;
//       }
//       if (eightHundredMetersRun) {
//         existingData.eightHundredMetersRun = eightHundredMetersRun;
//       }
//       if (accountHolderName) {
//         existingData.accountHolderName = accountHolderName;
//       }
//       if (ifscCode) {
//         existingData.ifscCode = ifscCode;
//       }
//       if (bankName) {
//         existingData.bankName = bankName;
//       }
//       if (bankBranchName) {
//         existingData.bankBranchName = bankBranchName;
//       }

//       await existingData.save();
//     } catch (error) {
//       console.error(`Error updating student with ID ${studentId}:`, error);
//       return res.status(500).send({
//         status: false,
//         message: `Error updating student with ID ${studentId}`,
//       });
//     }
//   }

//   res
//     .status(200)
//     .send({ status: true, message: "Students updated successfully" });
// };

const updateStudentRegistration = async (req, res) => {
  const user = req.user; // Access the user object
  // Use Object.keys to iterate over each key in req.body
  const action = req.params.action;
  const studentId = req.params.studentId;
  // console.log("studentId", studentId);
  // console.log("req.body----- ---- ", req.body);

  // Extract the data for this student
  const {
    height,
    weight,
    verticalJump,
    thirtyMFlingStarts,
    footballBallThrow5No,
    shuttleRun10MX6,
    standingBroadJump,
    eightHundredMetersRun,
    studentName,
    gender,
    aadharNumber,
    fatherName,
    motherName,
    dob,
    ageCategory,
    mobileNumber,
    email,
    accountNumber,
    isActiveAcc,
    level,
    gameName,
    accountHolderName,
    ifscCode,
    bankName,
    bankBranchName,
  } = req.body;


  // console.log('req.body---- ' req.body)
  console.log('req.body----', req.body)

  try {
    if (isValidParagraph(studentName)) {
      return res
        .status(400)
        .send({ status: false, message: `studentName is not Valid ` });
    }
    if (isValidParagraph(gender)) {
      return res
        .status(400)
        .send({ status: false, message: `gender is not Valid ` });
    }
    if (isValidParagraph(aadharNumber)) {
      return res
        .status(400)
        .send({ status: false, message: `aadharNumber is not Valid ` });
    }
    if (isValidParagraph(fatherName)) {
      return res
        .status(400)
        .send({ status: false, message: `fatherName is not Valid ` });
    }
    if (isValidParagraph(motherName)) {
      return res
        .status(400)
        .send({ status: false, message: `motherName is not Valid ` });
    }
    if (isValidParagraph(ageCategory)) {
      return res
        .status(400)
        .send({ status: false, message: `ageCategory is not Valid ` });
    }
    if (isValidParagraph(mobileNumber)) {
      return res
        .status(400)
        .send({ status: false, message: `mobileNumber is not Valid ` });
    }
    if (isValidParagraph(email)) {
      return res
        .status(400)
        .send({ status: false, message: `email is not Valid ` });
    }
    if (isValidParagraph(accountNumber)) {
      return res
        .status(400)
        .send({ status: false, message: `accountNumber is not Valid ` });
    }
    if (isValidParagraph(height)) {
      return res
        .status(400)
        .send({ status: false, message: `height is not Valid ` });
    }
    if (isValidParagraph(weight)) {
      return res
        .status(400)
        .send({ status: false, message: `weight is not Valid ` });
    }
    if (isValidParagraph(thirtyMFlingStarts)) {
      return res
        .status(400)
        .send({ status: false, message: `thirtyMFlingStarts is not Valid ` });
    }
    if (isValidParagraph(standingBroadJump)) {
      return res
        .status(400)
        .send({ status: false, message: `standingBroadJump is not Valid ` });
    }
    if (isValidParagraph(shuttleRun10MX6)) {
      return res
        .status(400)
        .send({ status: false, message: `shuttleRun10MX6 is not Valid ` });
    }
    if (isValidParagraph(verticalJump)) {
      return res
        .status(400)
        .send({ status: false, message: `verticalJump is not Valid ` });
    }
    if (isValidParagraph(footballBallThrow5No)) {
      return res.status(400).send({
        status: false,
        message: `footballBallThrow5No is not Valid `,
      });
    }
    if (isValidParagraph(eightHundredMetersRun)) {
      return res.status(400).send({
        status: false,
        message: `eightHundredMetersRun is not Valid `,
      });
    }
    if (isValidParagraph(accountHolderName)) {
      return res
        .status(400)
        .send({ status: false, message: `accountHolderName is not Valid ` });
    }
    if (isValidParagraph(ifscCode)) {
      return res
        .status(400)
        .send({ status: false, message: `ifscCode is not Valid ` });
    }
    if (isValidParagraph(bankName)) {
      return res
        .status(400)
        .send({ status: false, message: `bankName is not Valid ` });
    }
    if (isValidParagraph(bankBranchName)) {
      return res
        .status(400)
        .send({ status: false, message: `bankBranchName is not Valid ` });
    }

    const existingData = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });
    console.log('existingData', existingData)

    if (!existingData) {
      return res
        .status(400)
        .send({ status: false, message: `user not found or deleted` });
    }
    if (existingData?.updatable === false) {
      return res
        .status(400)
        .send({
          status: false,
          message: `Your profile is frozen. You are not authorized to make updates`,
        });
    }

    if (aadharNumber) {
      if (!validateAadhaarNumber(aadharNumber)) {
        return res
          .status(400)
          .send({ status: false, message: `${aadharNumber} is not  valid ` });
      }
      const checkAadhar = await studentModel.find({
        aadharNumber,
        isDeleted: false,
      });

      // console.log('adhar number ---', checkAadhar)

      // if (checkAadhar.length > 0) {
      //   return res
      //     .status(400)
      //     .send({ status: false, message: `${aadharNumber} already exits ` });
      // }
      // console.log('orjgrg---ogp--',existingData?.aadharNumber, 'c rgihicci', aadharNumber, '===', checkAadhar[0]?.aadharNumber!==aadharNumber )
      if (checkAadhar.length > 0 && existingData?.aadharNumber !== aadharNumber) {
        return res
          .status(400)
          .send({ status: false, message: `Aadhar Number ${aadharNumber} already exits ` });
      }
      existingData.aadharNumber = aadharNumber;
    }

    if (user) {
      existingData.Udise_Code = user?.Udise_Code;
    }
    if (studentName) {
      existingData.studentName = studentName;
    }
    if (gender) {
      existingData.gender = gender;
    }
    if (fatherName) {
      existingData.fatherName = fatherName;
    }
    if (motherName) {
      existingData.motherName = motherName;
    }
    if (dob) {
      existingData.dob = dob;
    }
    if (ageCategory) {
      existingData.ageCategory = ageCategory;
    }
    if (mobileNumber) {
      existingData.mobileNumber = mobileNumber;
    }

    if (accountNumber) {
      existingData.accountNumber = accountNumber;
    }

    if (Array.isArray(isActiveAcc)) {
      for (let status of isActiveAcc) {
        if (!existingData.isActiveAcc.includes(status)) {
          existingData.isActiveAcc.push(status);
        }
      }
    }

    if (Array.isArray(level)) {
      for (let status of level) {
        if (!existingData.level.includes(status)) {
          existingData.level.push(status);
        }
      }
    }

    // if (Array.isArray(gameName)) {
    //   for (let status of gameName) {
    //     console.log('gameName',status)
    //     if (!existingData.gameName.includes(status)) {
    //       existingData.gameName.push(status);
    //     }
    //   }
    // }
    const importantGames = ["Football", "Kabaddi", "Cycling", 'Longjump (Athletics)', 'cricketBallThrow (Athletics)', '60m (Athletics)', '600m (Athletics)', '100m (Athletics)', '800m (Athletics)'];

    if (Array.isArray(gameName)) {
      // Check if any of the important games exist in existingData.gameName
      const containsImportantGame = existingData.gameName.some((game) =>
        importantGames.includes(game)
      );

      if (containsImportantGame) {
        // Replace the entire array if any important game is found
        existingData.gameName = [...gameName];
      } else {
        // Otherwise, add new games from gameName to existingData.gameName
        for (let status of gameName) {
          console.log("gameName", status);
          if (!existingData.gameName.includes(status)) {
            existingData.gameName.push(status);
          }
        }
      }
    }

    if (height) {
      existingData.height = height;
    }
    if (weight) {
      existingData.weight = weight;
    }
    if (thirtyMFlingStarts) {
      existingData.thirtyMFlingStarts = thirtyMFlingStarts;
    }
    if (standingBroadJump) {
      existingData.standingBroadJump = standingBroadJump;
    }
    if (shuttleRun10MX6) {
      existingData.shuttleRun10MX6 = shuttleRun10MX6;
    }
    if (verticalJump) {
      existingData.verticalJump = verticalJump;
    }
    if (action === "submit") {
      existingData.updatable = false;
    }
    if (footballBallThrow5No) {
      existingData.footballBallThrow5No = footballBallThrow5No;
    }
    if (eightHundredMetersRun) {
      existingData.eightHundredMetersRun = eightHundredMetersRun;
    }
    if (accountHolderName) {
      existingData.accountHolderName = accountHolderName;
    }
    if (ifscCode) {
      existingData.ifscCode = ifscCode;
    }
    if (bankName) {
      existingData.bankName = bankName;
    }
    if (bankBranchName) {
      existingData.bankBranchName = bankBranchName;
    }
    if (email) {
      existingData.email = email;
    }

    await existingData.save();
  } catch (error) {
    console.error(`Error updating student with ID ${studentId}:`, error);
    return res.status(500).send({
      status: false,
      message: `Error updating student with ID ${studentId}`,
    });
  }
  res
    .status(200)
    .send({ status: true, message: "Students updated successfully" });
};

module.exports.updateStudentRegistration = updateStudentRegistration;

// get 


// controller for save battery test results

const saveStudentBatteryTestScore = async (req, res) => {
  const user = req.user; // Access the user object
  // Use Object.keys to iterate over each key in req.body
  const action = req.params.action;
  const studentIds = Object.keys(req.body);
  for (const studentId of studentIds) {
    if (!isValidObjectId(studentId)) {
      return res
        .status(400)
        .send({ status: false, message: `Invalid id: ${studentId}` });
    }

    // Extract the data for this student
    const studentData = req.body[studentId];
    const {
      height,
      weight,
      verticalJump,
      thirtyMFlingStarts,
      footballBallThrow5No,
      shuttleRun10MX6,
      standingBroadJump,
      eightHundredMetersRun,
      studentName,
      gender,
      aadharNumber,
      fatherName,
      motherName,
      dob,
      ageCategory,
      mobileNumber,
      email,
      accountNumber,
      isActiveAcc,
      level,
      gameName,
      accountHolderName,
      ifscCode,
      bankName,
      bankBranchName,
    } = studentData;

    try {
      if (isValidParagraph(studentName)) {
        return res
          .status(400)
          .send({ status: false, message: `studentName is not Valid ` });
      }
      if (isValidParagraph(gender)) {
        return res
          .status(400)
          .send({ status: false, message: `gender is not Valid ` });
      }
      if (isValidParagraph(aadharNumber)) {
        return res
          .status(400)
          .send({ status: false, message: `aadharNumber is not Valid ` });
      }
      if (isValidParagraph(fatherName)) {
        return res
          .status(400)
          .send({ status: false, message: `fatherName is not Valid ` });
      }
      if (isValidParagraph(motherName)) {
        return res
          .status(400)
          .send({ status: false, message: `motherName is not Valid ` });
      }
      if (isValidParagraph(ageCategory)) {
        return res
          .status(400)
          .send({ status: false, message: `ageCategory is not Valid ` });
      }
      if (isValidParagraph(mobileNumber)) {
        return res
          .status(400)
          .send({ status: false, message: `mobileNumber is not Valid ` });
      }
      if (isValidParagraph(email)) {
        return res
          .status(400)
          .send({ status: false, message: `email is not Valid ` });
      }
      if (isValidParagraph(accountNumber)) {
        return res
          .status(400)
          .send({ status: false, message: `accountNumber is not Valid ` });
      }
      if (isValidParagraph(height)) {
        return res
          .status(400)
          .send({ status: false, message: `height is not Valid ` });
      }
      if (isValidParagraph(weight)) {
        return res
          .status(400)
          .send({ status: false, message: `weight is not Valid ` });
      }
      if (isValidParagraph(thirtyMFlingStarts)) {
        return res
          .status(400)
          .send({ status: false, message: `thirtyMFlingStarts is not Valid ` });
      }
      if (isValidParagraph(standingBroadJump)) {
        return res
          .status(400)
          .send({ status: false, message: `standingBroadJump is not Valid ` });
      }
      if (isValidParagraph(shuttleRun10MX6)) {
        return res
          .status(400)
          .send({ status: false, message: `shuttleRun10MX6 is not Valid ` });
      }
      if (isValidParagraph(verticalJump)) {
        return res
          .status(400)
          .send({ status: false, message: `verticalJump is not Valid ` });
      }
      if (isValidParagraph(footballBallThrow5No)) {
        return res.status(400).send({
          status: false,
          message: `footballBallThrow5No is not Valid `,
        });
      }
      if (isValidParagraph(eightHundredMetersRun)) {
        return res.status(400).send({
          status: false,
          message: `eightHundredMetersRun is not Valid `,
        });
      }
      if (isValidParagraph(accountHolderName)) {
        return res
          .status(400)
          .send({ status: false, message: `accountHolderName is not Valid ` });
      }
      if (isValidParagraph(ifscCode)) {
        return res
          .status(400)
          .send({ status: false, message: `ifscCode is not Valid ` });
      }
      if (isValidParagraph(bankName)) {
        return res
          .status(400)
          .send({ status: false, message: `bankName is not Valid ` });
      }
      if (isValidParagraph(bankBranchName)) {
        return res
          .status(400)
          .send({ status: false, message: `bankBranchName is not Valid ` });
      }

      if (aadharNumber) {
        if (isValidParagraph(aadharNumber)) {
          return res
            .status(400)
            .send({ status: false, message: `${aadharNumber} is not  valid ` });
        }
        const checkAadhar = await studentModel.find({
          aadharNumber,
          isDeleted: false,
        });
        if (checkAadhar.length > 0) {
          return res
            .status(400)
            .send({ status: false, message: `${aadharNumber} already exits ` });
        }
        existingData.aadharNumber = aadharNumber;
      }

      const existingData = await studentModel.findOne({
        _id: studentId,
        isDeleted: false,
      });

      if (!existingData) {
        return res
          .status(400)
          .send({ status: false, message: `user not found or deleted` });
      }

      if (user) {
        existingData.Udise_Code = user?.Udise_Code;
      }
      if (studentName) {
        existingData.studentName = studentName;
      }
      if (gender) {
        existingData.gender = gender;
      }
      if (fatherName) {
        existingData.fatherName = fatherName;
      }
      if (motherName) {
        existingData.motherName = motherName;
      }
      if (dob) {
        existingData.dob = dob;
      }
      if (ageCategory) {
        existingData.ageCategory = ageCategory;
      }
      if (mobileNumber) {
        existingData.mobileNumber = mobileNumber;
      }

      if (accountNumber) {
        existingData.accountNumber = accountNumber;
      }
      if (Array.isArray(isActiveAcc)) {
        for (let status of isActiveAcc) {
          if (!existingData.isActiveAcc.includes(status)) {
            existingData.isActiveAcc.push(status);
          }
        }
      }
      if (Array.isArray(level)) {
        for (let status of level) {
          if (!existingData.level.includes(status)) {
            existingData.level.push(status);
          }
        }
      }
      if (Array.isArray(gameName)) {
        for (let status of gameName) {
          if (!existingData.gameName.includes(status)) {
            existingData.gameName.push(status);
          }
        }
      }
      if (height) {
        existingData.height = height;
      }
      if (weight) {
        existingData.weight = weight;
      }
      if (thirtyMFlingStarts) {
        existingData.thirtyMFlingStarts = thirtyMFlingStarts;
      }
      if (standingBroadJump) {
        existingData.standingBroadJump = standingBroadJump;
      }
      if (shuttleRun10MX6) {
        existingData.shuttleRun10MX6 = shuttleRun10MX6;
      }
      if (verticalJump) {
        existingData.verticalJump = verticalJump;
      }
      if (action === "submit") {
        existingData.updatable = false;
      }
      if (footballBallThrow5No) {
        existingData.footballBallThrow5No = footballBallThrow5No;
      }
      if (eightHundredMetersRun) {
        existingData.eightHundredMetersRun = eightHundredMetersRun;
      }
      if (accountHolderName) {
        existingData.accountHolderName = accountHolderName;
      }
      if (ifscCode) {
        existingData.ifscCode = ifscCode;
      }
      if (bankName) {
        existingData.bankName = bankName;
      }
      if (bankBranchName) {
        existingData.bankBranchName = bankBranchName;
      }

      await existingData.save();
    } catch (error) {
      console.error(`Error updating student with ID ${studentId}:`, error);
      return res.status(500).send({
        status: false,
        message: `Error updating student with ID ${studentId}`,
      });
    }
  }

  res
    .status(200)
    .send({ status: true, message: "Battery Test Score Saved Successfully." });

};

module.exports.saveStudentBatteryTestScore = saveStudentBatteryTestScore;


const updateStudentReward = async (req, res) => {
  const user = req.user; // Access the user object
  // Extract the data for this student
  const studentId = req.params.studentId;

  const { rank, cashRewards } = req.body;

  console.log("req.body", req.body);

  try {
    if (!isValidObjectId(studentId)) {
      return res.status(400).send({ status: false, message: `Invalid id` });
    }
    if (!isValid(rank)) {
      return res.status(400).send({ status: false, message: `rank required ` });
    }
    if (isValidParagraph(rank)) {
      return res
        .status(400)
        .send({ status: false, message: `rank is not Valid ` });
    }
    if (!isValid(cashRewards)) {
      return res
        .status(400)
        .send({ status: false, message: `CashReward reqiured ` });
    }
    if (isValidParagraph(cashRewards)) {
      return res
        .status(400)
        .send({ status: false, message: `cashRewards is not Valid ` });
    }
    const existingData = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });
    if (!existingData) {
      return res
        .status(400)
        .send({ status: false, message: `user not found or deleted` });
    }
    if (rank) {
      existingData.rank = rank;
    }
    if (cashRewards) {
      existingData.cashRewards = cashRewards;
    }
    await existingData.save();
    return res
      .status(200)
      .send({ status: true, message: "Students updated successfully" });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({
        status: false,
        message: `Error updating student with ID ${studentId}`,
      });
  }
};

module.exports.updateStudentReward = updateStudentReward;


const totalRegisteredStudent = async (req, res) => {
  try {
    // Count the total number of students where isDeleted is false
    const totalStudentCount = await studentModel.countDocuments({ isDeleted: false });

    // Send the count as a response
    res.status(200).json({ totalRegisteredStudents: totalStudentCount });
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error("Error finding total registered students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.totalRegisteredStudent = totalRegisteredStudent;
