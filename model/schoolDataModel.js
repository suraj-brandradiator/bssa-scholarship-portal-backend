const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const schoolSchema = new mongoose.Schema({
    District_Name_Code: { type: String, required: true },
    password: { type: String },
    passwordReset: { type: Boolean, default: false },
    Block_Name_Code: { type: String },
    CRC_Name_Code: { type: String },
    Udise_Code: { type: String },
    School_Name: { type: String },
    School_Managment: { type: String },
    School_Category: { type: String },
    School_Location: { type: String },
    Village_name: { type: String },
    Panchayat_name: { type: String },
    Urban_Local_bodies: { type: String },
    Ward_Name: { type: String },
    Address: { type: String },
    Pincode: { type: String },
    Std_Code: { type: String },
    moniterd_ttl: { type: String },
    currentMobileNumuber: { type: String, default: "" },
    currentEmailId: { type: String, default: "" },
    token: { type: String, default: "" },
    role: { type: String, default: "" },
    Phone: { type: String },
    Mobile_Head_master: { type: String },
    School_Email: { type: String },
    School_Website: { type: String },
    Hos_In_Charge_Type: { type: String },
    Hos_In_Charge_Name: { type: String },
    Mobile_HOS: { type: String },
    Respondent_Name: { type: String },
    Respondent_Type: { type: String },
    Respondent_Mobile: { type: String },
    adminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
    superAdminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
    superDuperAdminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'smsuser' },  // Referencing the smsuser model
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'smsuser' },  // Referencing the smsuser model
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'smsuser' }, // Referencing the smsuser model and making it required
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });



schoolSchema.statics.findByCredentials = async function (credential, password) {
    try {
        // Attempt to find the user by either email or enrollment_no
        // const user = await UGStudent.findOne({
        //     $or: [{ email: credential, isDeleted: false }, { enrollment_no: credential, isDeleted: false }],
        // });
        let School_DATA;
        if (credential !== undefined && credential !== "") {
            console.log('from m,odel ', credential, password)
            School_DATA = await School_DATA_Model.findOne({
                Udise_Code: credential,
                isDeleted: false
            });
        }

        console.log('School Data', School_DATA)
        if (!School_DATA) {
            throw new Error('Invalid login credentials or School_DATA_Model deleted UGI ');
        }
        const isSamePassword = bcrypt.compareSync(password, School_DATA.password);
        if (isSamePassword) {
            return School_DATA;
        } else {
            throw new Error('Invalid password');
        }
    } catch (error) {
        // Handle errors
        // console.error('Error in findByCredentials:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};



schoolSchema.methods.toJSON = function () {// defining a new instance method (toJSON) on the userSchema.methods. Instance methods are methods that are available on
    // individual instances of the model (i.e., documents) and can be called on a specific user object.

    const School_DATA_Model = this; //Inside the toJSON method, this refers to the current user object. It captures the reference to the user object being operated upon.

    const School_DATA_ModelObject = School_DATA_Model.toObject();//toObject() function is called on the user to convert it into a plain JavaScript object. This step is necessary because
    // Mongoose objects have additional internal properties and methods that are not needed when sending the user data as a JSON response.

    delete School_DATA_ModelObject.password; //The password property is deleted from the userObject  for security reasons.

    return School_DATA_ModelObject;// The modified userObject, which now lacks the password property, is returned.
}



// -------before saving => hash the password-------------
// it is a middlewear function that is executed before saving a user object to the database
schoolSchema.pre('save', function (next) { // This code adds a pre-save middleware to the
    // userSchema. function will be executed before saving a user document to the database whenever the .save() method is called on a user instance.

    const School_DATA_Model = this;// explain above

    if (!School_DATA_Model.isModified('password')) return next();//This line checks if the user's password has been modified or if it's a new user being created.
    //  The isModified('password') method of the user object checks if the 'password' field has been changed since the last save operation. If the
    //  password is not modified (for example, when updating other fields but not the password), the function exits early by calling next() to continue
    //  with the next middleware or the save operation.

    bcrypt.genSalt(10, function (err, salt) {//: If the password is modified or it's a new user being created, this line generates a salt using bcrypt. A salt is a random value used to hash the password securely
        if (err) return next(err);
        bcrypt.hash(School_DATA_Model.password, salt, function (err, hash) {//After generating the salt, this line hashes the user's password using the generated salt. The hash function of bcrypt takes the password and the salt as arguments and returns a hashed password.
            if (err) return next(err);
            // console.log(hash, "HASHED PASSWORD DURING REGISTRAION");
            School_DATA_Model.password = hash; //Once the password is successfully hashed, the hashed password is set as the value of the 'password' field of the user object. This ensures that the password stored in the database is the hashed version, not the plain text password.
            // console.log(user, "USER In MIDDLEWARE")
            next();//function is called to continue with the save operation.
        })
    })
})

// ---------------------------------------------------------------
// Mongoose middleware function that is executed before removing a user document from the database. This middleware is designed to remove all orders associated with the user being removed

schoolSchema.pre('remove', function (next) {// This code adds a pre-remove middleware to the userSchema. The middleware function will be executed before removing a user document from the database whenever the .remove() method is called on a user instance.

    this.model('order').remove({ owner: this._id }, next);//The middleware uses the Mongoose model method to get the model for the "order" collection. It then calls the remove method on the "order" model to delete all orders where the owner field matches the _id of the user being removed.
})

const School_DATA_Model = mongoose.model('school_datas', schoolSchema);

module.exports = School_DATA_Model;
