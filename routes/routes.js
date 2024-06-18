const express = require('express');
const app = express()
const router = express.Router();
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { authentication, authorisation, authorisationEditor, authorisationAdmin, authorisationForResetPass, authenticationSuperAdmin } = require('../auth/authorization')
// const { authorisationForDocResetPass } = require('../auth/doctorauth')
const { schoolAuthentication, schoolAuthorisationForDocResetPass } = require('../auth/schoolAuth')
const userController = require('../controller/userController')
const SchoolDataController = require('../controller/schoolDataController')
const StudentController = require('../controller/studentController')
const CreateTeamController = require('../controller/teamController')
const SchoolTeamController = require('../controller/schoolTeamController')
const CaptchaController = require('../controller/captcha')
const OTPController = require('../controller/authController')
const playerController = require('../controller/playerController')

//------------------------------------------------------------------------------------------------------------------------------------------------------
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileTypeFolder =
            file.fieldname === 'images' ||
                file.fieldname === 'image' ||
                file.fieldname === 'imageOne' ||
                file.fieldname === 'imageTwo' ||
                file.fieldname === 'imageThree' ||
                file.fieldname === 'imageFour' ||
                file.fieldname === 'imageFive' ||
                file.fieldname === 'imageSix'
                ? 'uploads/images/' : 'uploads/pdfs/';
        cb(null, fileTypeFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    console.log('file', file);
    const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const allowedPdfExtensions = ['.pdf'];

    const extname = path.extname(file.originalname).toLowerCase();
    console.log('extname', extname);

    if (allowedImageExtensions.includes(extname)) {
        return cb(null, true);
    } else if (allowedPdfExtensions.includes(extname)) {
        return cb(null, true);
    }
    cb(new Error('File type not allowed'));
};

const upload = multer({ storage, fileFilter });
// -------- testing for dynamic files
const uploadDynamic = multer({
    storage,
    fileFilter,
}).fields([
    { name: 'images', maxCount: 3 },
    { name: 'pdfs', maxCount: 3 },
]);
//   limit to the users
const ApiAuthLimit = rateLimit({
    // windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 60 * 60 * 1000, // 1 hrs
    // max: 100, // limit each IP to 100 requests per windowMs
    max: 400, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
const authRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 5 minutes
    // windowMs: 60 * 60 * 1000, // 1 hrs
    // max: 100, // limit each IP to 100 requests per windowMs
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

//------------USERs ALL ROUTES-------------------------------------//
router.post('/signup/:userId/:moniterd_ttl', authRateLimit, upload.single('image'), authentication, authorisationAdmin, userController.userSignUp) // coming with image name from frontend
//router.post('/add', authRateLimit, upload.single('image'), userController.userSignUpWithoutauth) // with no authentication
router.get('/user/:userId/:moniterd_ttl', authentication, authorisation, userController.getUser)
router.get('/user/:userId/:moniterd_ttl/:admin', authentication, authorisationAdmin, userController.getUser)
router.post('/auth/login', authRateLimit, userController.userLogin)
router.patch('/api/update/user/:userId/employee/:employeeId/:moniterd_ttl', authRateLimit, upload.single('image'), authentication, authorisationAdmin, userController.UpdateUser) // coming with image name from frontend
router.patch('/api/delete/user/:userId/employee/:employeeId/:moniterd_ttl', authRateLimit, authentication, authorisationAdmin, userController.DeleteUser) // coming with image name from frontend
router.post('/auth/logout/:userId/:moniterd_ttl', authentication, userController.logoutUser)
// router.get('/api/auth/:userId/:moniterd_ttl', authentication, authorisationForResetPass, userController.userFindById)
router.patch('/api/passreset/user/:userId/employee/:employeeId/:moniterd_ttl', upload.single('image'), authRateLimit, authentication, authorisationForResetPass, userController.UserPassReset) // coming with image name from frontend
router.get('/api/user/:subDepartmentName', userController.getUserDepartmentwise)
router.get('/doctor/profile/:userId/:moniterd_ttl', authentication, userController.getUser)

// ------------------------------------- // school Login API \\ -------------------------------------
router.post('/student/login', authRateLimit, SchoolDataController.schoolLogin)
router.get('/api/student/auth/:userId/:moniterd_ttl', schoolAuthentication, SchoolDataController.getSchoolFindById)
// using to upload the xlsx file
// router.get('/api/schoolDataInsertMany', SchoolDataController.schoolDataInsertMany)
router.get('/api/schooldata', SchoolDataController.getAllSchool)
router.get('/api/school', SchoolDataController.getSchool)
router.patch('/api/passreset/school/:userId/employee/:employeeId/:moniterd_ttl', upload.single('image'), authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolDataController.schoolPassReset) // coming with image name from frontend
router.patch('/api/passreset/school/:userId/:moniterd_ttl', upload.single('image'), authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolDataController.schoolPassReset) // coming with image name from frontend
//  get api to check the session of the school
router.get('/api/auth/:userId/:moniterd_ttl', schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolDataController.schoolFindById)

//  create student
router.post('/student/register/:userId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, StudentController.studentRegistration) // coming with image name from frontend
router.get('/getstudent/:userId/:udisecode/:moniterd_ttl', authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, StudentController.getStudent) // coming with image name from frontend
router.get('/getunselectedstudent/:userId/:udisecode/:moniterd_ttl', authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, StudentController.getUnSelectedStudent) // coming with image name from frontend
router.patch('/update/student/register/:userId/:studentId/:action/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, StudentController.updateStudentRegistration) // coming with image name from frontend
// saveStudentBatteryTestScore
router.patch('/save/student/battery-test/:userId/:studentId/:action/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, StudentController.saveStudentBatteryTestScore) // coming with image name from frontend
router.get('/student-profile/:studentId/:userId/:udisecode/:moniterd_ttl', authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, StudentController.getStudentById)
router.patch('/update/individual/:userId/:studentId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, StudentController.updateStudentReward) // coming with image name from frontend


//  create team 
router.post('/create/team/:userId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, CreateTeamController.CreateTeam) // coming with image name from frontend
router.get('/getteam/:userId/:studentId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, CreateTeamController.getTeam) // coming with image name from frontend
router.get('/getCreateteam/:userId/:studentId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, CreateTeamController.getTeamAfterCreate) // coming with image name from frontend
router.patch('/update/team/:userId/:teamid/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, CreateTeamController.updateTeam) // coming with image name from frontend
router.get('/team-details/:teamId/:userId/:studentId/:moniterd_ttl', authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, CreateTeamController.getTeamById) // coming with image name from frontend
// create school teams
//  create team 
router.post('/create/school/team/:userId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolTeamController.CreateSchoolTeam) // coming with image name from frontend
router.get('/getteam/school/:userId/:studentId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolTeamController.getSchoolTeam) // coming with image name from frontend
router.get('/getCreateteam/school/:userId/:studentId/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolTeamController.getSchoolTeamAfterCreate) // coming with image name from frontend
router.patch('/update/team/school/:userId/:teamid/:moniterd_ttl', authRateLimit, upload.single('image'), schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolTeamController.updateSchoolTeam) // coming with image name from frontend
router.get('/getunselectedstudent/school/:userId/:udisecode/:moniterd_ttl', authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolTeamController.getUnSelectedStudentSchool) // coming with image name from frontend
router.get('/school-team-details/:teamId/:userId/:studentId/:moniterd_ttl', authRateLimit, schoolAuthentication, schoolAuthorisationForDocResetPass, SchoolTeamController.getSchoolTeamById) // coming with image name from frontend


// total registered students count
router.get('/api/total-registered-student', StudentController.totalRegisteredStudent) // coming with image name from frontend

// router.all('/*', function (req, res) {
//     res.status(405).send({ status: false, message: 'Method not allowed' });
// })


// ---------------------------player routes---------------------------------
router.post('/register', authRateLimit, upload.single('image'), playerController.register) // with no authentication



router.post('/api/verify-user', CaptchaController.verifyUserByCaptcha)


router.post('/api/auth/send-otp', OTPController.sendOtp);
router.post('/api/auth/verify-otp', OTPController.verifyOtp);

module.exports = router;

