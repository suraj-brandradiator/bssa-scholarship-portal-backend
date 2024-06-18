const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Udise_Code: { type: String , default: ''},
  studentId: { type: String, index: true },
  selectedInTeam: {type: [String]},
  // selectedInTeam: { type: String, default: ''},
  selectedTeamId:{ type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  studentName: { type: String, required: true },
  gender: { type: String, default: ''},
  aadharNumber: { type: String, default: '' },
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  rank: { type: String , default: ''},
  cashRewards: { type: String , default: ''},
  dob: { type: Date },
  caldob: { type: String , default: ''},
  updatable:{ type: Boolean, default:true },
  ageCategory: { type: String, default: '' },
  batteryTestScore:{ type: String, default:''},
  mobileNumber: { type: String , default: ''},
  email: { type: String , default: ''},
  accountNumber: { type: String , default: ''},
  isActiveAcc: {
    type: [String], // Define as an array of strings
    enum: ['', 'school', 'block', 'district', 'state'] // Add initial values if needed
  },
  level: {
    type: [String], // Define as an array of strings
    enum: ['', 'school', 'block', 'district', 'state'] // Add initial values if needed
  },
  gameName: {
    type: [String], // Define as an array of strings
    enum: ['', 'Football', 'Kabaddi', 'Cycling', 'Longjump (Athletics)', 'cricketBallThrow (Athletics)', '60m (run) (Athletics)', '600m (run) (Athletics)', '100m (run) (Athletics)', '800m (run) (Athletics)'] // Add initial values if needed
  },
  //   battery test
  height: { type: String , default: ''},
  weight: { type: String },
  thirtyMFlingStarts: { type: String , default: ''},
  standingBroadJump: { type: String, default: '' },
  shuttleRun10MX6: { type: String , default: ''},
  verticalJump: { type: String, default: '' },
  footballBallThrow5No: { type: String, default: '' },
  eightHundredMetersRun: { type: String, default: '' },
  accountHolderName: { type: String , default: ''},
  ifscCode: { type: String , default: ''},
  bankName: { type: String , default: ''},
  bankBranchName: { type: String , default: ''},
  adminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  superAdminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  superDuperAdminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'school_datas' },  // Referencing the smsuser model
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'school_datas' },  // Referencing the smsuser model
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'school_datas' }, // Referencing the smsuser model and making it required
  isDeleted: { type: Boolean, default: false, index: true },
}, { timestamps: true });


const studentModel = mongoose.model('student', studentSchema);
module.exports = studentModel;
