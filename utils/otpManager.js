const randomString = require("randomstring");

const otps = [];
//OTP Generator
const otpGenerator = () =>
    randomString.generate({
        length: 6,
        charset: "numeric",
    });

//Storing OTP
const storeOtp = (username, email, otp) => {
    const newOtp = {
        username,
        email,
        otp,
        expiry: Date.now() + 300000, // Valid for 5 minutes,
    };
    const emailIndex = otps.findIndex((ele) => ele.email === email);
    if (emailIndex !== -1) {
        otps[emailIndex] = newOtp;
    } else {
        otps.push(newOtp);
    }
};

// Verifying OTP
const verifyOtp = (username, otp) => {
    const entry = otps.find(
        (ele) =>
            (ele.username === username || ele.email === username) &&
            ele.otp === otp,
    );
    if (entry) {
        if (entry.expiry - Date.now() > 0) {
            otps.splice(otps.indexOf(entry), 1);
            return true;
        } else {
            const error = new Error("OTP Expired");
            error.status = 403;
            error.message = "OTP Expired";
            otps.splice(otps.indexOf(entry), 1);
            throw error;
        }
    } else {
        const error = new Error("Invalid OTP");
        error.status = 400;
        error.message = "Invalid OTP";
        throw error;
    }
};
module.exports = {
    otpGenerator,
    storeOtp,
    verifyOtp,
};
