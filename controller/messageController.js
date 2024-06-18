// user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Password generation function
const generateRandomPassword = () => {
    const length = Math.floor(Math.random() * (15 - 8 + 1)) + 8; // Random length between 8 and 15
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '!#@$%&?';
    const allCharacters = lowercaseLetters + uppercaseLetters + numbers + specialCharacters;
    let password = '';
    // Ensure at least one of each type of character
    password += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
    password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    // Fill the rest of the password with random characters
    for (let i = 0; i < length - 4; i++) {
        password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }
    // Shuffle the password characters to ensure randomness
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
};
// Route to create a new user
router.post('/create', async (req, res) => {
    try {
        const { phoneNumber, idseCode, schoolName } = req.body;
        const password = generateRandomPassword(); // Generate random password
        // Create new user
        const newUser = new User({ phoneNumber, idseCode, schoolName, password });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
});

module.exports = router;
