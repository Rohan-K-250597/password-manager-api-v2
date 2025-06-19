require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER,
    pass: process.env.MAIL_PASSWORD,
  },
});
const userDeleteMailOptions = (email, otp) => ({
  from: "Anzen Server<responseserver276@gmail.com>",
  to: email,
  subject: "Your OTP for Account Deletion on Anzen Server",
  html: `<html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear ${email},</p>
        <p>We have received a request to delete your account associated with this email address on Anzen Server.</p>
        
        <p>To confirm and proceed with the deletion of your account, please use the One-Time Password (OTP) provided below. This OTP is valid for the next 5 minutes.</p>
        
        <p><b>Your OTP:</b> ${otp}</p>
        
        <p>Please note that once your account is deleted, all your stored data will be permanently removed and cannot be recovered.</p>
        
        <p>If you did not request this, please contact our support team immediately.</p>
        
        <p>Thank you for using Anzen Server.<br>
        Best regards,<br>
        The Anzen Server Team</p>
      </body>
    </html>`,
});

const userDeletedMailOptions = (email) => ({
  from: "Anzen Server<responseserver276@gmail.com>",
  to: email,
  subject: "Account Deletion Confirmation from Anzen Server",
  html: `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear ${email},</p>
        <p>We are writing to confirm that your account on Anzen Server has been successfully deleted.</p>
        
        <p>If you did not request this deletion or believe this to be an error, please contact our support team immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
        
        <p>Thank you for having been a part of the Anzen Server community. If you ever wish to rejoin, we would be delighted to welcome you back.</p>
        
        <p>Best regards,<br>
        The Anzen Server Team</p>
      </body>
    </html>   `,
});

//Welcome mail

const welcomeMailOptions = (email) => ({
  from: "Anzen Server<responseserver276@gmail.com>",
  to: email,
  subject: "Welcome to Anzen Server - Your Password Security Partner!",
  html: `
       <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Dear ${email},</p>
            <p>Welcome to Anzen Server!</p>
            <p>We are thrilled to have you onboard. Your security is our top priority, and with Anzen Server, you can be assured that your passwords are stored safely and securely. Our cutting-edge technology ensures that your data is protected with the highest standards of encryption.</p>
        
            <h3>Here’s what you can do with Anzen Server:</h3>
            <ul>
              <li>Securely Store Passwords: Save all your passwords in one secure place.</li>
              <li>Easy Access: Access your passwords anytime, anywhere with our user-friendly interface.</li>
              <li>Two-Factor Authentication via E-mail: Add an extra layer of security with two-factor authentication via email.</li>
            </ul>
        
            <h3>Getting Started:</h3>
            <ol>
              <li>Login to your account: <a href="https://anzen-password.netlify.app/" target="_blank">Log In</a></li>
              <li>Add Your First Password: Navigate to the 'Add Account' section and start securing your accounts.</li>
              <li>Explore Features: Check out our features and customize your settings for an enhanced security experience.</li>
            </ol>
        
            <p>If you have any questions or need assistance, our support team is here to help. Feel free to reach out to us at <a href="mailto:support@example.com">support@example.com</a> or visit our Help Center.</p>
        
            <p>Thank you for choosing Anzen Server. We look forward to keeping your digital life secure.</p>
        
            <p>Best regards,<br>
            The Anzen Server Team</p>
          </body>
        </html>
  `,
});

//Forgot Password OTP
const generatePasswordResetMailOptions = (email, otp) => ({
  from: "Anzen Server <responseserver276@gmail.com>",
  to: email,
  subject: "Password Reset OTP from Anzen Server",
  html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${email},</p>
          <p>We received a request to reset your password for your Anzen Server account. Please use the following OTP to reset your password:</p>
          <p style="font-size: 20px; font-weight: bold;">OTP: ${otp}</p>
          <p>If you did not request a password reset, please ignore this email or contact our support team immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
          <p>Thank you for using Anzen Server.</p>
          <p>Best regards,<br>
          The Anzen Server Team</p>
        </body>
      </html>`,
});
const generateLoginOtpMailOptions = (email, otp) => ({
  from: "Anzen Server <responseserver276@gmail.com>",
  to: email,
  subject: "Login OTP from Anzen Server",
  html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear ${email},</p>
          <p>You are attempting to log in to your Anzen Server account. Please use the following OTP to complete your login:</p>
          <p style="font-size: 20px; font-weight: bold;">OTP: ${otp}</p>
          <p>If you did not attempt to log in, please ignore this email or contact our support team immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
          <p>Thank you for using Anzen Server.</p>
          <p>Best regards,<br>
          The Anzen Server Team</p>
        </body>
      </html>`,
});

// ADD MAIL OPTIONS  FORGOT PASSWORD
module.exports = {
  transporter,
  userDeleteMailOptions,
  userDeletedMailOptions,
  welcomeMailOptions,
  generatePasswordResetMailOptions,
  generateLoginOtpMailOptions,
};
