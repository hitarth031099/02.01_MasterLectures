const express = require('express');
const router = express.Router();
const { check } = require("../config/check");
const user = require("../data/user");

router.post('/', async (req, res) => {
    let errors = [];

    let inputs = req.body;
    if (Object.keys(inputs).length != 2) errors.push("Number of body paraments is not 2!")
    let username, password;
    if (!(username = check(inputs.username, "username"))) errors.push("Username is not vaild!");
    if (!(password = check(inputs.password, "password"))) errors.push("Password is not vaild!");

    if (errors.length != 0) {
        res.status(400).render('signup',
            {
                "title": "signup",
                "hasError": true,
                "errors": errors,
                "username": req.body.username,
            });
        return;
    }

    try {
        const result = await user.createUser(username, password);
        if (result.userInserted == true) {
            req.session.user = { "username": username };
            res.redirect('/private')
        } else {
            res.status(500).render('signup', { "error": "Internal Server Error" });
            return;
        }
    } catch (error) {
        res.status(400).render('signup',
            {
                "title": "signup",
                "hasError": true,
                "errors": [error],
                "username": req.body.username,
            });
        return;
    }
})

module.exports = router;