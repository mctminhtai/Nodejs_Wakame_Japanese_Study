const express = require("express");
const router = express.Router();
const Account = require("../models/signupModel");

router.route("/signup").post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);
    const NewAccount = new Account ({
        email,
        password
    });

    NewAccount.save();
})

module.exports = router;