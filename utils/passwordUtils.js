const generateRandomPassword = (firstName) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = 8; // Minimum password length
    const minLowercaseChars = 1; // Minimum lowercase characters
    const minUppercaseChars = 1; // Minimum uppercase characters
    const minNumericChars = 1; // Minimum numeric characters

    let newPassword = firstName.charAt(0).toUpperCase(); // Start with the uppercase first letter of the first name
    let lowercaseCount = 0;
    let uppercaseCount = 0;
    let numericCount = 0;

    for (let i = 0; i < passwordLength - 1; i++) {
        const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
        newPassword += randomChar;

        // Check if the random character satisfies the criteria
        if (/^[a-z]$/.test(randomChar)) lowercaseCount++;
        else if (/^[A-Z]$/.test(randomChar)) uppercaseCount++;
        else if (/^[0-9]$/.test(randomChar)) numericCount++;
    }

    // Fill in additional characters to meet the criteria if necessary
    for (let i = 0; i < minLowercaseChars - lowercaseCount; i++) {
        const randomChar = chars.charAt(Math.floor(Math.random() * 26) + 26); // Random lowercase letter
        newPassword += randomChar;
        lowercaseCount++;
    }

    for (let i = 0; i < minUppercaseChars - uppercaseCount; i++) {
        const randomChar = chars.charAt(Math.floor(Math.random() * 26)); // Random uppercase letter
        newPassword += randomChar;
        uppercaseCount++;
    }

    for (let i = 0; i < minNumericChars - numericCount; i++) {
        const randomChar = chars.charAt(Math.floor(Math.random() * 10) + 52); // Random numeric digit
        newPassword += randomChar;
        numericCount++;
    }

    // Shuffle the generated password characters to make it more random
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    return newPassword;
};


module.exports = generateRandomPassword;
