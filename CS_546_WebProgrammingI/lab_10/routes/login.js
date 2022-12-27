const express = require('express');
const router = express.Router();
const { check } = require("../config/check");
const user = require("../data/user");

router.get('/', async (req, res) => {
    res.render("login", { "title": "login" });
});

router.post('/', async (req, res) => {
    let errors = [];

    let inputs = req.body;
    if (Object.keys(inputs).length != 2) errors.push("Number of body paraments is not 2!")
    let username, password;
    if (!(username = check(inputs.username, "username"))) errors.push("Username is not vaild!");
    if (!(password = check(inputs.password, "password"))) errors.push("password is not vaild!");

    if (errors.length != 0) {
        res.status(400).render('login',
            {
                "title": "login",
                "hasError": true,
                "errors": errors,
                "username": req.body.username,
            });
        return;
    }

    try {
        const result = await user.checkUser(username, password);
        if (result.authenticated == true) {
            req.session.user = { "username": username };
            res.redirect('/private')
        } else {
            res.status(500).render('login', { "error": "Internal Server Error" });
            return;
        }
    } catch (error) {
        res.status(400).render('login',
            {
                "title": "login",
                "hasError": true,
                "errors": [error],
                "username": req.body.username,
            });
        return;
    }

});

module.exports = router;