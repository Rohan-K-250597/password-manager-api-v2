const { otpGenerator, storeOtp } = require("../utils/otpManager");
const {
    transporter,
    userDeleteMailOptions,
    userDeletedMailOptions,
    welcomeMailOptions,
    generatePasswordResetMailOptions,
    generateLoginOtpMailOptions,
} = require("../utils/mailManager");

const deleteUserOTP = (req, res) => {
    const { email } = req.body;
    const { username } = req.body;
    const newOtp = otpGenerator();
    storeOtp(username, email, newOtp);
    transporter.sendMail(
        userDeleteMailOptions(email, newOtp),
        (error, info) => {
            if (error) {
                console.log(`Error sending email: ${error}`);
                res.status(500).json({ message: "Error sending email" });
            } else {
                console.log(`Email sent: ${info.response}`);
                res.status(200).json({ message: "OTP Sent successfully" });
            }
        },
    );
};
const sendPasswordResetOtp = (email, username, res) => {
    const newOtp = otpGenerator();
    storeOtp(username, email, newOtp);
    transporter.sendMail(
        generatePasswordResetMailOptions(email, newOtp),
        (error, info) => {
            if (error) {
                console.log(`Error sending email: ${error}`);
                res.status(500).json({ message: "Error sending email" });
            } else {
                console.log(`Email sent: ${info.response}`);
                res.status(200).json({
                    message: "OTP Sent successfully",
                    username,
                });
            }
        },
    );
};
// User deleted validation
const userDeleted = (email, res) => {
    transporter.sendMail(userDeletedMailOptions(email), (error, info) => {
        if (error) {
            console.log(`Error sending email: ${error}`);
            res.status(500).json({ message: "Error sending email" });
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};
// Wlecome Mail
const welcomeToServer = (email, res) => {
    transporter.sendMail(welcomeMailOptions(email), (error, info) => {
        if (error) {
            console.log(`Error sending email: ${error}`);
            if (!res.headersSent)
                res.status(500).json({ message: "Error sending email" });
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};

//Login OTP
const LoginToServer = (email, username, res) => {
    const newOtp = otpGenerator();
    storeOtp(username, email, newOtp);
    transporter.sendMail(
        generateLoginOtpMailOptions(email, newOtp),
        (error, info) => {
            if (error) {
                console.log(`Error sending email: ${error}`);
                res.status(500).json({ message: "Error sending email" });
            } else {
                console.log(`Email sent: ${info.response}`);
                res.status(200).json({
                    message: "OTP Sent successfully",
                    username,
                });
            }
        },
    );
};
module.exports = {
    deleteUserOTP,
    userDeleted,
    welcomeToServer,
    sendPasswordResetOtp,
    LoginToServer,
};
