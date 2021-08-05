const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signupSchema = new Schema ({
    email: String,
    password: String
}, {timestamps: true});


const Account = mongoose.model("Account", signupSchema);

module.exports = Account;