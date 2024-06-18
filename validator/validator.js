const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
};
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
//to check id is valid or not

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};
//to check any  data available or not
const isValidName = function (name) {
    // let nameRegex = /^[a-zA-z]*$/
    let nameRegex = /^[a-zA-Z\s]*$/
    //    let nameRegex= /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/
    return nameRegex.test(name)
}
//regex for name
const isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}
// regex for email validation

const isValidPhone = function (phone) {
    let mobileRegex = /^[0]?[6789]\d{10}$/
    return mobileRegex.test(phone)
}
//10 didgit mobile number stating with any(6,7,8,9) and 0 if you want to use in mobile number


const isValidPassword = function (password) {
    let passwordregex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#@$%&? "])[a-zA-Z0-9!#@$%&?]{8,15}$/
    return passwordregex.test(password)
}
//  One digit, one upper case , one lower case , its b/w 8 to 15

const isValidRole = function (role) {
    let validRoles = ['Super Admin', 'Admin', 'Editor', 'Administrator', 'User'];
    return validRoles.includes(role);
};

const isValidParagraph = function (paragraph) {
    // console.log('from validation',/(<|>|alert|Script|<\/script>|html)/gi.test(paragraph) )
    return /(<|>|alert|Script|<\/script>|html)/gi.test(paragraph);
}
// use (isValidParagraph(bankName)) to check

const isValidPin = function (pin) {
    let isPin = /^\d{6}$/
    return isPin.test(pin);
}

const isValidEventName = function (event) {
    let eventnameregex = /^[a-zA-Z0-9 -]*$/
    return eventnameregex.test(event)
}

const isValidateDate = function (date) {
    const dateRegex = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2}|20(?:0[0-9]|1[0-9]))$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:0?[1-9]|1[0-2])\4(?:\d{2})?$|^(?:15th)\s(?:0?[1-9]|1[0-2])\s(\d{2,4})$/;
    return dateRegex.test(date)
}

const isValidYear = function (year) {
    // This regex matches a string that consists exactly of 4 digits, representing a year.
    // It expects the year to be from 1900 to 2199, which you can adjust according to your needs.
    return /^(19|21)\d{2}$/.test(year);
}

const isValidCourseCode = function (courseCode) {
    let courseCodeRegex = /^[a-zA-Z0-9 -]*$/; // Allows letters (uppercase and lowercase), numbers, spaces, and hyphens
    return courseCodeRegex.test(courseCode);
};

function validateAadhaarNumber(aadhaarNumber) {
    const aadhaarPattern = /^\d{12}$/;
    return aadhaarPattern.test(aadhaarNumber);
}
//  use (validateAadhaarNumber(aadhaarNumber)) to check



module.exports = { isValid, isValidObjectId, isValidRequestBody, isValidEmail, isValidName, isValidPassword, isValidPhone, isValidRole, isValidParagraph, isValidEventName, isValidPin, isValidateDate, isValidYear, isValidCourseCode, validateAadhaarNumber }