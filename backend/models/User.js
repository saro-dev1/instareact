// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    user_type: { type: String, required: true },
    email_id: { type: String, required: true },
    mobile_no: { type: String, required: true },
    otp_code: { type: String },
    otp_verified: { type: Boolean, default: false },
    created_on: { type: Date, default: Date.now },
    status: { type: String, default: 'active' },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    category: { type: String },
    color_code: { type: String },
});

module.exports = mongoose.model('User', userSchema);
