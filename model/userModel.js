const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  title: { type: String },
  name: { type: String, required: true },
  email: { type: String },
  punchingid: { type: String },
  department: { type: String, default: "" },
  designation: { type: String, default: "" },
  mob: { type: String, default: "" },
  modifiedBy: { type: String, default: "" },
  createdBy: { type: String, default: "" },
  deletedBy: { type: String, default: "" },
  password: { type: String },
  doctorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctorProfile', default: null },
  role: { type: String, required: true, enum: ['Super Admin', 'Admin', 'Moderator', 'User'] },
  isDeleted: { type: Boolean, default: false },
  imageUrl: { type: String },
  passwordReset: { type: Boolean, default: false },
  sessionID: { type: String },
  moniterd_ttl: { type: String },
  token: { type: String, default: "" },
  adminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  // Approval status for super admin
  superAdminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  // Approval status for super duper admin
  superDuperAdminApprovalStatus: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

});


userSchema.statics.findByCredentials = async function (credential, password) {
  try {
    // Attempt to find the user by either email or enrollment_no
    // console.log(credential, "CREDENTIALS");
    const { email, punchingid } = credential;
    let user;
    if (email !== undefined && email !== "") {
      user = await User.findOne({
        email: email, isDeleted: false
      });

    } else {
      user = await User.findOne({
        punchingid: punchingid, isDeleted: false
      });
    }


    if (!user) {
      throw new Error('Invalid login credentials or user deleted USER');
    }

    const isSamePassword = bcrypt.compareSync(password, user.password);

    if (isSamePassword) {
      return user;
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    // Handle errors
    // console.error('Error in findByCredentials:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};




userSchema.methods.toJSON = function () {// defining a new instance method (toJSON) on the userSchema.methods. Instance methods are methods that are available on
  // individual instances of the model (i.e., documents) and can be called on a specific user object.

  const user = this; //Inside the toJSON method, this refers to the current user object. It captures the reference to the user object being operated upon.

  const userObject = user.toObject();//toObject() function is called on the user to convert it into a plain JavaScript object. This step is necessary because
  // Mongoose objects have additional internal properties and methods that are not needed when sending the user data as a JSON response.

  delete userObject.password; //The password property is deleted from the userObject  for security reasons.

  return userObject;// The modified userObject, which now lacks the password property, is returned.
}



// -------before saving => hash the password-------------
// it is a middlewear function that is executed before saving a user object to the database
userSchema.pre('save', function (next) { // This code adds a pre-save middleware to the
  // userSchema. function will be executed before saving a user document to the database whenever the .save() method is called on a user instance.

  const user = this;// explain above

  if (!user.isModified('password')) return next();//This line checks if the user's password has been modified or if it's a new user being created.
  //  The isModified('password') method of the user object checks if the 'password' field has been changed since the last save operation. If the
  //  password is not modified (for example, when updating other fields but not the password), the function exits early by calling next() to continue
  //  with the next middleware or the save operation.

  bcrypt.genSalt(10, function (err, salt) {//: If the password is modified or it's a new user being created, this line generates a salt using bcrypt. A salt is a random value used to hash the password securely
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {//After generating the salt, this line hashes the user's password using the generated salt. The hash function of bcrypt takes the password and the salt as arguments and returns a hashed password.
      if (err) return next(err);
      user.password = hash; //Once the password is successfully hashed, the hashed password is set as the value of the 'password' field of the user object. This ensures that the password stored in the database is the hashed version, not the plain text password.
      next();//function is called to continue with the save operation.
    })
  })
})

// ---------------------------------------------------------------
// Mongoose middleware function that is executed before removing a user document from the database. This middleware is designed to remove all orders associated with the user being removed

userSchema.pre('remove', function (next) {// This code adds a pre-remove middleware to the userSchema. The middleware function will be executed before removing a user document from the database whenever the .remove() method is called on a user instance.

  this.model('order').remove({ owner: this._id }, next);//The middleware uses the Mongoose model method to get the model for the "order" collection. It then calls the remove method on the "order" model to delete all orders where the owner field matches the _id of the user being removed.
})

const User = mongoose.model('smsuser', userSchema);

module.exports = User;




