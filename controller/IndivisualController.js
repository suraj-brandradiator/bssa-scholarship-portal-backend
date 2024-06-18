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
const { teamModel, teamMemberModel } = require("../model/teamModel");

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

const CreateTeam = async (req, res) => {
  const user = req.user; // Access the user object
  const imageUrl = req.file ? req.file.path : "";
  let {
    teamName,
    selectedStudents,
    cashRewards,
    rank,
    teamScore,
    sportName,
    ageCategory,
    teamLevel,
    email,
  } = req.body;

  console.log("req.body", req.body);
  try {
    if (!isValid(teamName)) {
      return res
        .status(400)
        .send({ status: false, message: `Team name required` });
    }

    let studentsArray;
    try {
      studentsArray = JSON.parse(selectedStudents);
    } catch (error) {
      return res.status(400).send({
        status: false,
        message: "Invalid JSON format for selectedStudents",
      });
    }
    console.log("studentsArray", studentsArray);

    // if (!isValid(createdBy)) { return res.status(400).send({ status: false, message: `createdBy is required ` })}
    if (!Array.isArray(studentsArray)) {
      return res.status(400).send({ status: false, message: `Array only` });
    }

    for (const member of studentsArray) {
      if (!member.StudentMongooseID) {
        return res.status(400).send({
          status: false,
          message: `Each team member must have a StudentMongooseID`,
        });
      }
      if (!isValidObjectId(member.StudentMongooseID)) {
        return res.status(400).send({
          status: false,
          message: `Each team member must have a valid StudentMongooseID`,
        });
      }
      // if (typeof member.played !== 'boolean') {
      //   return res.status(400).send({ status: false, message: `Each team member must have a valid played status (true/false)` });
      // }
    }
    if (isValidParagraph(teamName)) {
      return res
        .status(400)
        .send({ status: false, message: `teamName is required ` });
    }
    if (isValidParagraph(selectedStudents)) {
      return res
        .status(400)
        .send({ status: false, message: `selectedStudents is required ` });
    }
    if (isValidParagraph(cashRewards)) {
      return res
        .status(400)
        .send({ status: false, message: `cashRewards is required ` });
    }
    if (isValidParagraph(rank)) {
      return res
        .status(400)
        .send({ status: false, message: `rank is required ` });
    }
    if (isValidParagraph(teamScore)) {
      return res
        .status(400)
        .send({ status: false, message: `teamScore is required ` });
    }
    if (isValidParagraph(sportName)) {
      return res
        .status(400)
        .send({ status: false, message: `sportName is required ` });
    }
    if (isValidParagraph(ageCategory)) {
      return res
        .status(400)
        .send({ status: false, message: `ageCategory is required ` });
    }
    if (isValidParagraph(teamLevel)) {
      return res
        .status(400)
        .send({ status: false, message: `teamLevel is required ` });
    }

    const checkTeamName = await teamModel.find({ teamName, isDeleted: false });
    if (checkTeamName.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${teamName} already exits ` });
    }

    console.log("1111");
    const selectedStudentsWithNames = [];

    for (const member of studentsArray) {
      const studentId = member.StudentMongooseID;
      console.log("studentId", studentId);
      const student = await studentModel.findById(studentId);
      if (!student) {
        return res.status(404).send({
          status: false,
          message: `Student with ID ${studentId} not found`,
        });
      }
      selectedStudentsWithNames.push({
        StudentMongooseID: studentId,
        studentName: student.studentName, // Assuming 'name' is the property containing the student's name
        uniqueStudentId: student.studentId,
        played: false,
      });
      student.selectedInTeam = "1";
      await student.save();
    }
    console.log("22222");
    const createUser = await teamModel.create({
      Udise_Code: user.Udise_Code,
      teamName: teamName,
      selectedStudents: selectedStudentsWithNames,
      cashRewards: cashRewards,
      rank: rank,
      teamScore: teamScore,
      sportName: sportName,
      ageCategory: ageCategory,
      teamLevel: teamLevel,
      createdBy: user?.id,
      adminApprovalStatus: "Approved",
    });
    console.log("3333");

    res
      .status(200)
      .send({ status: true, message: "User registerd successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.CreateTeam = CreateTeam;

const getTeam = async (req, res) => {
  try {
    const user = req.user;
    const users = await teamModel
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
module.exports.getTeam = getTeam;

// const updateTeam = async (req, res) => {
//   const user = req.user;
//   const imageUrl = req.file ? req.file.path : "";
//   let {
//     teamId,
//     teamName,
//     selectedStudents,
//     cashRewards,
//     rank,
//     teamScore,
//     sportName,
//     ageCategory,
//     teamLevel,
//     email,
//   } = req.body;

//   try {
//     if (!teamId) {
//       return res.status(400).send({ status: false, message: `Team ID is required for updating` });
//     }

//     let studentsArray;
//     try {
//       studentsArray = JSON.parse(selectedStudents);
//     } catch (error) {
//       return res.status(400).send({ status: false, message: "Invalid JSON format for selectedStudents" });
//     }

//     if (!Array.isArray(studentsArray)) {
//       return res.status(400).send({ status: false, message: `selectedStudents must be an array` });
//     }

//     for (const member of studentsArray) {
//       if (!member.StudentMongooseID) {
//         return res.status(400).send({ status: false, message: `Each team member must have a StudentMongooseID` });
//       }
//       if (!isValidObjectId(member.StudentMongooseID)) {
//         return res.status(400).send({ status: false, message: `Each team member must have a valid StudentMongooseID` });
//       }
//     }

//     const selectedStudentsWithNames = [];

//     for (const member of studentsArray) {
//       const studentId = member.StudentMongooseID;
//       const student = await studentModel.findById(studentId);
//       if (!student) {
//         return res.status(404).send({ status: false, message: `Student with ID ${studentId} not found` });
//       }
//       selectedStudentsWithNames.push({
//         StudentMongooseID: studentId,
//         studentName: student.studentName,
//         uniqueStudentId: student.studentId,
//         played: true,
//       });
//       await student.save();
//     }

//     const updateFields = {
//       teamName,
//       selectedStudents: selectedStudentsWithNames,
//       cashRewards,
//       rank,
//       teamScore,
//       sportName,
//       ageCategory,
//       teamLevel,
//       updatedBy: user?.id,
//     };

//     // Only update fields that are sent from the frontend
//     const fieldsToUpdate = Object.keys(req.body).filter(field => updateFields.hasOwnProperty(field));

//     const updatedTeam = await teamModel.findOneAndUpdate(
//       { _id: teamId },
//       { $set: fieldsToUpdate.reduce((acc, field) => ({ ...acc, [field]: req.body[field] }), {}) },
//       { new: true }
//     );

//     if (!updatedTeam) {
//       return res.status(404).send({ status: false, message: "Team not found" });
//     }

//     return res.status(200).send({
//       status: true,
//       message: "Team updated successfully",
//       data: updatedTeam,
//     });
//   } catch (err) {
//     res.status(500).send({ status: false, message: err.message });
//   }
// };

const updateTeam = async (req, res) => {
  const user = req.user;
  const imageUrl = req.file ? req.file.path : "";
  let {
    teamId,
    teamName,
    selectedStudents,
    cashRewards,
    rank,
    teamScore,
    sportName,
    ageCategory,
    teamLevel,
    email,
  } = req.body;

  try {
    if (!teamId) {
      return res.status(400).send({ status: false, message: `Team ID is required for updating` });
    }

    let studentsArray;
    try {
      studentsArray = JSON.parse(selectedStudents);
    } catch (error) {
      return res.status(400).send({ status: false, message: "Invalid JSON format for selectedStudents" });
    }

    if (!Array.isArray(studentsArray)) {
      return res.status(400).send({ status: false, message: `selectedStudents must be an array` });
    }

    for (const member of studentsArray) {
      if (!member.StudentMongooseID) {
        return res.status(400).send({ status: false, message: `Each team member must have a StudentMongooseID` });
      }
      if (!isValidObjectId(member.StudentMongooseID)) {
        return res.status(400).send({ status: false, message: `Each team member must have a valid StudentMongooseID` });
      }
    }

    const studentIds = studentsArray.map(member => member.StudentMongooseID);
    const studentsFromDb = await studentModel.find({ _id: { $in: studentIds } });

    if (studentsFromDb.length !== studentsArray.length) {
      const notFoundIds = studentsArray
        .filter(member => !studentsFromDb.some(student => student._id.equals(member.StudentMongooseID)))
        .map(member => member.StudentMongooseID);
      return res.status(404).send({ status: false, message: `Students with IDs ${notFoundIds.join(", ")} not found` });
    }

    const selectedStudentsWithNames = studentsFromDb.map(student => ({
      StudentMongooseID: student._id,
      studentName: student.studentName,
      uniqueStudentId: student.studentId,
      played: true,
    }));

    const updateFields = {
      teamName,
      selectedStudents: selectedStudentsWithNames,
      cashRewards,
      rank,
      teamScore,
      sportName,
      ageCategory,
      teamLevel,
      updatedBy: user?.id,
    };

    const fieldsToUpdate = Object.keys(req.body).filter(field => updateFields.hasOwnProperty(field));
    const updateData = fieldsToUpdate.reduce((acc, field) => ({ ...acc, [field]: req.body[field] }), {});

    const updatedTeam = await teamModel.findOneAndUpdate(
      { _id: teamId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).send({ status: false, message: "Team not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Team updated successfully",
      data: updatedTeam,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};



module.exports.updateTeam = updateTeam;
