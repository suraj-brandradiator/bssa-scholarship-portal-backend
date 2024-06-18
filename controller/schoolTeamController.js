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
// const { schoolTeamModel } = require("../model/schoolTeamModel");
const { schoolTeamModel } = require("../model/teamModel")

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

const CreateSchoolTeam = async (req, res) => {
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

    const checkTeamName = await schoolTeamModel.find({ teamName, isDeleted: false });
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
      if (user?.role === 'User' && !student.selectedInTeam.includes(teamName)) {
        student.selectedInTeam.push(teamName);
      }
      // student.selectedInTeam = teamName;

      if (user?.role === 'User' && !student.level.includes('school')) {
        student.level.push('school');
      }
      await student.save();
    }
    console.log("22222");
    const createUser = await schoolTeamModel.create({
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


    res
      .status(200)
      .send({ status: true, message: "User registerd successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.CreateSchoolTeam = CreateSchoolTeam;

const getSchoolTeam = async (req, res) => {
  try {
    const user = req.user;
    const teams = await schoolTeamModel
      .find({
        Udise_Code: user?.Udise_Code,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });

    const students = await studentModel
      .find({
        Udise_Code: user?.Udise_Code,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });

    // res.json(users);
    const result = {
      teams,
      students,
    };
    // console.log('result', result);
    // return res.status(200).send({ status: true,result  });
    res.json(result);
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.getSchoolTeam = getSchoolTeam;

const getSchoolTeamAfterCreate = async (req, res) => {
  try {
    const user = req.user;
    const users = await schoolTeamModel
      .find({
        Udise_Code: user?.Udise_Code,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });

    console.log("users", users);

    res.json(users);
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.getSchoolTeamAfterCreate = getSchoolTeamAfterCreate;

const updateSchoolTeam = async (req, res) => {
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

  console.log("req.body----- --- ", req.body);

  if (selectedStudents?.length < 1) {
    return res
      .status(400)
      .send({ status: false, message: `Please Select atlesat one player ` });
  }

  console.log("selectedStudents---", selectedStudents?.length);

  try {
    if (!teamId) {
      return res
        .status(400)
        .send({ status: false, message: `Team ID is required for updating` });
    }

    if (!isValidObjectId(teamId)) {
      return res
        .status(400)
        .send({ status: false, message: `Invalid id teamId` });
    }

    console.log("1");
    let studentsArray;
    try {
      studentsArray = JSON.parse(selectedStudents);
    } catch (error) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid JSON format for selectedStudents",
        });
    }

    if (!Array.isArray(studentsArray)) {
      return res
        .status(400)
        .send({ status: false, message: `selectedStudents must be an array` });
    }

    if (studentsArray?.length < 1) {
      return res
        .status(400)
        .send({
          status: false,
          message: `Please Select atlesat one player , Selected Player:- ${studentsArray?.length}`,
        });
    }
    console.log("studentsArray?.length<1", studentsArray?.length);

    console.log("2");
    for (const member of studentsArray) {
      if (!member.StudentMongooseID) {
        return res
          .status(400)
          .send({
            status: false,
            message: `Each team member must have a StudentMongooseID`,
          });
      }
      if (!isValidObjectId(member.StudentMongooseID)) {
        return res
          .status(400)
          .send({
            status: false,
            message: `Each team member must have a valid StudentMongooseID`,
          });
      }
    }

    console.log("3");
    const studentIds = studentsArray.map((member) => member.StudentMongooseID);
    // console.log('3.1', studentIds);

    // Fetch the team and its selected students from the database
    const team = await schoolTeamModel.findOne({ _id: teamId, isDeleted: false });

    if (!team) {
      return res
        .status(404)
        .send({ status: false, message: "Team not found or is deleted" });
    }

    if (!team?.rank) {
      if (!rank) {
        return res
          .status(400)
          .send({ status: false, message: `rank required` });
      }
    }

    if (!team?.cashRewards) {
      if (!cashRewards) {
        return res
          .status(400)
          .send({ status: false, message: `rank required` });
      }
    }

    if (team?.cashRewards) {
      cashRewards = team?.cashRewards;
    }
    if (team?.rank) {
      rank = team?.rank;
    }

    // console.log('4', team);

    // Update the `played` status for relevant students
    team.selectedStudents = team.selectedStudents.map((student) => {
      if (studentIds.includes(student.StudentMongooseID.toString())) {
        const updatedStudent = studentsArray.find(
          (s) => s.StudentMongooseID === student.StudentMongooseID.toString()
        );
        return {
          ...student,
          played: true,
          studentName: updatedStudent.studentName || student.studentName, // Retain other details from DB
          uniqueStudentId:
            updatedStudent.uniqueStudentId || student.uniqueStudentId,
          cashRewardAccepted: true, // retain existing cashRewardAccepted value
        };
      }
      return student; // Return unchanged student if not in the studentIds array
    });

    // console.log('5', team.selectedStudents);

    // Prepare the update data
    const updateData = {
      teamName,
      selectedStudents: team.selectedStudents, // Use the modified selectedStudents array
      cashRewards,
      rank,
      teamScore,
      sportName,
      ageCategory,
      teamLevel,
      updatedBy: user?.id,
    };

    console.log("6");

    const updatedTeam = await schoolTeamModel.findOneAndUpdate(
      { _id: teamId },
      { $set: updateData },
      { new: true }
    );

    console.log("7");

    if (!updatedTeam) {
      return res.status(404).send({ status: false, message: "Team not found" });
    }

    console.log("8");

    return res.status(200).send({
      status: true,
      message: "Team updated successfully",
      data: updatedTeam,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send({ status: false, message: err.message });
  }
};
module.exports.updateSchoolTeam = updateSchoolTeam;

const getUnSelectedStudentSchool = async (req, res) => {
  try {
    const user = req.user;
    const users = await studentModel
      .find({
        Udise_Code: user?.Udise_Code,
        // selectedInTeam: [],
        // selectedInTeam: { $exists: true, $not: { $size: 0 } }, // Ensure selectedInTeam exists and is not empty
        // $expr: { $gte: [{ $size: "$selectedInTeam" }, 1] }, // Ensure selectedInTeam length is >= 1
        // selectedInTeam: { $exists: true, $not: { $size: 0 } }, // Ensure selectedInTeam exists and is not empty
        selectedInTeam: { $size: 1 },
        updatable: false,
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
module.exports.getUnSelectedStudentSchool = getUnSelectedStudentSchool;


const getSchoolTeamById = async (req, res) => {
  try {
    const user = req.user;
    const teamId = req.params.teamId;

    // Check if teamId is provided
    if (!teamId) {
      return res.status(400).send({ status: false, message: 'Team ID is required' });
    }

    // Check if the user is authorized to access this team
    if (!user || !user.Udise_Code) {
      return res.status(403).send({ status: false, message: 'Unauthorized access' });
    }

    const team = await schoolTeamModel
      .findOne({
        _id: teamId,
        Udise_Code: user.Udise_Code,
        isDeleted: false,
      })
    // .populate('selectedStudents.StudentMongooseID', 'studentName ageCategory sportName') // Populate the StudentMongooseID field with the referenced student's details
    // .populate('modifiedBy', 'name') // Populate the modifiedBy field with the referenced user's details
    // .populate('deletedBy', 'name') // Populate the deletedBy field with the referenced user's details
    // .populate('createdBy', 'name'); // Populate the createdBy field with the referenced user's details

    // Check if the team was found
    if (!team) {
      return res.status(404).send({ status: false, message: 'Team not found' });
    }

    return res.status(200).send({ status: true, team });
  } catch (err) {
    // Log the error for debugging purposes
    console.error('Error fetching Team Details:', err);

    // Send a generic error message to the client
    return res.status(500).send({ status: false, message: 'Internal server error' });
  }
};

module.exports.getSchoolTeamById = getSchoolTeamById;
