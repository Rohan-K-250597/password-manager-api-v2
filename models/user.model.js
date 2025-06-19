const mongoose = require("mongoose");
const { passwordSchema } = require("./password.model");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
        default: "",
    },
    lastName: {
        type: String,
        trim: true,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    passwords: [passwordSchema],
    favourites: [passwordSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
