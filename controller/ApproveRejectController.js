const userModel = require("../model/userModel");
const { AboutDepartmentModel, facultyAndStaffModel, researchAndPublicationsModel, academicsModel,
  inPatientServiceModel, outPatientServiceModel, priceListModel, linksModel, galleryModel, imagesModel, pdfModel, MisionAndVisionModel,
} = require('../model/departmentsModel');
const { departmentModel, facultyOfMedicineModel, facultyOfNursingModel, facultyOfParaMedicalSciencesModel, facultyOfPharmacyModel, facultyOfDentalSciencesModel } = require('../model/departmentsModel');


// const superDuperAdminApproveGiving = async (req, res) => {
//     try {
//       const employeeId = req.params.employeeId;
//       const role = req.params.Role;

//       console.log('from approved', employeeId)
//       // const existingData = await userModel.findById(employeeId)
//       const existingData = await userModel.findOne({
//         _id: employeeId,
//         isDeleted: false,
//       });
//       if (!existingData)
//         return res.send({
//           code: 400,
//           msg: "Data not found or already deleted",
//         });
//       const updatedDocument = await userModel.findByIdAndUpdate(
//         employeeId,
//         { superDuperAdminApprovalStatus: 'Approved' },
//         { new: true }
//       );
//       res.send({ msg: updatedDocument });
//     } catch (err) {
//       console.error("Error updating data:", err);
//       res.send({ error: err });
//     }
//   };

const superDuperAdminApproveGiving = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const role = req.params.Role;

    console.log('from approved', employeeId)

    // Define the update object based on the role
    let updateObj = {};

    if (role === 'Chess') {
      updateObj = { superDuperAdminApprovalStatus: 'Approved' };
    } else if (role === 'Music') {
      updateObj = { adminApprovalStatus: 'Approved' };
    } else {
      return res.send({
        code: 400,
        msg: "Invalid role",
      });
    }
    // Find the existing data
    const existingData = await userModel.findOneAndUpdate(
      { _id: employeeId, isDeleted: false },
      updateObj,
      { new: true }
    );

    // Check if data exists
    if (!existingData) {
      return res.send({
        code: 400,
        msg: "Data not found or already deleted",
      });
    }

    // Send the updated document as response
    res.send({ msg: existingData });
  } catch (err) {
    console.error("Error updating data:", err);
    res.send({ error: err });
  }
};

module.exports.superDuperAdminApproveGiving = superDuperAdminApproveGiving;

// const superDuperAdminApproveApproveRejected = async (req, res) => {
//   try {
//     const employeeId = req.params.employeeId;
//     // const existingData = await userModel.findById(employeeId)
//     const existingData = await userModel.findOne({
//       _id: employeeId,
//       isDeleted: false,
//     });
//     if (!existingData)
//       return res.send({
//         code: 400,
//         msg: "data not found or already deleted",
//       });
//     const updatedDocument = await userModel.findByIdAndUpdate(
//       employeeId,
//       { superDuperAdminApprovalStatus: 'Rejected' },
//       { new: true }
//     );
//     res.send({ msg: updatedDocument });
//   } catch (err) {
//     console.error("Error updating data:", err);
//     res.send({ error: err });
//   }
// };


const superDuperAdminApproveApproveRejected = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const role = req.params.Role;
    console.log('from Rejected', employeeId)
    // Define the update object based on the role
    let updateObj = {};

    if (role === 'Chess') {
      updateObj = { superDuperAdminApprovalStatus: 'Rejected' };
    } else if (role === 'Music') {
      updateObj = { adminApprovalStatus: 'Rejected' };
    } else {
      return res.send({
        code: 400,
        msg: "Invalid role",
      });
    }
    // Find the existing data
    const existingData = await userModel.findOneAndUpdate(
      { _id: employeeId, isDeleted: false },
      updateObj,
      { new: true }
    );

    // Check if data exists
    if (!existingData) {
      return res.send({
        code: 400,
        msg: "Data not found or already deleted",
      });
    }

    // Send the updated document as response
    res.send({ msg: existingData });
  } catch (err) {
    console.error("Error updating data:", err);
    res.send({ error: err });
  }
};
module.exports.superDuperAdminApproveApproveRejected = superDuperAdminApproveApproveRejected;



const ApproveDepartmentItems = async (req, res) => {
  try {
    const parentId = req.params.id; // Extract 'id' from req.params
    const innerId = req.params.itemid; // Extract 'aboutUsId' from req.params
    const Department = req.params.departmentName;
    console.log('Approve Aboutus', Department)

    // Define a mapping between Department values and models
    const modelsMapping = {
      'FOM': facultyOfMedicineModel,
      'FON': facultyOfNursingModel,
      'FOPMS': facultyOfParaMedicalSciencesModel,
      'FOP': facultyOfPharmacyModel,
      'FODS': facultyOfDentalSciencesModel,
    };
    if (!modelsMapping.hasOwnProperty(Department)) {
      return res.status(400).send({ status: false, message: `Invalid Department value: ${Department}` });
    }
    const FacultyModel = modelsMapping[Department];
    const getData = await FacultyModel.findById(parentId);
    if (!getData) { return res.status(404).json({ error: 'Department not found' }) }
    const innerItem = getData.aboutus.id(innerId);
    if (!innerItem) { return res.status(404).json({ error: 'Department item not found' }) }
    { innerItem.superDuperAdminApprovalStatus = 'Approved'; }
    await getData.save();
    res.status(200).json(innerItem);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports.ApproveDepartmentItems = ApproveDepartmentItems;

const RejectDepartmentItems = async (req, res) => {
  try {
    const parentId = req.params.id; // Extract 'id' from req.params
    const innerId = req.params.itemid; // Extract 'aboutUsId' from req.params
    const Department = req.params.departmentName;
    const codeforrRes = req.params.codeforrRes
    const DepartmentItem = req.params.departmentItem;
    const Role = req.params.Role
    console.log('reject Aboutus ', Department)

    // Define a mapping between Department values and models
    const modelsMapping = {
      'FOM': facultyOfMedicineModel,
      'FON': facultyOfNursingModel,
      'FOPMS': facultyOfParaMedicalSciencesModel,
      'FOP': facultyOfPharmacyModel,
      'FODS': facultyOfDentalSciencesModel,
    };
    if (!modelsMapping.hasOwnProperty(Department)) {
      return res.status(400).send({ status: false, message: `Invalid Department value: ${Department}` });
    }
    const FacultyModel = modelsMapping[Department];

    const modelsItems = {
      'ABS': 'aboutus',
      'FAS': 'facultyAndStaff',
      'RAP': 'researchAndPublications',
      'ACS': 'academics',
      'IPS': 'inPatientService',
      'OPS': 'outPatientService',
      'PL': 'priceList',
      'MAV': 'MisionAndVision',
      'LINK': 'links',
      'GALLERY': 'gallery',
      'NOT': 'notice',
      'HOD': 'headOfDepartment',
      'INFRA': 'infrastructure',
      'LO': 'learningObjective',
      'BP': 'bestPractices',
      'UP': 'universityPosition',
      'EOBD': 'eventOrgDeprtmt',
      'SC': 'studentCorner',
      'RP': 'researchAndProjects',


    }
    if (!modelsItems.hasOwnProperty(DepartmentItem)) {
      return res.status(400).send({ status: false, message: `Invalid Department item value: ${DepartmentItem}` });
    }
    const ItemModel = modelsItems[DepartmentItem];
    console.log('ItemModel---', ItemModel)

    const getData = await FacultyModel.findById(parentId);
    if (!getData) { return res.status(404).json({ error: 'Department not found' }) }
    const innerItem = getData[ItemModel].id(innerId);
    if (!innerItem) { return res.status(404).json({ error: 'Department item not found' }) }
    if (Role == 'Chess') {
      if (codeforrRes == 'rej') {
        { innerItem.superDuperAdminApprovalStatus = 'Rejected'; }
      }
      else if (codeforrRes == 'apv') {
        { innerItem.superDuperAdminApprovalStatus = 'Approved'; }
      }
    }
    if(Role== 'Music'){
      if (codeforrRes == 'rej') {
        { innerItem.adminApprovalStatus = 'Rejected'; }
      }
      else if (codeforrRes == 'apv') {
        { innerItem.adminApprovalStatus = 'Approved'; }
      }
    }

    await getData.save();
    res.status(200).json(innerItem);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports.RejectDepartmentItems = RejectDepartmentItems;
