const User = require('../model/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtp = async (req, res) => {
    const { phone } = req.body;
    console.log(phone, "PHONE ")
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ phone, otp, otpExpires: new Date(Date.now() + 10 * 60000) }); // OTP valid for 10 minutes
        } else {
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60000);
        }

        await user.save();

        // console.log(process.env.TWILIO_PHONE_NUMBER, "ENV Number")

        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.log(error, 'Error sending');
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

module.exports.sendOtp = sendOtp;

const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    console.log('Verifying OTP', req.body)

    try {
        const user = await User.findOne({ phone, otp, otpExpires: { $gt: new Date() } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid OTP or OTP expired' });
        }

        user.isVerified = true;
        await user.save();

        // const token = jwt.sign({ phone: user.phone, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ phone: user.phone, id: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};


module.exports.verifyOtp = verifyOtp;