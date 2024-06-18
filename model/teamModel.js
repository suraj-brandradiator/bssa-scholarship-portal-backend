const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  StudentMongooseID: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
  studentName: { type: String },
  uniqueStudentId: { type: String },
  cashRewardAccepted: { type: Boolean, default: false },
  played: { type: Boolean, default: true },
});

const teamSchema = new mongoose.Schema(
  {
    Udise_Code: { type: String, default: "" },
    teamName: { type: String, default: "" },
    selectedStudents: [teamMemberSchema],
    cashRewards: { type: String, default: "" },
    rank: { type: String, default: "" },
    teamScore: { type: String, default: "" },
    sportName: { type: String, default: "" },
    ageCategory: { type: String, default: "" },
    teamLevel: { type: String, default: "" },
    adminApprovalStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    superAdminApprovalStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    superDuperAdminApprovalStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "school_datas" }, // Referencing the smsuser model
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "school_datas" }, // Referencing the smsuser model
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "school_datas" }, // Referencing the smsuser model and making it required
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const teamModel = mongoose.model("Team", teamSchema);
const schoolTeamModel = mongoose.model("School_Team", teamSchema);

const teamMemberModel = mongoose.model("TeamMember", teamMemberSchema);

module.exports = { teamModel, teamMemberModel, schoolTeamModel };
