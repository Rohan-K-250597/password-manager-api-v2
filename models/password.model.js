const mongoose = require("mongoose");
const passwordSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  password: {
    iv: { type: String, required: true },
    content: { type: String, required: true },
  },
  site: { type: String },
  username: { type: String, required: true },
  lastAccessed: { type: Date, default: Date.now },
  remindAfterDays: { type: Number, default: -1 },
  description: {
    type: String,
    default: " ",
  },
  website: {
    type: String,
    default: "",
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
});

module.exports = { passwordSchema };
