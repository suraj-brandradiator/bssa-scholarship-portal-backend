const axios = require('axios');

async function verifyRecaptcha(recaptchaResponse) {
    try {
        const response = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: "6LcP-_cpAAAAAL-mnsLHUdhk9eKWxaXMwbxxHppp",
                    response: recaptchaResponse,
                },
            }
        );

        return response.data.success;
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        return false;
    }
}

// app.post('/verify-user',
const verifyUserByCaptcha = async (req, res) => {
    const { recaptchaToken } = req.body;

    try {
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);

        if (!isRecaptchaValid) {
            return res.status(400).json({ error: "reCAPTCHA verification failed" });
        } else {
            return res.status(200).json({ status: true, msg: "reCAPTCHA verification done" });
            //Add your success response here
        }
    } catch (error) {
        console.log(error)
    }
}
// );

module.exports.verifyUserByCaptcha = verifyUserByCaptcha;